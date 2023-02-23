import { IsNotEmpty, IsString } from "class-validator";

export class NodeSharedSecretDto {
  readonly threshold: number;
  readonly metadata: {
    iv: string;
    ephemPublicKey: string;
    ciphertext: string;
    mac: string;
  };
  readonly publicKey: string;
}
