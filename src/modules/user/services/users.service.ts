import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '../../common/services/common.service';
import { MicrosoftSigninDTO } from '../dtos/microsoft-signin.dto';
import { ResetPasswordDTO } from '../dtos/reset-password.dto';
import { SigninDTO } from '../dtos/signin.dto';
import { SignupDTO } from '../dtos/signup.dto';
import { JwtConfig } from '@config/types/jwt';
import { Config } from '@config/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  get jwt() {
    const jwt = this.configService.get<JwtConfig>('jwt');

    return {
      secret: jwt.secret,
      expireTime: jwt.expireTime,
    };
  }

  async onModuleInit() {
    await this.createDefaultAdminUser();
  }

  async createDefaultAdminUser(): Promise<void> {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin';
    //TODO: Put the default admin email and password in the .env file

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = this.userRepository.create({
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'admin',
        full_name: 'Admin',
      });

      await this.userRepository.save(adminUser);
      console.log('Default admin user created');
    } else {
      console.log('Default admin user already exists');
    }
  }

  async signup(signupDTO: SignupDTO): Promise<string> {
    const { email, password, full_name } = signupDTO;
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ApiError(ErrorCode.USER_ALREADY_EXISTS);
      }

      const password_hash = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        email,
        password_hash,
        role: 'teacher', // default role for signup
        full_name,
      });
      await this.userRepository.save(newUser);
      return this.jwtService.sign(
        { userId: newUser.id, role: newUser.role },
        { secret: this.jwt.secret, expiresIn: this.jwt.expireTime },
      );
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async signin(signinDTO: SigninDTO): Promise<string> {
    const { email, password } = signinDTO;
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'password_hash', 'role'],
      });
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new UnauthorizedException();
      }
      return this.jwtService.sign(
        { userId: user.id, role: user.role },
        { secret: this.jwt.secret, expiresIn: this.jwt.expireTime },
      );
    } catch (error) {
      throw new ApiError(ErrorCode.AUTHENTICATION_FAILED);
    }
  }

  async microsoftSignin(
    microsoftSigninDTO: MicrosoftSigninDTO,
  ): Promise<string> {
    const { id_token } = microsoftSigninDTO;

    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          const payload =
            await this.commonService.verifyMicrosoftToken(id_token);

          let user = await transactionalEntityManager.findOne(User, {
            where: [
              { microsoft_id: payload.microsoft_id },
              { email: payload.email },
            ],
            lock: { mode: 'pessimistic_write' },
          });

          if (user) {
            // If user exists, update microsoft_id if it's not already set
            if (!user.microsoft_id) {
              user.microsoft_id = payload.microsoft_id;
              await transactionalEntityManager.save(User, user);
            }
          } else {
            // If user does not exist, create a new user
            user = transactionalEntityManager.create(User, {
              email: payload.email,
              full_name: payload.full_name,
              microsoft_id: payload.microsoft_id,
              role: 'teacher', // default role for Microsoft sign-in
            });

            try {
              await transactionalEntityManager.save(User, user);
            } catch (saveError) {
              // If a unique constraint error occurs, it means a user was created in the meantime
              if (saveError.code === '23505') {
                // PostgreSQL unique violation error code
                // Fetch the existing user
                user = await transactionalEntityManager.findOne(User, {
                  where: { email: payload.email },
                });
                if (!user) {
                  throw new Error(
                    'Failed to fetch existing user after conflict',
                  );
                }
              } else {
                throw saveError;
              }
            }
          }

          return this.jwtService.sign(
            { userId: user.id, role: user.role },
            { secret: this.jwt.secret, expiresIn: this.jwt.expireTime },
          );
        } catch (error) {
          console.error('Microsoft sign-in error:', error);
          throw new ApiError(ErrorCode.AUTHENTICATION_FAILED);
        }
      },
    );
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    const { email, newPassword } = resetPasswordDTO;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new ApiError(ErrorCode.USER_NOT_FOUND);
      }
      user.password_hash = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);
    } catch (error) {
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async getUsersByRole(role: any): Promise<User[]> {
    try {
      return await this.userRepository.find({ where: { role } });
    } catch (error) {
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }
}
