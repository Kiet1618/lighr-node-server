import { IsNotEmpty, IsString } from "class-validator";
import { Wallet } from "src/schemas";

export class LookupWalletDto {
  @IsString()
  @IsNotEmpty()
  readonly owner: string;
  readonly address: string;
  readonly publicKey: string;
}
