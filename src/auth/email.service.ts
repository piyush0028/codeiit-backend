import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  // For MVP, we'll just log the OTP
  // In production, integrate with IITK SMTP or SendGrid
  
  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    console.log(`📧 Verification email to: ${email}`);
    console.log(`🔢 OTP: ${otp}`);
    console.log(`👉 Verification link: http://localhost:3001/verify?token=${otp}`);
    
    // TODO: Integrate with actual email service
    // For now, we'll just log and work with console OTP
  }

  generateOTP(): string {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}