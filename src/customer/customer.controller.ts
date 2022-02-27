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
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { Auth, USER_ROLE } from 'src/auth/entities/auth.entity';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityFatory, Action } from './ability/ability-factory';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { TransferFundsDto } from './dto/Transfer-FundsDto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private abilityFactory: AbilityFatory,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCustomerProfile(
    @Request() req,
    @Param('id') id: string,
  ): Promise<Customer> | null {
    /*  if (req.user.id === id || req.user.user_role === USER_ROLE.ADMIN)
      return await this.customerService.getCustomerProfile(id);
    else throw new BadRequestException('Request not allowed...'); */
    const ability = this.abilityFactory.defineAbility(req.user);
    const isAllowed = ability.can(Action.Read, Auth);
    if (!isAllowed) throw new ForbiddenException('Only admin can do it');

    if (req.user.customerId !== id && req.user.user_role !== USER_ROLE.ADMIN)
      throw new ForbiddenException('only owner/admin can do it');
    return await this.customerService.getCustomerProfile(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(
    @Request() req,
    @Param('id') id: string,
  ): Promise<Customer> {
    const ability = this.abilityFactory.defineAbility(req.user);
    const isAllowed = ability.cannot(Action.Delete, Auth, id);
    if (!isAllowed) throw new ForbiddenException('Only admin can do it');

    if (req.user.customerId !== id && req.user.user_role !== USER_ROLE.ADMIN)
      throw new ForbiddenException('Only owner can do it');
    return this.customerService.deleteCustomer(id);

    /* 
    try {
      ForbiddenError.from(ability)
        .setMessage('Only admin can do it')
        .throwUnlessCan(Action.Delete, Auth);
      return this.customerService.deleteCustomer(id);
    } catch (error) {
      if (error instanceof ForbiddenError)
        throw new ForbiddenException(error.message);
    } */
  }
}
