import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() @IsNotEmpty()
  name?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsIn(['ROLE_ADMIN', 'ROLE_PARTNER'])
  role?: string;
}