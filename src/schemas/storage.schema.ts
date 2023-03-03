import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StorageDocument = HydratedDocument<Storage>;

export class Metadata {
  mac: string;
  ciphertext: string;
  iv: string;
  ephemPublicKey: string;
}

@Schema()
export class Storage {
  @Prop({ required: true, unique: true })
  owner: string;

  @Prop({ required: true, unique: true })
  publicKey: string;

  @Prop({ required: true, type: Metadata })
  metadata: Metadata;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
