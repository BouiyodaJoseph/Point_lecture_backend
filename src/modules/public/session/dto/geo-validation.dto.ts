import { IsLatitude, IsLongitude, IsJWT } from 'class-validator';

export class GeoValidationRequestDto {
  @IsJWT({ message: 'Le token doit être un JWT valide.' })
  token: string;

  @IsLatitude({ message: 'La latitude fournie est invalide.' })
  latitude: number;

  @IsLongitude({ message: 'La longitude fournie est invalide.' })
  longitude: number;
}