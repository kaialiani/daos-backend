import { Test, TestingModule } from '@nestjs/testing';
import { EnsembleService } from './ensemble.service';

describe('EnsembleService', () => {
  let service: EnsembleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnsembleService],
    }).compile();

    service = module.get<EnsembleService>(EnsembleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
