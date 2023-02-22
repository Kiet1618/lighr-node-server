import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { P2PService } from "./types";
import { lastValueFrom } from "rxjs";
import { SharedKeyService } from "src/services";
import P2PList from "src/config/node-info/p2p-list";
import BN from "bn.js";
import elliptic from "elliptic";
import { interpolate } from "src/utils/interpolate";

const { ec } = elliptic;
const secp256k1 = new ec("secp256k1");

// generator order value of `secp256k1` curve
const n = secp256k1.curve.n;

const THRESHOLD = 3;

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
    private sharedKeyService: SharedKeyService,
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

  generateSecret() {
    Object.keys(P2PList).forEach(async () => {
      await this.sharedKeyService.initSecret();
    });
  }

  async generateShares(walletId: string) {
    const nodes = Object.keys(P2PList);
    const sharedKey = await this.sharedKeyService.find(walletId);
    const secret = sharedKey.secret;

    const shares: BN[] = [secret];
    const indices: number[] = [0];

    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
      if (shares.length < THRESHOLD) {
        let randomShare: BN = secp256k1.genKeyPair().getPrivate();
        shares.push(randomShare);
        nodes[nodeIndex].receivedShares.push(randomShare);
        indices.push(nodeIndex + 1);
      } else {
        let point = interpolate(shares, indices, nodeIndex + 1);
        nodes[nodeIndex].receivedShares.push(point!);
      }
    }
  }

  async addReceivedShare(walletId: string, receivedShare: BN) {
    await this.sharedKeyService.addReceivedShare(walletId, receivedShare);
  }

  generateSecretSharedKey() {
    node.receivedShares.reduce(
      (prev, current) => prev.add(current).umod(n),
      new BN(0)
    );
  }
}
