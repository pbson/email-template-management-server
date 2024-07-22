import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@config/types';
import { JWTUtils } from '../jwt-utils';
import { JwtConfig } from '@config/types/jwt';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  private readonly MICROSOFT_JWKS_URL =
    'https://login.microsoftonline.com/common/discovery/v2.0/keys';

  constructor(private readonly configService: ConfigService<Config, true>) {}

  async verifyMicrosoftToken(idToken: string): Promise<any> {
    try {
      // Fetch the JWKS keys from Microsoft's discovery endpoint
      const jwksResponse = await axios.get(this.MICROSOFT_JWKS_URL);
      const jwksKeys = jwksResponse.data.keys;

      // Decode the token to get the kid (key ID)
      const decodedToken: any = jwt.decode(idToken, { complete: true });
      if (!decodedToken) {
        throw new Error('Invalid token');
      }

      const kid = decodedToken.header.kid;
      const jwk = jwksKeys.find((key: any) => key.kid === kid);
      if (!jwk) {
        throw new Error('Invalid token');
      }

      // Convert the JWK to PEM format
      const pem = jwkToPem(jwk);

      // Verify the token using the PEM key
      const payload = jwt.verify(idToken, pem, {
        algorithms: ['RS256'],
      }) as jwt.JwtPayload;

      return {
        microsoft_id: payload.oid,
        email: payload.preferred_username,
        full_name: payload.name,
      };
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  get jwt() {
    const jwt = this.configService.get<JwtConfig>('jwt');

    return {
      secret: jwt.secret,
      expireTime: jwt.expireTime,
    };
  }

  async signToken(payload: ITokenPayload) {
    try {
      return await JWTUtils.signAsync(payload, this.jwt.secret, {
        expiresIn: this.jwt.expireTime,
      });
    } catch (error) {
      throw ApiError.error(ErrorCode.INVALID_TOKEN);
    }
  }

  async verifyToken(token: string) {
    try {
      return await JWTUtils.verifyAsync(token, this.jwt.secret);
    } catch (error) {
      throw ApiError.error(ErrorCode.INVALID_TOKEN);
    }
  }
}

interface ITokenPayload {
  userId: string;
}
