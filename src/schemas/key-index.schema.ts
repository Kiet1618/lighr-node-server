import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<KeyIndex>;

@Schema()
export class KeyIndex {
  @Prop()
  index: string; //random short string

  @Prop()
  address: string;

  @Prop()
  publicKey: string;

  @Prop()
  publicKeyX: string;

  @Prop()
  publicKeyY: string;
}

export const KeyIndexSchema = SchemaFactory.createForClass(KeyIndex);