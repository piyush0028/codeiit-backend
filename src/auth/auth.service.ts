import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: Partial<User> }> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { iitk_email: registerDto.iitk_email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if roll number already exists
    const existingRoll = await this.usersRepository.findOne({
      where: { roll_number: registerDto.roll_number },
    });

    if (existingRoll) {
      throw new ConflictException('Roll number already registered');
    }

    // Create user
    const user = this.usersRepository.create({
      iitk_email: registerDto.iitk_email,
      password_hash: registerDto.password, // Will be hashed by @BeforeInsert
      full_name: registerDto.full_name,
      roll_number: registerDto.roll_number,
      branch: registerDto.branch,
      year_of_study: registerDto.year_of_study,
      cgpa: registerDto.cgpa,
      iitk_verified: false, // Explicitly set to false
    });

    // Generate verification OTP
    const otp = this.emailService.generateOTP();
    user.verification_token = otp;

    // Save user
    const savedUser = await this.usersRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(user.iitk_email, otp);

    // Remove sensitive data from response
    const { password_hash, verification_token, ...userWithoutSensitive } = savedUser;

    return {
      message: 'Registration successful. Please check your IITK email for verification OTP.',
      user: userWithoutSensitive,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Partial<User> }> {
    // Find user
    const user = await this.usersRepository.findOne({
      where: { iitk_email: loginDto.iitk_email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.iitk_verified) {
      throw new UnauthorizedException('Please verify your IITK email first');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(loginDto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.iitk_email,
      roll_number: user.roll_number 
    };
    
    const access_token = this.jwtService.sign(payload);

    // Remove sensitive data from response
    const { password_hash, verification_token, ...userWithoutSensitive } = user;

    return {
      access_token,
      user: userWithoutSensitive,
    };
  }

  async verifyEmail(otp: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { verification_token: otp },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    // Mark email as verified and clear token
    user.iitk_verified = true;
    
    // Use empty string instead of null to avoid TypeScript errors
    user.verification_token = '';
    
    await this.usersRepository.save(user);

    return { message: 'Email verified successfully. You can now login.' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { iitk_email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.iitk_verified) {
      throw new ConflictException('Email already verified');
    }

    // Generate new OTP
    const otp = this.emailService.generateOTP();
    user.verification_token = otp;
    await this.usersRepository.save(user);

    // Send new verification email
    await this.emailService.sendVerificationEmail(email, otp);

    return { message: 'Verification email resent. Please check your inbox.' };
  }
}