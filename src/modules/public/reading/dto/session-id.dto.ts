import { IsNotEmpty, IsUUID } from 'class-validator';

export class SessionIdDto {
    @IsUUID()
    @IsNotEmpty()
    session_id: string;
}