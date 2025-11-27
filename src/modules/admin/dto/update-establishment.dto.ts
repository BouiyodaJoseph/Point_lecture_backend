import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional } from 'class-validator';

export class UpdateEstablishmentDto {
  @IsOptional() @IsString() @IsNotEmpty()
  name?: string;

  @IsOptional() @IsNumber()
  latitude?: number;

  @IsOptional() @IsNumber()
  longitude?: number;

  @IsOptional() @IsInt()
  geofenceRadius?: number;
}