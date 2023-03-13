import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   * login: Login for create/registration User
   */
  @Trim()
  @Length(3, 10)
  @IsString()
  @ApiProperty({ pattern: '^[a-zA-Z0-9_-]*$', example: 'string' })
  login: string;
  /**
   * password: password for create/registration User
   */
  @Trim()
  @Length(6, 20)
  @IsString()
  password: string;
  /**
   * email: email for create/registration User
   */
  @ApiProperty({ pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'string' })
  @Trim()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
