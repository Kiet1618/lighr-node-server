import { ClientGrpc, GrpcMethod } from "@nestjs/microservices";
import { Body, Controller, Inject, Post } from "@nestjs/common";

import { KeyIndex } from "./../schemas";
import { KeyIndexService } from "./../services";
import { KeyAssignDto } from "./../dtos/key-index.dto";
import { GRPCService } from "src/grpc/grpc-service";

@Controller("/key-index")
export class KeyIndexController {
  constructor(private keyIndexService: KeyIndexService, private grpcService: GRPCService) {}

  @GrpcMethod("P2PService", "broadcastAssignKey")
  findOne(data) {
    return data;
  }

  @Post()
  async post(@Body() body: KeyAssignDto): Promise<KeyIndex> {
    this.grpcService.broadcastAll();
    const data = await this.keyIndexService.create({});
    return data;
  }
}
