import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommitmentDto {
  @IsString()
  @IsNotEmpty()
  readonly commitment: string;

  @IsString()
  @IsNotEmpty()
  readonly tempPub: string;
}
