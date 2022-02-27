import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { TransferFundsDto } from './dto/Transfer-FundsDto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = new Customer();
    customer.username = createCustomerDto.username;
    customer.email = createCustomerDto.email;
    customer.accountType = createCustomerDto.accountType;
    customer.address = createCustomerDto.address;
    customer.balance = 0;

    //const cust = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async getCustomerProfile(id: string): Promise<Customer> {
    return this.customerRepository.findOne({ id });
  }

  async getCustomerProfileByEmail(username: string): Promise<Customer> {
    console.log(username);

    const user = await this.customerRepository.findOne({ username });

    return user;
  }
  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const cust: Customer = await this.getCustomerProfile(id);
    cust.address = updateCustomerDto.address;
    cust.email = updateCustomerDto.email;

    const customer = this.customerRepository.save(cust);
    return customer;
  }

  async transferFunds(
    id: string,
    transferFundsDto: TransferFundsDto,
  ): Promise<string> {
    const cust: Customer = await this.getCustomerProfile(id);

    if (cust.balance < transferFundsDto.fundToTransfer)
      throw new Error('Amount is not sufficient');

    const toTransfer: Customer = await this.getCustomerProfile(
      transferFundsDto.toCreditId,
    );

    cust.balance = cust.balance - transferFundsDto.fundToTransfer;
    await this.customerRepository.save(cust);
    toTransfer.balance = toTransfer.balance + transferFundsDto.fundToTransfer;
    await this.customerRepository.save(toTransfer);

    return 'amount transferred successfully...';
  }
  async getCustomerProfileByUsername(username: string): Promise<Customer> {
    const customer: Customer = await this.customerRepository.findOne({
      username,
    });
    if (!customer)
      throw new BadRequestException(
        'Login credentials can not be created for customer as customer does not have account',
      );
    return customer;
  }
  async deleteCustomer(id: string): Promise<Customer> {
    const customer = await this.getCustomerProfile(id);
    if (customer) {
      const ret = await this.customerRepository.delete(id);
      if (ret.affected === 1) {
        return customer;
      }
    }
    throw new NotFoundException(`Record cannot find by id ${id}`);
  }
}
