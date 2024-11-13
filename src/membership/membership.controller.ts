// src/membership/membership.controller.ts

import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // Join an ensemble
  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinEnsemble(
    @Body() createMembershipDto: CreateMembershipDto,
    @Request() req,
  ) {
    const membership = await this.membershipService.create(
      createMembershipDto,
      req.user.userId,
    );
    return membership;
  }

  // Leave an ensemble
  @UseGuards(JwtAuthGuard)
  @Delete('leave')
  async leaveEnsemble(
    @Body() createMembershipDto: CreateMembershipDto,
    @Request() req,
  ) {
    await this.membershipService.remove(
      createMembershipDto.ensembleId,
      req.user.userId,
    );
    return { message: 'Left the ensemble successfully' };
  }
}
