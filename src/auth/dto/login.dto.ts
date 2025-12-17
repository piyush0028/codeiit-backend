import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/@iitk\.ac\.in$/, {
    message: 'Email must be an IIT Kanpur email',
  })
  iitk_email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}