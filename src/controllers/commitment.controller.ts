import { BadRequestException, Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { COMMITMENT_EXISTED } from "src/common/message";
import { CreateCommitmentDto } from "src/dtos/create-commitment.dto";
import { Commitment } from "src/schemas";
import { CommitmentService } from "src/services";
import * as eccrypto from "eccrypto";
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
    // await this.commitmentService.create(createCommitmentDto);
    const privateKey = Buffer.from(this.configService.get("private_key") as string, "hex");
    const publicKey = eccrypto.getPublic(privateKey);
    console.log(publicKey);
    const signature = await eccrypto.sign(privateKey, Buffer.from("mug00"));
    console.log(signature);
    const nodeCommitmentResponse = new NodeCommitmentDto(
      createCommitmentDto.commitment,
      signature.toString("hex"),
      publicKey.toString("hex"),
    );
    return nodeCommitmentResponse;
  }
}
