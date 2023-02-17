import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Wallet, WalletDocument } from "src/schemas";

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<WalletDocument>) {}

  // async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
  //   const createdWallet = new this.walletModel(createWalletDto);
  //   return createdWallet.save();
  // }

  async findAll(): Promise<Wallet[]> {
    return this.walletModel.find().exec();
  }

  async findWallet(owner: string): Promise<Wallet> {
    return this.walletModel.findOne({ owner }).exec();
  }

  async create(owner: string): Promise<Wallet> {
    // TO DO: Initialize key sharing
    let newWallet = new Wallet(owner, "0xPub", "0xAddr");
    return await this.walletModel.create(newWallet);
  }
}
