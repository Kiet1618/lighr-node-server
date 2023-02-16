import { IsNotEmpty, IsString } from "class-validator";

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  readonly owner: string;
}
