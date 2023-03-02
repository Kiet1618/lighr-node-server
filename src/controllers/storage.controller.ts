import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { Storage } from "src/schemas";
import { StorageService } from "src/services";

@Controller("storages")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(":owner")
  async getMetadata(@Param("owner") owner: string): Promise<Storage> {
    return this.storageService.findMetadataByOwner(owner);
  }

  @Post()
  async createMetadata(@Body() storage: Storage): Promise<Storage> {
    return this.storageService.createMetadata(storage);
  }

  @Put()
  async updateMetadata(@Body() newStorage: Storage) {
    return this.storageService.updateMetadata(newStorage);
  }
}
