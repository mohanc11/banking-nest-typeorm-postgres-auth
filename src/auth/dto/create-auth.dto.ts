import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Username is too short',
  })
  @MaxLength(20, {
    message: 'Username is too long',
  })
  username: string;
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Password is too short',
  })
  @MaxLength(20, {
    message: 'Password is too long',
  })
  password: string;
}
