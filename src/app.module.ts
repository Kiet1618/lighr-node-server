import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import * as redisStore from "cache-manager-redis-store";

import type { RedisClientOptions } from "redis";

import configuration from "./config/configuration";
import * as services from "./services";
import * as controllers from "./controllers";

import { Commitment, CommitmentSchema, KeyIndex, KeyIndexSchema, Wallet, WalletSchema } from "./schemas";
import { GoogleVerifier } from "./verifier/google.verifier";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("database.mongo_url"),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: KeyIndex.name, schema: KeyIndexSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Commitment.name, schema: CommitmentSchema },
    ]),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => {
        const redisUrl = configService.get<string>("redis_url");
        return {
          store: redisStore,
          url: redisUrl,
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [].concat(Object.values(controllers)),
  providers: [].concat(Object.values(services), GoogleVerifier),
  exports: [],
})
export class AppModule {}
