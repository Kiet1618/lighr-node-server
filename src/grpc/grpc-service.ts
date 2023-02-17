import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { P2PService } from "./types";
import { lastValueFrom } from "rxjs";

@Injectable()
export class GRPCService implements OnModuleInit {
  private node1: P2PService;
  private node2: P2PService;
  private node3: P2PService;
  constructor(@Inject("P2P_NODE1") private client1: ClientGrpc, @Inject("P2P_NODE2") private client2: ClientGrpc, @Inject("P2P_NODE3") private client3: ClientGrpc) {}
  onModuleInit() {
    this.node1 = this.client1.getService("P2PService");
    this.node2 = this.client2.getService("P2PService");
    this.node3 = this.client3.getService("P2PService");
  }

  broadcastAll() {
    const call1 = lastValueFrom(this.node1.broadcastAssignKey({ id: 1 }));
    console.log("🚀 ~ file: grpc-service.ts:20 ~ GRPCService ~ broadcastAll ~ call1", call1)
  }
}
