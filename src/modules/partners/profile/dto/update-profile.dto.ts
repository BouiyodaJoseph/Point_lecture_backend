import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() // <-- AJOUTER ICI
  @IsString()
  @IsNotEmpty()
  name?: string; // <-- Le `?` est une bonne pratique pour le typage

  @IsOptional() // <-- AJOUTER ICI
  @IsEmail()
  email?: string; // <-- Le `?` est une bonne pratique pour le typage
}