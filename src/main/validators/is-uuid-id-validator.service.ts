import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepositories } from '../../modules/blogs/infrastructure/query-repository/blogs-query.repositories';

@ValidatorConstraint({ name: 'IsUuidCustom', async: true })
@Injectable()
export class BlogUuidIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsQueryRepositories: BlogsQueryRepositories) {}

  async validate(blogId: string) {
    try {
      const blog = await this.blogsQueryRepositories.findBlogWithMapped(blogId);
      if (!blog) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Blog doesn't exist";
  }
}
