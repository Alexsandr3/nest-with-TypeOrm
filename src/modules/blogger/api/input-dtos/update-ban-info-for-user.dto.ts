import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IsUuidCustom } from '../../../../main/helpers/decorator-IsUuid';
import { Trim } from '../../../../main/helpers/decorator-trim';

export class UpdateBanInfoForUserDto {
  /**
   * isBanned: User
   */
  @IsBoolean()
  @IsOptional()
  isBanned: boolean = true;
  /**
   * password: password User
   */
  @Trim()
  @Length(20)
  @IsString()
  banReason: string;
  /**
   * id for Blog
   */
  @Trim()
  @IsNotEmpty()
  @IsUuidCustom()
  @IsString()
  blogId: string;
}
