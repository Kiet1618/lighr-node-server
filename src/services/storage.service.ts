import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EncryptedMetadata, Storage, StorageDocument } from "src/schemas";

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name)
    private storageModel: Model<StorageDocument>,
  ) {}

  async findMetadataByOwner(owner: string): Promise<Storage> {
    return this.storageModel.findOne({ owner });
  }

  async createMetadata(owner: string, encryptedMetadata: EncryptedMetadata): Promise<Storage> {
    return this.storageModel.create({ owner, encryptedMetadata });
  }

  async updateMetadata(owner: string, encryptedMetadata: EncryptedMetadata) {
    return this.storageModel.updateOne({ owner }, { encryptedMetadata });
  }
}
