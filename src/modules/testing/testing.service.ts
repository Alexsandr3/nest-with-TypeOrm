import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { LikePost } from '../../entities/like-post.entity';
import { LikeComment } from '../../entities/like-comment.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteAll() {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(LikeComment, {});
        await manager.delete(LikePost, {});
        await manager.delete(Comment, {});
        await manager.delete(Post, {});
        await manager.delete(BannedBlogUser, {});
        await manager.delete(Blog, {});
        await manager.delete(Device, {});
        await manager.delete(User, {});
      })
      .catch((e) => {
        return console.log(e);
      });
    return;
  }
}
