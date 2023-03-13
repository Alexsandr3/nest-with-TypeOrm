import { IsEnum, IsOptional } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';
import { LikeStatusType } from '../../../../entities/like-post.entity';

export class UpdateLikeStatusDto {
  /**
   * Send "None" if you want to un "like" or "undislike"
   */
  @Trim()
  @IsEnum(LikeStatusType)
  @IsOptional()
  'likeStatus': LikeStatusType = LikeStatusType.None;
}
