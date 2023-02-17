import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { LookupWalletDto } from "src/dtos/lookup-wallet.dto";
import { Wallet } from "src/schemas";
import { WalletService } from "src/services";
import { VerifyGuard } from "src/verifier/verify.guard";

@Controller("wallets")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async lookupWallet(@Body() lookupWalletDto: LookupWalletDto): Promise<any> {
    const existedWallet = await this.walletService.findWallet(lookupWalletDto.owner);
    return existedWallet ? existedWallet : await this.walletService.create(lookupWalletDto.owner);
  }

  @Get()
  @UseGuards(VerifyGuard)
  async findAll(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }
}
