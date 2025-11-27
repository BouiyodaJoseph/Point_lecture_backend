import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  // On peut ajouter une validation sur la longueur pour accepter 6 ou 7 caractères (avec le tiret)
  @Length(6, 7)
  code: string;
}