import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnsembleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  genre: string;
}
