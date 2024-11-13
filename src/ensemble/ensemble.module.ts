// src/ensemble/ensemble.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { EnsembleController } from './ensemble.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ensemble, EnsembleSchema } from './schemas/ensemble.schema';
import { UserModule } from '../user/user.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ensemble.name, schema: EnsembleSchema },
    ]),
    UserModule,
    forwardRef(() => MembershipModule), //Resolve Circular Dependencies
  ],
  providers: [EnsembleService],
  controllers: [EnsembleController],
  exports: [EnsembleService],
})
export class EnsembleModule {}
