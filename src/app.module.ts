import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as redisStore from "cache-manager-redis-store";

import type { RedisClientOptions } from "redis";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";

import { KeyIndex, KeyIndexSchema } from "./schemas";

@Module({
  imports: [
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
    MongooseModule.forFeature([{ name: KeyIndex.name, schema: KeyIndexSchema }]),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => {
        const redisUrl = configService.get<string>("redis_url");
        return {
          store: redisStore,
          url: redisUrl,
          // ttl: 10,
          // max: 100000,
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
