import {
  Body,
  Controller,
  Header,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public() // gắn cờ {isPublic: true}
  login(
    @Body()
    body: LoginDto,
    @Param()
    param,
    @Query()
    query,
  ) {
    // console.log({ body, param, query });
    const reuslt = this.authService.login(body);
    return reuslt;
  }
}
