import { IsEmail, IsString } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';
import { ApiProperty } from '@nestjs/swagger';

export class EmailRecoveryDto {
  /**
   * Email User for recovery
   */
  @Trim()
  @IsString()
  @IsEmail()
  @ApiProperty({ pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', example: 'string' })
  email: string;
}
