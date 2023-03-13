import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';

export class LoginDto {
  /**
   * Login or Email  -  User
   */
  @Trim()
  @IsNotEmpty()
  @IsString()
  loginOrEmail: string;
  /**
   * Password User
   */
  @Trim()
  @IsNotEmpty()
  @IsString()
  password: string;
}
