import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Meta } from "src/schemas";

class MetaDto {
  @IsNumber()
  @IsNotEmpty()
  H: number;

  @IsNumber()
  @IsNotEmpty()
  W: number;

  @IsBoolean()
  @IsNotEmpty()
  enable_attention_slicing: boolean;

  @IsString()
  @IsNotEmpty()
  file_prefix: string;

  @IsString()
  @IsNotEmpty()
  guidance_scale: string;

  @IsString()
  @IsNotEmpty()
  instant_response: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  n_samples: number;

  @IsString()
  @IsNotEmpty()
  negative_prompt: string;

  @IsString()
  @IsNotEmpty()
  outdir: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  revision: string;

  @IsString()
  @IsNotEmpty()
  safetychecker: string;

  @IsString()
  @IsNotEmpty()
  seed: string;

  @IsNumber()
  @IsNotEmpty()
  steps: number;

  @IsString()
  @IsNotEmpty()
  vae: string;
}

export class CreateMetadataDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MetaDto)
  @IsNotEmpty()
  readonly meta: MetaDto;
}
