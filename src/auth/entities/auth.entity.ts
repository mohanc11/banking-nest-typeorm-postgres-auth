import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
export class Auth {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  user_role: USER_ROLE;

  @Column()
  customerId: string;

  async validatePassword(password) {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
