import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SharedKey, SharedKeyDocument } from "src/schemas/shared-key.schema";
import { ec } from "elliptic";

@Injectable()
export class SharedKeyService {
  constructor(@InjectModel(SharedKey.name) private sharedKeyModel: Model<SharedKeyDocument>) {}

  // async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
  //   const createdWallet = new this.walletModel(createWalletDto);
  //   return createdWallet.save();
  // }

  //   async findAll(): Promise<SharedKey[]> {
  //     return this.sharedKeyModel.find().exec();
  //   }

  //   async findWallet(owner: string): Promise<Wallet> {
  //     return this.sharedKeyModel.findOne({ owner }).exec();
  //   }

  async initSecret(): Promise<SharedKey> {
    // TO DO: Initialize key sharing
    // let newWallet = new Wallet(owner, "0xPub", "0xAddr");
    const secp256k1 = new ec("secp256k1");
    const secret = secp256k1.genKeyPair().getPrivate();
    return await this.sharedKeyModel.create({ secret });
  }

//   async addReceiveShare()
}
