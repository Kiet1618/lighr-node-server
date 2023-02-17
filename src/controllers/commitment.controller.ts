import * as eccrypto from "eccrypto";
import { ec } from "elliptic";
import { BadRequestException, Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { COMMITMENT_EXISTED } from "src/common/message";
import { CreateCommitmentDto } from "src/dtos/create-commitment.dto";
import { CommitmentService } from "src/services";
import { NodeCommitmentDto } from "src/dtos/node-commitment.dto";

@Controller("commitments")
export class CommitmentController {
  constructor(
    private readonly commitmentService: CommitmentService,
    private configService: ConfigService,
  ) {}

  @Post()
  async createCommitment(
    @Body() createCommitmentDto: CreateCommitmentDto,
  ): Promise<NodeCommitmentDto> {
    let existedCommitment = await this.commitmentService.findCommitment(
      createCommitmentDto.commitment,
    );
    if (existedCommitment) {
      throw new BadRequestException(COMMITMENT_EXISTED);
    }

    const secp256k1 = new ec("secp256k1");
    const privateKey = this.configService.get("private_key") as string;
    const keyPair = secp256k1.keyFromPrivate(privateKey);
    const publicKey = keyPair.getPublic("hex");
    const data = "mug00" + publicKey + createCommitmentDto.commitment;

    const signature = keyPair.sign(data).toDER("hex");

    const nodeCommitmentResponse = new NodeCommitmentDto(
      data,
      signature,
      publicKey,
    );
    return nodeCommitmentResponse;
  }
}
