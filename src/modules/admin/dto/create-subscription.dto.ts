import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  partnerId: string;

  @IsUUID()
  packId: string;

  @IsInt()
  @IsNotEmpty()
  durationInDays: number;
}