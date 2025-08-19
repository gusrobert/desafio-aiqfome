import { Test } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RolesGuard],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
  });

  it('deve estar definido', () => {
    expect(rolesGuard).toBeDefined();
  });
});
