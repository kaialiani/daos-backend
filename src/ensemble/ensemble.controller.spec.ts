import { Test, TestingModule } from '@nestjs/testing';
import { EnsembleController } from './ensemble.controller';

describe('EnsembleController', () => {
  let controller: EnsembleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnsembleController],
    }).compile();

    controller = module.get<EnsembleController>(EnsembleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
