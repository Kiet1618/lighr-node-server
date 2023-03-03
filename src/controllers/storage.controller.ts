import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateStorageDto } from "src/dtos/create-storage.dto";
import { UpdateStorageDto } from "src/dtos/update-storage.dto";
import { StorageService } from "src/services";

@Controller("storages")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(":owner")
  async getMetadata(@Param("owner") owner: string): Promise<CreateStorageDto> {
    const metadata = await this.storageService.findMetadataByOwner(owner);
    if (metadata) {
      throw new NotFoundException(`Can not find metadata with ${owner}`);
    }
    return metadata;
  }

  @Post()
  async createMetadata(@Body() storage: CreateStorageDto): Promise<CreateStorageDto> {
    const existedMetadata = await this.storageService.findMetadataByOwner(storage.owner);
    console.log(existedMetadata);
    if (existedMetadata) {
      throw new BadRequestException("Metadata already exists");
    }
    return this.storageService.createMetadata(storage.owner, storage.metadata);
  }

  @Put()
  async updateMetadata(@Body() newStorage: UpdateStorageDto): Promise<any> {
    return this.storageService.updateMetadata(newStorage.owner, newStorage.metadata);
  }
}
