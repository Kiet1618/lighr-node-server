import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Metadata, MetadataDocument } from "src/schemas";
//EncryptedMetadata,
@Injectable()
export class MetadataService {
  constructor(
    @InjectModel(Metadata.name)
    private metadataModel: Model<MetadataDocument>,
  ) { }

  async findUserById(id: string): Promise<Metadata> {
    return this.metadataModel.findOne({ id });
  }

  async createMetadata(metadata: Metadata): Promise<Metadata> {
    return this.metadataModel.create(metadata);
  }

}
