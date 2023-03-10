import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestingModule } from './modules/testing/testing.module';
import { ConfigType, getConfiguration } from './main/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './modules/sa-users/api/users.controller';
import { CreateUserHandler } from './modules/auth/application/use-cases/create-user.handler';
import { CreateUserSaHandler } from './modules/sa-users/application/use-cases/create-user-sa.handler';
import { DeleteUserHandler } from './modules/sa-users/application/use-cases/delete-user.handler';
import { BanUserSaHandler } from './modules/sa-users/application/use-cases/ban-user-sa.handler';
import { JwtService } from './modules/auth/application/jwt.service';
import { MailService } from './modules/mail/mail.service';
import { UsersRepositories } from './modules/sa-users/infrastructure/users-repositories';
import { PostsRepositories } from './modules/posts/infrastructure/posts-repositories';
import { UsersQueryRepositories } from './modules/sa-users/infrastructure/query-reposirory/users-query.reposit';
import { DeviceRepositories } from './modules/security/infrastructure/device-repositories';
import { CommentsRepositories } from './modules/comments/infrastructure/comments.repositories';
import { BasicAuthGuard } from './main/guards/basic-auth.guard';
import { UsersService } from './modules/sa-users/domain/users.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteDevicesHandler } from './modules/security/application/use-cases/delete-devices.handler';
import { DeleteDeviceByIdHandler } from './modules/security/application/use-cases/delete-device-by-id.handler';
import { DevicesController } from './modules/security/api/devices.controller';
import { DeviceQueryRepositories } from './modules/security/infrastructure/query-repository/device-query.repositories';
import { BindBlogHandler } from './modules/sa/application/use-cases/bind-blog.handler';
import { UpdateBanBlogSaHandler } from './modules/sa/application/use-cases/update-ban-blog-sa.handler';
import { BlogsQueryRepositories } from './modules/blogs/infrastructure/query-repository/blogs-query.repositories';
import { BlogsRepositories } from './modules/blogs/infrastructure/blogs.repositories';
import { SaController } from './modules/sa/api/sa.controller';
import { SaService } from './modules/sa/domain/sa.service';
import { CreateCommentHandler } from './modules/posts/application/use-cases/create-comment.handler';
import { UpdateLikeStatusPostHandler } from './modules/posts/application/use-cases/update-like-status-post.handler';
import { PostsQueryRepositories } from './modules/posts/infrastructure/query-repositories/posts-query.reposit';
import { CommentsQueryRepositories } from './modules/comments/infrastructure/query-repository/comments-query.repositories';
import { JwtAuthGuard } from './main/guards/jwt-auth-bearer.guard';
import { JwtForGetGuard } from './main/guards/jwt-auth-bearer-for-get.guard';
import { PostsController } from './modules/posts/api/posts.controller';
import { PostsService } from './modules/posts/domain/posts.service';
import { DeleteCommentHandler } from './modules/comments/application/use-cases/delete-comment.handler';
import { UpdateCommentHandler } from './modules/comments/application/use-cases/update-comment.handler';
import { UpdateLikeStatusCommentHandler } from './modules/comments/application/use-cases/update-like-status-comment.handler';
import { CommentsController } from './modules/comments/api/comments.controller';
import { CommentsService } from './modules/comments/domain/comments.service';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { BlogsService } from './modules/blogs/domain/blogs.service';
import { BasicStrategy } from './main/strategies/basic.strategy';
import { CreateBlogHandler } from './modules/blogger/application/use-cases/create-blog.handler';
import { DeleteBlogHandler } from './modules/blogger/application/use-cases/delete-blog.handler';
import { UpdateBlogHandler } from './modules/blogger/application/use-cases/update-blog.handler';
import { CreatePostHandler } from './modules/blogger/application/use-cases/create-post.handler';
import { DeletePostHandler } from './modules/blogger/application/use-cases/delete-post.handler';
import { UpdatePostHandler } from './modules/blogger/application/use-cases/update-post.handler';
import { UpdateBanUserForCurrentBlogHandler } from './modules/blogger/application/use-cases/update-ban-user-for-current-blog.handler';
import { BloggersController } from './modules/blogger/api/bloggers.controller';
import { BlogUuidIdValidator } from './main/validators/is-uuid-id-validator.service';
import { BloggersService } from './modules/blogger/domain/bloggers.service';
import { LogoutHandler } from './modules/auth/application/use-cases/logout.handler';
import { ResendingHandler } from './modules/auth/application/use-cases/resending.handler';
import { ConfirmByCodeHandler } from './modules/auth/application/use-cases/confirmation-by-code.handler';
import { NewPasswordHandler } from './modules/auth/application/use-cases/new-password.handler';
import { RecoveryHandler } from './modules/auth/application/use-cases/recovery.handler';
import { LoginHandler } from './modules/auth/application/use-cases/login.handler';
import { RefreshHandler } from './modules/auth/application/use-cases/refresh.handler';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './modules/auth/api/auth.controller';
import { User } from './entities/user.entity';
import { Device } from './entities/device.entity';
import { Blog } from './entities/blog.entity';
import { BannedBlogUser } from './entities/banned-blog-user.entity';
import { Post } from './entities/post.entity';
import { LikeComment } from './entities/like-comment.entity';
import { LikePost } from './entities/like-post.entity';
import { Comment } from './entities/comment.entity';
import { CreateQuestionHandler } from './modules/sa/application/use-cases/create-question.handler';
import { Question } from './entities/question.entity';
import { QuestionRepository } from './modules/sa/infrastructure/question.reposit';
import { QuestionQueryRepository } from './modules/sa/infrastructure/query-reposirory/question-query.reposit';
import { DeleteQuestionHandler } from './modules/sa/application/use-cases/delete-question.handler';
import { UpdateQuestionHandler } from './modules/sa/application/use-cases/update-question.handler';
import { PublishQuestionHandler } from './modules/sa/application/use-cases/publish-question.handler';
import { Answer } from './entities/answer.entity';
import { Player } from './entities/player.entity';
import { Game } from './entities/game.entity';
import { QuizRepositories } from './modules/quiz/infrastructure/quiz-repositories';
import { QuizController } from './modules/quiz/api/quiz.controller';
import { ConnectionQuizHandler } from './modules/quiz/application/use-case/connection-quiz.handler';
import { QuizQueryRepositories } from './modules/quiz/infrastructure/query-repository/quiz-query-repositories';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AnswerQuizHandler } from './modules/quiz/application/use-case/answer-quiz.handler';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadImageWallpaperHandler } from './modules/blogger/application/use-cases/upload-image-wallpaper.handler';
import { S3StorageAdapter } from './modules/blogger/domain/s3-storage-adapter.service';
import { UploadImageMainHandler } from './modules/blogger/application/use-cases/upload-image-main.handler';
import { ImageBlog } from './entities/imageBlog.entity';
import { UploadImageMainPostHandler } from './modules/blogger/application/use-cases/upload-image-main-post.handler';
import { ImagePost } from './entities/imagePost.entity';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { UnsubscriptionToBlogHandler } from './modules/blogs/application/use-cases/unsubscription-to-blog.handler';
import { SubscriptionToBlogHandler } from './modules/blogs/application/use-cases/subscription-to-blog.handler';
import { SubscriptionToBlog } from './entities/subscription.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import LogsMiddleware from './main/utils/logs.middleware';
import DatabaseLogger from './main/utils/databaseLogger';
import { LoggerModule } from './modules/logger/logger.module';
import { BlogsGetController } from './modules/blogs/api/blogs-get.controller';
import { BloggersImagesController } from './modules/blogger/api/bloggers-images.controller';
import { PostsGetController } from './modules/posts/api/posts-get.controller';

