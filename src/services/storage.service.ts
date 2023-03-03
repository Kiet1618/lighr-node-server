import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Metadata, Storage, StorageDocument } from "src/schemas";

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name)
    private storageModel: Model<StorageDocument>,
  ) {}

  async findMetadataByOwner(owner: string): Promise<Storage> {
    return this.storageModel.findOne({ owner });
  }

  async createMetadata(owner: string, metadata: Metadata): Promise<Storage> {
    return this.storageModel.create({ owner, metadata });
  }

  async updateMetadata(owner: string, metadata: Metadata) {
    return this.storageModel.updateOne({ owner }, { metadata });
  }
}
