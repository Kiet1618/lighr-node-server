import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateWalletDto } from "src/dtos/create-wallet.dto";
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

  async findWallet(wallet: CreateWalletDto): Promise<Wallet> {
    return this.walletModel.findOne({ owner: wallet.owner }).exec();
  }

  async create(createdWallet: CreateWalletDto): Promise<Wallet> {
    // TO DO: Initialize key sharing
    let newWallet = new Wallet(createdWallet.owner, "0xPub", "0xAddr");
    return await this.walletModel.create(newWallet);
  }
}
