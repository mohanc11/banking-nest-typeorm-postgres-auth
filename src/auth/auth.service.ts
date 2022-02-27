import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { Auth, USER_ROLE } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { CredentialsInputDto } from './dto/credentials-input.dto';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createAuthDto: CreateAuthDto): Promise<string> {
    const { username, password } = createAuthDto;
    const cust = await this.customerService.getCustomerProfileByUsername(
      username,
    );
    const user = new Auth();
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.username = username;
    user.password = await bcrypt.hash(password, salt);
    user.user_role = USER_ROLE.CUSTOMER;
    user.customerId = cust.id;

    const createdUser = await this.authRepository.save(user);

    if (createdUser.username !== username)
      throw new BadRequestException('USername already exists...');
    return 'user created successfully...';
  }

  async login(
    credentialsInputDto: CredentialsInputDto,
  ): Promise<CredentialsDto> {
    const user = await this.authRepository.findOne({
      username: credentialsInputDto.username,
    });
    const isValid = await user.validatePassword(credentialsInputDto.password);
    if (!isValid) throw new UnauthorizedException('Credentials not Valid');

    const payload = {
      username: user.username,
    };

    const credentialsDto = new CredentialsDto();
    credentialsDto.username = credentialsInputDto.username;
    credentialsDto.jwtToken = await this.jwtService.sign(payload);

    if (isValid) return credentialsDto;
  }
  async getUserByName(username): Promise<Auth> {
    return await this.authRepository.findOne({ username });
  }
}
