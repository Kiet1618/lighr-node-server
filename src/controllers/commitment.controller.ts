
import { BadRequestException, Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { COMMITMENT_EXISTED } from "src/common/message";
import { CreateCommitmentDto } from "src/dtos/create-commitment.dto";
import { Commitment } from "src/schemas";
import { CommitmentService } from "src/services";

@Controller("commitments")
export class CommitmentController {
    constructor(private readonly commitmentService: CommitmentService) {}

    @Post()
    async createCommitment(@Body() createCommitmentDto: CreateCommitmentDto): Promise<Commitment> {
        let existedCommitment = await this.commitmentService.findCommitment(createCommitmentDto.commitment);
        if (existedCommitment) {
          throw new BadRequestException(COMMITMENT_EXISTED);  
        } 
        // Missing
        // Signature message 
        // const signature = sign(commitment);
        // commitment.toString(), nodePubX, nodePubY
        return await this.commitmentService.create(createCommitmentDto);
    }
}