// src/ensemble/ensemble.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  // Create a new ensemble
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createEnsembleDto: CreateEnsembleDto, @Request() req) {
    const ensemble = await this.ensembleService.create(
      createEnsembleDto,
      req.user.userId,
    );
    return ensemble;
  }

  // Get all ensembles
  @Get()
  async findAll() {
    return this.ensembleService.findAll();
  }

  // Get ensemble by ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ensembleService.findById(id);
  }

  // Delete ensemble
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.ensembleService.delete(id, req.user.userId);
    return { message: 'Ensemble deleted successfully' };
  }
}
