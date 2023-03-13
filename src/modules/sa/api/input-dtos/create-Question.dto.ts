import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';
import { ArrayStrings } from '../../../../main/helpers/decorator-Array-strings';

export class CreateQuestionDto {
  /**
   * body: Text of question, for example: How many continents are there
   */
  @Trim()
  @Length(10, 500)
  @IsString()
  body: string;
  /**
   * correctAnswers: All variants of possible correct answers for current questions Examples: [6, 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column
   */
  @ArrayStrings()
  correctAnswers: string[];
}
