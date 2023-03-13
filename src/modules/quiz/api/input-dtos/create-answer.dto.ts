import { IsString } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';

export class AnswerDto {
  /**
   * answer: Text of answer, for example: 'free'
   */
  @Trim()
  @IsString()
  answer: string;
}
