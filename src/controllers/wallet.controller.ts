import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateWalletDto } from "src/dtos/create-wallet.dto";
import { Wallet } from "src/schemas";
import { WalletService } from "src/services";
import { VerifyGuard } from "src/verifier/verify.guard";

@Controller("wallets")
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post()
    async getWalletAddress(@Body() createWalletDto: CreateWalletDto): Promise<Wallet> {
        let wallet = await this.walletService.findWallet(createWalletDto);
        if (wallet) {
          return wallet;  
        } 
        return await this.walletService.create(createWalletDto);
    }

    @Get()
    @UseGuards(VerifyGuard)
    async findAll(): Promise<Wallet[]> {
        return this.walletService.findAll()
    }
}