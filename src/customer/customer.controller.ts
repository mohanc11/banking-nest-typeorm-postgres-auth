import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { TransferFundsDto } from './dto/Transfer-FundsDto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get(':id')
  async getCustomerProfile(
    @Request() req,
    @Param('id') id: string,
  ): Promise<Customer> | null {
    /*  if (req.user.id === id || req.user.user_role === USER_ROLE.ADMIN)
      return await this.customerService.getCustomerProfile(id);
    else throw new BadRequestException('Request not allowed...'); */

    return await this.customerService.getCustomerProfile(id);
  }

  @Patch(':id')
  updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }
  @Patch('transfer/:id')
  transferFunds(
    @Param('id') id: string,
    @Body() transferFundsDto: TransferFundsDto,
  ) {
    return this.customerService.transferFunds(id, transferFundsDto);
  }
}
