import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { PostsRepositories } from '../../../posts/infrastructure/posts-repositories';
import { UpdateBanInfoForBlogDto } from '../../api/input-dtos/update-ban-info-for-blog.dto';

export class UpdateBanBlogSaCommand {
  constructor(
    public readonly updateBanInfoForBlogModel: UpdateBanInfoForBlogDto,
    public readonly blogId: string,
  ) {}
}

@CommandHandler(UpdateBanBlogSaCommand)
export class UpdateBanBlogSaHandler implements ICommandHandler<UpdateBanBlogSaCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepositories,
    private readonly postsRepo: PostsRepositories,
  ) {}

  async execute(command: UpdateBanBlogSaCommand): Promise<boolean> {
    const { blogId } = command;
    const { isBanned } = command.updateBanInfoForBlogModel;
    //finding blog for check existence
    const foundBlog = await this.blogsRepo.findBlog(blogId);
    if (!foundBlog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    //update status ban for blog
    foundBlog.updateBanStatus(isBanned);
    //save updated status for blog
    await this.blogsRepo.saveBlog(foundBlog);
    await this.postsRepo.updateStatusBanPostForBlogger(blogId, isBanned);
    return true;
  }
}
