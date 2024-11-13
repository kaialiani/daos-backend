// src/ensemble/ensemble.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ensemble, EnsembleDocument } from './schemas/ensemble.schema';
import { Model, Types } from 'mongoose';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UserService } from '../user/user.service';
import { MembershipService } from '../membership/membership.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class EnsembleService {
  private readonly logger = new Logger(EnsembleService.name);

  constructor(
    @InjectModel(Ensemble.name) private ensembleModel: Model<EnsembleDocument>,
    private userService: UserService,
    private membershipService: MembershipService,
  ) {}

  // Create a new ensemble
  async create(
    createEnsembleDto: CreateEnsembleDto,
    userId: string,
  ): Promise<EnsembleDocument> {
    try {
      this.logger.log(
        `Creating ensemble: ${createEnsembleDto.name} by user ${userId}`,
      );

      // Convert userId string to ObjectId
      const objectId = new Types.ObjectId(userId);

      const createdEnsemble = new this.ensembleModel({
        ...createEnsembleDto,
        createdBy: objectId, // Set as ObjectId
        members: [objectId], // Set as ObjectId array
        currentMembers: 1,
      });

      const ensemble = await createdEnsemble.save();

      // Create membership entry
      await this.membershipService.create(
        { ensembleId: ensemble._id.toString() }, // First Argument: DTO
        userId, // Second Argument: userId as string
      );

      return ensemble;
    } catch (error) {
      this.logger.error(
        `Error creating ensemble: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create ensemble. Please try again later.',
      );
    }
  }

  // Find all ensembles
  async findAll(): Promise<EnsembleDocument[]> {
    return this.ensembleModel.find().populate('createdBy', '-password').exec();
  }

  // Find ensemble by ID
  async findById(id: string): Promise<EnsembleDocument> {
    const ensemble = await this.ensembleModel
      .findById(id)
      .populate('createdBy', '-password')
      .populate('members', '-password')
      .exec();
    if (!ensemble) {
      throw new NotFoundException('Ensemble not found');
    }
    return ensemble;
  }

  // Delete ensemble
  async delete(id: string, userId: string): Promise<void> {
    const ensemble = await this.ensembleModel.findById(id).exec();
    if (!ensemble) {
      throw new NotFoundException('Ensemble not found');
    }
    if (ensemble.createdBy.toString() !== userId) {
      throw new ForbiddenException('You are not the creator of this ensemble');
    }

    // Remove associated memberships
    await this.membershipService.deleteByEnsemble(id);

    // Delete the ensemble
    await this.ensembleModel.findByIdAndDelete(id).exec();
  }
}
