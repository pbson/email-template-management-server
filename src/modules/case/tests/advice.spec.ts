import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdviceService } from '../services/advice.service';
import { Advice } from '../entities/advice.entity';
import { Case } from '../entities/case.entity';
import { User } from '../../user/entities/user.entity';
import { ApiError } from '../../common/classes/api-error';
import { CreateAdviceDTO } from '../dtos/advice/create-advice.dto';

describe('AdviceService', () => {
  let service: AdviceService;
  let adviceRepository: Repository<Advice>;
  let caseRepository: Repository<Case>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdviceService,
        {
          provide: getRepositoryToken(Advice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Case),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AdviceService>(AdviceService);
    adviceRepository = module.get<Repository<Advice>>(
      getRepositoryToken(Advice),
    );
    caseRepository = module.get<Repository<Case>>(getRepositoryToken(Case));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListAdvices', () => {
    it('should return a list of advices', async () => {
      const mockCase = { id: 1 } as Case;
      const mockAdvices = [
        { id: 1, title: 'Advice 1' },
        { id: 2, title: 'Advice 2' },
      ] as Advice[];

      jest.spyOn(caseRepository, 'findOne').mockResolvedValue(mockCase);
      jest.spyOn(adviceRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAdvices, 2]),
      } as any);

      const result = await service.getListAdvices(1, { page: 1, limit: 10 });

      expect(result.advices).toEqual(mockAdvices);
      expect(result.total).toBe(2);
      expect(result.case).toEqual(mockCase);
    });

    it('should throw ApiError if case is not found', async () => {
      jest.spyOn(caseRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getListAdvices(1, {})).rejects.toThrow(ApiError);
    });
  });

  describe('createAdvice', () => {
    it('should create a new advice', async () => {
      const createAdviceDTO: CreateAdviceDTO = {
        title: 'New Advice',
        content: 'Content',
        caseId: 1,
        userId: 1,
      };
      const mockCase = { id: 1 } as Case;
      const mockUser = { id: 1 } as User;
      const mockAdvice = { id: 1, ...createAdviceDTO } as unknown as Advice;

      jest.spyOn(caseRepository, 'findOneBy').mockResolvedValue(mockCase);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(adviceRepository, 'create').mockReturnValue(mockAdvice);
      jest.spyOn(adviceRepository, 'save').mockResolvedValue(mockAdvice);

      const result = await service.createAdvice(createAdviceDTO);

      expect(result).toEqual(mockAdvice);
    });

    it('should throw ApiError if case is not found', async () => {
      jest.spyOn(caseRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.createAdvice({ caseId: 1 } as CreateAdviceDTO),
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getAdviceById', () => {
    it('should return advice by ID', async () => {
      const advice = { id: 1 } as Advice;
      jest.spyOn(adviceRepository, 'findOneBy').mockResolvedValue(advice);

      expect(await service.getAdviceById(1)).toEqual(advice);
    });

    it('should throw if advice not found', async () => {
      jest.spyOn(adviceRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getAdviceById(1)).rejects.toThrow(ApiError);
    });
  });
});
