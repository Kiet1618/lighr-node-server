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
import { CreateMetadataDto } from "src/dtos/create-metadata.dto";
import { MetadataService } from "src/services";
import { Metadata } from "src/schemas";

@Controller("metadatas")
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) { }

  @Post()
  async createMetadata(@Body() createMetadata: CreateMetadataDto): Promise<Metadata> {
    const existedMetadata = await this.metadataService.findUserById(createMetadata.id);
    if (existedMetadata) {
      throw new BadRequestException("Metadata already exists");
    }
    //check role

    return this.metadataService.createMetadata(createMetadata);
  }
  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<Metadata> {
    const metadata = await this.metadataService.findUserById(id);
    if (!metadata) {
      throw new NotFoundException(`Can not find metadata with ${id}`);
    }
    return metadata;
  }




}
