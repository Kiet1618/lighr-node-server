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
  Delete,
} from "@nestjs/common";
import { CreateBridgeDto } from "src/dtos/create-bridge.dto";
import { BridgeService, OrdinalService, AddressService, MetadataService } from "src/services";
import { Bridge } from "src/schemas";
import { verifyAccessToken } from "src/verifier/oauth.verifier";
import { getOwnerOfNft } from "src/utils/blockchain";
@Controller("bridges")
export class BridgeController {
  constructor(
    private readonly bridgeService: BridgeService,
    private readonly ordinalService: OrdinalService,
    private readonly addressService: AddressService,
    private readonly metadataService: MetadataService
  ) { }

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
    await this.metadataService.updateMetadata(createBridge.ordId, createBridge.nftId);
    await this.ordinalService.deleteOrdinal(createBridge.ordId);
    return this.bridgeService.createBridge(createBridge);
  }

  @Delete(":id")
  async deleteOrdinal(@Param() ordId: string, @Headers('Authorization') accessToken: string): Promise<any> {
    const { id: userId } = await verifyAccessToken(accessToken);
    const nftId = (await this.bridgeService.findByOrdId(ordId)).nftId;
    const ownerNftIdAddress = await getOwnerOfNft(nftId);
    const userOwner = (await this.addressService.findUserByAddressBTC(ownerNftIdAddress));
    if (userId !== userOwner.id) {
      throw new BadRequestException("Your are not owner");
    }
    const existedOrdinal = await this.ordinalService.findOrdinalByNftId(nftId);
    if (existedOrdinal) {
      throw new BadRequestException("Ordinal already exists");
    }
    await this.metadataService.updateMetadata(ordId, nftId);
    await this.ordinalService.createOrdinal({
      nftId: ordId,
      owner: userOwner.address.btc,
      price: 0,
      promptPrice: 0,
      promptBuyer: [userOwner.address.btc],
    })
    return this.bridgeService.deleteBridge(nftId);
  }
}
