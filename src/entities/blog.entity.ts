import { UpdateBlogDto } from '../modules/blogger/api/input-dtos/update-blog.dto';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './user.entity';
import { BannedBlogUser } from './banned-blog-user.entity';
import { Post } from './post.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'character varying', length: 15, collation: 'C' })
  name: string;
  @Column({ type: 'character varying', length: 500, collation: 'C' })
  description: string;
  @Column({ type: 'character varying', length: 100, collation: 'C' })
  websiteUrl: string;
  @Column({ type: 'character varying' })
  createdAt: string;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ type: 'character varying', default: null })
  banDate: string;
  //-----
  @ManyToOne(() => User, (u) => u.blogs)
  user: User;
  @OneToMany(() => BannedBlogUser, (u) => u.blog)
  bannedUsers: BannedBlogUser[];
  @OneToMany(() => Post, (u) => u.blog)
  posts: Relation<Post[]>;

  constructor(userId: string, name: string, description: string, websiteUrl: string, user: User) {
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date().toISOString();
    this.user = user;
  }

  static createBlog(userId: string, name: string, description: string, websiteUrl: string, user: User) {
    const reg = new RegExp(`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$`);
    if (name.length > 15 && description.length > 500 && description.length > 100 && !reg.test(websiteUrl)) {
      throw new Error('Incorrect input data for create User');
    }
    return new Blog(userId, name, description, websiteUrl, user);
  }

  getName() {
    return this.name;
  }

  updateBlog(dto: UpdateBlogDto) {
    const { name, description, websiteUrl } = dto;
    const reg = new RegExp(`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$`);
    if (!reg.test(websiteUrl)) {
      throw new Error(`Incorrect input #web data for update blog`);
    }
    if (name.length < 15 && description.length < 500 && websiteUrl.length < 100) {
      this.name = name;
      this.websiteUrl = websiteUrl;
      this.description = description;
    } else {
      throw new Error(`Incorrect input data for update blog`);
    }
  }

  checkOwner(userId: string) {
    return this.userId === userId; //throw new Error("Not owner Blog");
  }

  checkStatusBan() {
    return this.isBanned; //throw new Error("User banned");
  }

  updateOwner(userId: string) {
    this.userId = userId;
  }

  updateBanStatus(isBanned: boolean) {
    this.isBanned = isBanned;
    this.banDate = new Date().toISOString();
  }
}
