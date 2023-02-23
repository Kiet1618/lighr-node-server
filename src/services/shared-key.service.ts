import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SharedKey, SharedKeyDocument } from "src/schemas/shared-key.schema";
import * as BN from "bn.js";
import { nSecp256k1, secp256k1 } from "src/common/secp256k1";
import P2PList from "src/config/node-info/p2p-list";
import { P2PService } from "src/grpc/types";
import { THRESHOLD } from "src/common/nodes";
import { lastValueFrom } from "rxjs";
import { interpolate } from "src/utils/interpolate";

@Injectable()
export class SharedKeyService {
  constructor(@InjectModel(SharedKey.name) private sharedKeyModel: Model<SharedKeyDocument>) {}

  async initSecret(owner: string): Promise<string> {
    const keyPair = secp256k1.genKeyPair();
    const secret = keyPair.getPrivate("hex");
    // const publicKey = keyPair.getPublic("hex")
    ///
    const publicKey = keyPair.getPrivate("hex");
    ///
    await this.sharedKeyModel.create({ secret, owner });
    return publicKey;
  }

  async findSharedKeyByOwner(owner: string): Promise<SharedKey> {
    return this.sharedKeyModel.findOne({ owner });
  }

  // async generateShares(owner: string): Promise<boolean> {
  //   const sharedKey = await this.findSharedKeyByOwner(owner);
  //   const secret = sharedKey.secret;
  //   const shares: BN[] = [new BN(secret, "hex")];
  //   console.log(shares);
  //   const indices: number[] = [0];

  //   for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
  //     if (shares.length < THRESHOLD) {
  //       let randomShare: BN = secp256k1.genKeyPair().getPrivate();
  //       let receivedShare = randomShare.toString("hex");

  //       await lastValueFrom(nodes[nodeIndex].addReceivedShare({ owner, receivedShare }));

  //       shares.push(randomShare);
  //       indices.push(nodeIndex + 1);
  //     } else {
  //       let point = interpolate(shares, indices, nodeIndex + 1);
  //       let receivedShare = `0x${point.toString("hex")}`;
  //       await lastValueFrom(nodes[nodeIndex].addReceivedShare({ owner, receivedShare }));
  //     }
  //   }
  //   return true;
  // }

  async updateReceivedShare(owner: string, receivedShare: string): Promise<boolean> {
    const sharedKey = await this.sharedKeyModel.findOne({ owner });
    sharedKey.receivedShares.push(receivedShare);
    try {
      await this.sharedKeyModel.updateOne({ owner }, { receivedShares: sharedKey.receivedShares });
      return true;
    } catch (error) {
      return false;
    }
  }

  async addReceivedShare(walletId: string, receivedShare: string): Promise<void> {
    const sharedKey: SharedKey = await this.sharedKeyModel.findOne({ walletId });
    sharedKey.receivedShares.push(receivedShare);
    await this.sharedKeyModel.updateOne({ walletId }, { receivedShares: sharedKey.receivedShares });
  }

  async deriveSecretSharedKey(owner: string): Promise<boolean> {
    const sharedKey: SharedKey = await this.sharedKeyModel.findOne({ owner });
    const sharedSecret = sharedKey.receivedShares.reduce(
      (prev, current) => prev.add(new BN(current, "hex")).umod(nSecp256k1),
      new BN(0),
    );
    try {
      await this.sharedKeyModel.updateOne({ owner }, { sharedSecret });
      return true;
    } catch (error) {
      return false;
    }
  }
}
