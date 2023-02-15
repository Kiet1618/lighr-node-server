import { Body, Controller, Inject, Post } from '@nestjs/common';

import { KeyIndex } from './../schemas';
import { KeyIndexService } from './../services';
import { KeyAssignDto } from './../dtos/key-index.dto';

@Controller('/key-index')
export class KeyIndexController {
  constructor(private keyIndexService: KeyIndexService) {}
  @Post()
  async post(@Body() body: KeyAssignDto): Promise<KeyIndex> {
    const data = await this.keyIndexService.create({});
    return data;
  }
}