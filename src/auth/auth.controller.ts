import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsInputDto } from './dto/credentials-input.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createAuthDto: CreateAuthDto): Promise<string> {
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  login(
    @Body() credentialsInputDto: CredentialsInputDto,
  ): Promise<CredentialsDto> {
    return this.authService.login(credentialsInputDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