const controllers = [
  AuthController,
  UsersController,
  SaController,
  DevicesController,
  BlogsController,
  BlogsGetController,
  BloggersController,
  BloggersImagesController,
  PostsController,
  PostsGetController,
  CommentsController,
  QuizController,
];
const providers = [
  AppService,
  UsersService,
  SaService,
  BlogsService,
  BloggersService,
  PostsService,
  CommentsService,
  BlogUuidIdValidator,
  BasicStrategy,
  ThrottlerGuard,
  S3StorageAdapter,
  // {
  //   provide: APP_GUARD,
  //   useClass: ThrottlerGuard,
  // },
];
const guards = [BasicAuthGuard, JwtAuthGuard, JwtForGetGuard];
const adapters = [
  JwtService,
  MailService,
  UsersRepositories,
  UsersQueryRepositories,
  BlogsRepositories,
  BlogsQueryRepositories,
  PostsRepositories,
  PostsQueryRepositories,
  CommentsRepositories,
  CommentsQueryRepositories,
  DeviceRepositories,
  DeviceQueryRepositories,
  QuestionRepository,
  QuestionQueryRepository,
  QuizRepositories,
  QuizQueryRepositories,
];
const handlers = [
  //---> auth
  ConfirmByCodeHandler,
  CreateUserHandler,
  LoginHandler,
  LogoutHandler,
  NewPasswordHandler,
  RefreshHandler,
  RecoveryHandler,
  ResendingHandler,

  //---> blogger
  CreateBlogHandler,
  CreatePostHandler,
  DeleteBlogHandler,
  DeletePostHandler,
  UpdateBlogHandler,
  UpdatePostHandler,
  UpdateBanUserForCurrentBlogHandler,
  //---> blogger ---> upload images
  UploadImageWallpaperHandler,
  UploadImageMainHandler,
  UploadImageMainPostHandler,

  //---> comments
  DeleteCommentHandler,
  UpdateCommentHandler,
  UpdateLikeStatusCommentHandler,
  //---> posts
  CreateCommentHandler,
  UpdateLikeStatusPostHandler,

  //---> sa
  CreateUserSaHandler,
  DeleteUserHandler,
  BanUserSaHandler,
  BindBlogHandler,
  UpdateBanBlogSaHandler,

  //---> security
  DeleteDevicesHandler,
  DeleteDeviceByIdHandler,

  //---> sa ---> game
  CreateQuestionHandler,
  DeleteQuestionHandler,
  UpdateQuestionHandler,
  PublishQuestionHandler,
  ConnectionQuizHandler,
  // AnswerTransaction,
  AnswerQuizHandler,

  //------>subscribe
  SubscriptionToBlogHandler,
  UnsubscriptionToBlogHandler,
];
const entities = [
  User,
  Device,
  Blog,
  BannedBlogUser,
  Post,
  Comment,
  LikePost,
  LikeComment,
  Question,
  Answer,
  Player,
  Game,
  ImageBlog,
  ImagePost,
  SubscriptionToBlog,
];
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10, //default  - 10 s
      limit: 5, //default  - 5 st
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const database = configService.get('database', { infer: true });
        return {
          type: 'postgres',
          logger: new DatabaseLogger(),
          // entities: [...entities],
          url: database.PGSQL_URL,
          autoLoadEntities: true,
          synchronize: true,
          ssl: true,
        };
      },
    }),
    TypeOrmModule.forFeature([...entities]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api',
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MailModule,
    CqrsModule,
    TestingModule,
    IntegrationsModule,
    LoggerModule,
  ],
  controllers: [AppController, ...controllers],
  providers: [...providers, ...guards, ...adapters, ...handlers],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
