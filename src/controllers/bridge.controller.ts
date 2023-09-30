import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  NotFoundException,
  Headers,
  BadRequestException,
} from "@nestjs/common";
import { CreateBridgeDto } from "src/dtos/create-bridge.dto";
import { BridgeService, OrdinalService, AddressService } from "src/services";
import { Bridge } from "src/schemas";
import { verifyAccessToken } from "src/verifier/oauth.verifier";

@Controller("bridges")
export class BridgeController {
  constructor(private readonly bridgeService: BridgeService, private readonly ordinalService: OrdinalService, private readonly addressService: AddressService) { }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<Bridge> {
    const infoNtfId = await this.bridgeService.findByNftId(id);
    if (!infoNtfId) {
      const infoOrdId = await this.bridgeService.findByOrdId(id);
      if (!infoOrdId) {
        throw new NotFoundException(`Can not find metadata with ${id}`);
      }
      return infoOrdId;
    }
    return infoNtfId;
  }

  @Get()
  async getAllUsers(): Promise<Array<Bridge>> {
    const info = await this.bridgeService.findAll()
    if (!info) {
      throw new NotFoundException(`Empty metadata`);
    }
    return info;
  }

  @Post()
  async createMetadata(@Body() createBridge: CreateBridgeDto, @Headers('Authorization') accessToken: string): Promise<Bridge> {
    const { id: userId } = await verifyAccessToken(accessToken);
    const userOwner = (await this.ordinalService.findOrdinalByNftId(createBridge.ordId)).owner;
    const idUserOwner = (await this.addressService.findUserByAddressBTC(userOwner)).id;
    if (userId !== idUserOwner) {
      throw new BadRequestException("Your are not owner");
    }

    const existedBridgeNftId = await this.bridgeService.findByNftId(createBridge.nftId);
    if (existedBridgeNftId) {
      throw new BadRequestException("Metadata already exists");
    }
    const existedBridgeOrdId = await this.bridgeService.findByOrdId(createBridge.ordId);
    if (existedBridgeOrdId) {
      throw new BadRequestException("Metadata already exists");
    }
    await this.ordinalService.deleteOrdinal(createBridge.ordId);
    return this.bridgeService.createBridge(createBridge);
  }

}
