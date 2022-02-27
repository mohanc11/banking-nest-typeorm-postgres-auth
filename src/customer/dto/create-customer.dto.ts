import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column } from 'typeorm';
import { ACCOUNT_TYPE } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Username is too short',
  })
  @MaxLength(20, {
    message: 'Username is too long',
  })
  username: string;

  @Column()
  @IsNotEmpty()
  accountType: ACCOUNT_TYPE;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  address: string;
}
