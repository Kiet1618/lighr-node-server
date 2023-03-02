import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Storage, StorageDocument } from "src/schemas";

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name)
    private storageModel: Model<StorageDocument>,
  ) {}

  async findMetadataByOwner(owner: string): Promise<Storage> {
    return this.storageModel.findOne({ owner });
  }

  async createMetadata(storage: Storage): Promise<Storage> {
    return this.storageModel.create(storage);
  }

  async updateMetadata(storage: Storage) {
    return this.storageModel.updateOne({ owner: storage.owner }, { metadata: storage.metadata });
  }
}
