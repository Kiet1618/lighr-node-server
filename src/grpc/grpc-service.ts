import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { P2PService } from "./types";
import { lastValueFrom } from "rxjs";
import P2PList from "src/config/node-info/p2p-list";

@Injectable()
export class GRPCService implements OnModuleInit {
  private node1: P2PService;
  private node2: P2PService;
  private node3: P2PService;
  private nodeName: string;
  constructor(
    @Inject("P2P_NODE1") private client1: ClientGrpc,
    @Inject("P2P_NODE2") private client2: ClientGrpc,
    @Inject("P2P_NODE3") private client3: ClientGrpc,
    private configService: ConfigService,
  ) {}
  onModuleInit() {
    this.node1 = this.client1.getService("P2PService");
    this.node2 = this.client2.getService("P2PService");
    this.node3 = this.client3.getService("P2PService");
    this.nodeName = this.configService.get<string>("node_name").trim();
  }

  broadcastAll() {
    Object.keys(P2PList).map(async (nodeName) => {
      if (this.nodeName !== nodeName) {
        const p2p = this[nodeName] as P2PService;
        const call = await lastValueFrom(p2p.broadcastAssignKey({ id: 1 }));
      }
    });
  }
}
