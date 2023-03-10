import { Injectable } from '@nestjs/common';
import { Comment } from '../../../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeStatusType } from '../../../entities/like-post.entity';
import { LikeComment } from '../../../entities/like-comment.entity';
import { CommentViewModel } from './query-repository/comment-view.dto';
import { LikeInfoViewModel } from './query-repository/like-info-view.dto';

@Injectable()
export class CommentsRepositories {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(LikeComment)
    private readonly likeCommentRepo: Repository<LikeComment>,
  ) {}

  async saveComment(newComment: Comment): Promise<CommentViewModel> {
    const createdComment = await this.commentRepo.save(newComment);
    //default items
    const likesInfo = new LikeInfoViewModel(0, 0, LikeStatusType.None);
    //returning comment for View
    return new CommentViewModel(
      createdComment.id,
      newComment.content,
      newComment.userId,
      newComment.user.login,
      newComment.createdAt,
      likesInfo,
    );
  }

  async saveLikeComment(newLikeComment: LikeComment): Promise<LikeComment> {
    return this.likeCommentRepo.save(newLikeComment);
  }

  async findCommentsById(id: string): Promise<Comment> {
    return this.commentRepo.findOneBy({ id: id });
  }

  async deleteCommentsById(id: string): Promise<boolean> {
    await this.commentRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Comment, { id: id });
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return true;
  }

  async findLikeComment(id: string, userId: string): Promise<LikeComment> {
    return this.likeCommentRepo.findOneBy({ userId: userId, parentId: id });
  }
}
