import { Body, Controller, Header, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
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
