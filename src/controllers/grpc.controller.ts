import { GrpcMethod } from "@nestjs/microservices";
import {
  BadGatewayException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";

import { KeyIndex } from "./../schemas";
import { SharedKeyService } from "./../services";
import { KeyAssignDto } from "./../dtos/key-index.dto";
import { GRPCService } from "src/grpc/grpc-service";
import {
  AddReceivedShareRequest,
  AddReceivedShareResponse,
  DeriveSharedSecretRequest,
  DeriveSharedSecretResponse,
  GenerateSharesRequest,
  GenerateSharesResponse,
  InitSecretRequest,
  InitSecretResponse,
} from "src/grpc/types";

@Controller("/grpc")
export class RGPCController {
  constructor(private sharedKeyService: SharedKeyService, private grpcService: GRPCService) {}

  @GrpcMethod("P2PService", "initSecret")
  async initSecret(data: InitSecretRequest): Promise<InitSecretResponse> {
    try {
      const publicKey = await this.sharedKeyService.initSecret(data.owner);
      return {
        publicKey,
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException("Error when initSecret");
    }
  }

  @GrpcMethod("P2PService", "generateShares")
  async generateShares(data: GenerateSharesRequest): Promise<GenerateSharesResponse> {
    try {
      const status = await this.grpcService.generateShares(data.owner)
      return { status };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException("Error when initSecret");
    }
  }

  @GrpcMethod("P2PService", "addReceivedShare")
  async addReceivedShare(data: AddReceivedShareRequest): Promise<AddReceivedShareResponse> {
    console.log('added')
    const status = await this.sharedKeyService.updateReceivedShare(data.owner, data.receivedShare);
    return { status };
  }

  @GrpcMethod("P2PService", "deriveSharedSecret")
  async deriveSharedSecret(data: DeriveSharedSecretRequest): Promise<DeriveSharedSecretResponse> {
    const status = await this.sharedKeyService.deriveSecretSharedKey(data.owner);
    return { status };
  }

  @Post()
  async post(@Body() body: KeyAssignDto): Promise<KeyIndex | any> {
    this.grpcService.broadcastAll();
  }
}
