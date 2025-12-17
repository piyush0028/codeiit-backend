import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/@iitk\.ac\.in$/, {
    message: 'Email must be an IIT Kanpur email (@iitk.ac.in)',
  })
  iitk_email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}[A-Za-z]{2,3}\d{3,4}$/, {
    message: 'Invalid IITK roll number format',
  })
  roll_number: string;

  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsNotEmpty()
  year_of_study: number;

  cgpa?: number;
}