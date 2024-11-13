// src/membership/schemas/membership.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MembershipDocument = Membership & Document;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ensemble', required: true })
  ensembleId: Types.ObjectId;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

// Prevent duplicate memberships
MembershipSchema.index({ userId: 1, ensembleId: 1 }, { unique: true });
