import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { LikePost } from '../../entities/like-post.entity';
import { LikeComment } from '../../entities/like-comment.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Player } from '../../entities/player.entity';
import { Game } from '../../entities/game.entity';
import { ImageBlog } from '../../entities/imageBlog.entity';
import { ImagePost } from '../../entities/imagePost.entity';
import { SubscriptionToBlog } from '../../entities/subscription.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataService: DataSource,
  ) {}

  async truncateDBTables(): Promise<void> {
    const connection = this.dataService;
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }

  async deleteAll() {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        // await manager.delete(Log, {});
        await manager.delete(Answer, {});
        await manager.delete(Question, {});
        await manager.delete(Game, {});
        await manager.delete(Player, {});

        await manager.delete(LikeComment, {});
        await manager.delete(LikePost, {});
        await manager.delete(Comment, {});
        await manager.delete(Post, {});
        await manager.delete(ImagePost, {});
        await manager.delete(BannedBlogUser, {});
        await manager.delete(SubscriptionToBlog, {});
        await manager.delete(Blog, {});
        await manager.delete(ImageBlog, {});
        await manager.delete(Device, {});
        await manager.delete(User, {});
      })
      .catch((e) => {
        return console.log(e);
      });
    return;
  }
}
