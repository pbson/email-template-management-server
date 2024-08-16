import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AdviceService } from '../services/advice.service';
import { AuthGuard } from '../../user/auth.guard';
import { CreateAdviceDTO } from '../dtos/advice/create-advice.dto';
import { UpdateAdviceDTO } from '../dtos/advice/update-advice.dto';
import { AdviceController } from '../controllers/advice.controller';

describe('AdviceController (e2e)', () => {
  let app: INestApplication;
  let adviceService: AdviceService;

  const mockAdviceService = {
    getListAdvices: jest.fn(),
    createAdvice: jest.fn(),
    getAdviceById: jest.fn(),
    updateAdvice: jest.fn(),
    deleteAdvice: jest.fn(),
  };

  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AdviceController],
      providers: [
        {
          provide: AdviceService,
          useValue: mockAdviceService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    adviceService = moduleFixture.get<AdviceService>(AdviceService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/advice/:caseId (GET)', () => {
    it('should return list of advice', () => {
      const mockAdvices = [
        { id: 1, title: 'Advice 1' },
        { id: 2, title: 'Advice 2' },
      ];
      mockAdviceService.getListAdvices.mockResolvedValue(mockAdvices);

      return request(app.getHttpServer())
        .get('/advice/1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual(mockAdvices);
        });
    });
  });
});
