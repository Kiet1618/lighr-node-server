import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SharedKey, SharedKeyDocument } from "src/schemas/shared-key.schema";
import BN from "bn.js";
import { nSecp256k1, secp256k1 } from "src/common/secp256k1";

@Injectable()
export class SharedKeyService {
  constructor(@InjectModel(SharedKey.name) private sharedKeyModel: Model<SharedKeyDocument>) {}

  async initSecret(): Promise<SharedKey> {
    const secret = secp256k1.genKeyPair().getPrivate();
    return await this.sharedKeyModel.create({ secret });
  }

  async find(walletId: string): Promise<SharedKey> {
    return await this.sharedKeyModel.findOne({ walletId });
  }

  async addReceivedShare(walletId: string, receivedShare: BN): Promise<void> {
    const sharedKey: SharedKey = await this.sharedKeyModel.findOne({ walletId });
    sharedKey.receivedShares.push(receivedShare);
    await this.sharedKeyModel.updateOne({ walletId }, { receivedShares: sharedKey.receivedShares });
  }

  async deriveSecretSharedKey(walletId: string): Promise<void> {
    const sharedKey: SharedKey = await this.sharedKeyModel.findOne({ walletId });
    const sharedSecret = sharedKey.receivedShares.reduce(
      (prev, current) => prev.add(current).umod(nSecp256k1),
      new BN(0),
    );
    await this.sharedKeyModel.updateOne({ walletId }, { sharedSecret });
  }
}
