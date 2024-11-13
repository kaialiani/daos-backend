import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMembershipDto {
  @IsNotEmpty()
  @IsString()
  ensembleId: string;
}
