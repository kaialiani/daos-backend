import {
  Injectable,
  ConflictException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Membership } from './schemas/membership.schema';
import { Model, Types } from 'mongoose';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { EnsembleService } from '../ensemble/ensemble.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    @Inject(forwardRef(() => EnsembleService))
    private readonly ensembleService: EnsembleService, // Dependency at index [1]
  ) {}

  // Create a new membership
  async create(
    createMembershipDto: CreateMembershipDto,
    userId: string,
  ): Promise<Membership> {
    const ensemble = await this.ensembleService.findById(
      createMembershipDto.ensembleId,
    );

    // Check if user is already a member
    const existing = await this.membershipModel
      .findOne({
        userId,
        ensembleId: createMembershipDto.ensembleId,
      })
      .exec();

    if (existing) {
      throw new ConflictException('User is already a member of this ensemble');
    }

    // Add user to ensemble's members and increment currentMembers
    ensemble.members.push(new Types.ObjectId(userId));
    ensemble.currentMembers += 1;
    await ensemble.save();

    // Create membership
    const membership = new this.membershipModel({
      userId,
      ensembleId: createMembershipDto.ensembleId,
    });
    return membership.save();
  }

  // Remove a membership
  async remove(ensembleId: string, userId: string): Promise<void> {
    const membership = await this.membershipModel
      .findOne({
        userId,
        ensembleId,
      })
      .exec();

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    // Remove user from ensemble's members and decrement currentMembers
    const ensemble = await this.ensembleService.findById(ensembleId);
    ensemble.members = ensemble.members.filter(
      (memberId) => memberId.toString() !== userId,
    );
    ensemble.currentMembers -= 1;
    await ensemble.save();

    // Remove membership
    await this.membershipModel.deleteOne({ _id: membership._id }).exec();
  }

  // Delete all memberships related to an ensemble (used when deleting an ensemble)
  async deleteByEnsemble(ensembleId: string): Promise<void> {
    await this.membershipModel.deleteMany({ ensembleId }).exec();
  }
}
