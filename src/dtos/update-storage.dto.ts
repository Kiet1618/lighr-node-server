import { Type } from "class-transformer";
import {
  IsDefined,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class MetadataDto {
  @IsString()
  @IsOptional()
  mac: string;

  @IsString()
  @IsOptional()
  ciphertext: string;

  @IsString()
  @IsOptional()
  iv: string;

  @IsString()
  @IsOptional()
  ephemPublicKey: string;
}

export class UpdateStorageDto {
  @IsString()
  @IsNotEmpty()
  readonly owner: string;

  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => MetadataDto)
  @IsNotEmpty()
  readonly metadata: MetadataDto;
}
