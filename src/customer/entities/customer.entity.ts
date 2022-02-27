import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  username: string;

  @Column()
  accountType: ACCOUNT_TYPE;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  balance: number;
}

export enum ACCOUNT_TYPE {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT',
}
