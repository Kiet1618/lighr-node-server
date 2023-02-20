import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BN from "bn.js";
import { HydratedDocument, Types } from "mongoose";

export type SharedKeyDocument = HydratedDocument<SharedKey>;

@Schema({ timestamps: true })
export class SharedKey {
  @Prop()
  secret: BN;

  @Prop({ type: Types.ObjectId, ref: "Wallet" })
  walletId: string;

  @Prop()
  receivedShares: [BN];

  @Prop()
  sharedSecret: BN;
}

export const SharedKeySchema = SchemaFactory.createForClass(SharedKey);
