import { IsString, Length } from 'class-validator';
import { Trim } from "../../../../main/helpers/decorator-trim";

export class CreateCommentDto {
  /**
   * content for create Comment
   */
  @Trim()
  @Length(20, 300)
  @IsString()
  content: string;
}
