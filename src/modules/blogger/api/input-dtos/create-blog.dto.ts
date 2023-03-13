import { IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  /**
   * name: Blog name
   */
  @Trim()
  @Length(1, 15)
  @IsString()
  name: string;

  /**
   * description
   */
  @Trim()
  @Length(1, 500)
  @IsString()
  description: string;

  /**
   * websiteUrl: Blog website Url
   */
  @Trim()
  @Length(1, 100)
  @IsUrl()
  @IsString()
  @ApiProperty({ pattern: '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n', example: 'string' })
  websiteUrl: string;
}
