import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';

export class UpdateBanInfoDto {
  /**
   * rue - for ban user, false - for unban user
   */
  @IsBoolean()
  @IsOptional()
  isBanned: boolean = false;
  /**
   * Password User
   */
  @Trim()
  @Length(20)
  @IsString()
  banReason: string;
}
