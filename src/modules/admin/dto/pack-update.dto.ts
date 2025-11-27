import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PackUpdateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsUUID('4', { each: true }) // Valide que chaque élément du tableau est un UUID v4
  publicationIds: string[];
}