import { IsString, IsNotEmpty, IsNumber, IsInt, IsUUID } from 'class-validator';

export class CreateEstablishmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsInt()
  geofenceRadius: number;

  @IsUUID()
  partnerId: string;
}