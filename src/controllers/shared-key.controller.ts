import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { secp256k1 } from "src/common/secp256k1";
import { LookupSharedSecretDto } from "src/dtos/lookup-shared-secret.dto";
import { CommitmentService, SharedKeyService } from "src/services";
import * as eccrypto from "eccrypto";
import { VerifyGuard } from "src/verifier/verify.guard";
import { NodeSharedSecretDto } from "src/dtos/node-shared-secret.dto";
import { keccak } from "src/utils/wallet";

@Controller("shared-keys")
export class SharedKeyController {
  constructor(
    private readonly sharedKeyService: SharedKeyService,
    private readonly commitmentService: CommitmentService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(VerifyGuard)
  async lookupSharedSecret(
    @Body() lookupSharedSecretDto: LookupSharedSecretDto,
  ): Promise<NodeSharedSecretDto> {
    const { idToken, tempPub, nodeSignatures, owner } = lookupSharedSecretDto;

    const hashIdToken = keccak("keccak256").update(idToken).digest().toString("hex");
    const existedCommitment = await this.commitmentService.findCommitment(hashIdToken);
    if (!existedCommitment) {
      throw new BadRequestException("Commitment of Id Token doesn't exist ");
    }

    const nodePrivateKey = this.configService.get("private_key") as string;
    const keyPair = secp256k1.keyFromPrivate(nodePrivateKey);
    const pubNode = keyPair.getPublic("hex");

    const nodeSignature = nodeSignatures.find((node) => node.pubNode === pubNode);
    if (!nodeSignature) {
      throw new BadRequestException("Node signatures does not contain this node");
    }

    const { sharedSecret } = await this.sharedKeyService.findSharedKeyByOwner(owner);

    const { mac, ciphertext, iv, ephemPublicKey } = await eccrypto.encrypt(
      Buffer.from(tempPub, "hex"),
      Buffer.from(sharedSecret),
    );

    return {
      publicKey: pubNode,
      threshold: 1,
      metadata: {
        ciphertext: ciphertext.toString("hex"),
        mac: mac.toString("hex"),
        iv: iv.toString("hex"),
        ephemPublicKey: ephemPublicKey.toString("hex"),
      },
    };
  }
}
