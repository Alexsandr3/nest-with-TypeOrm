import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { Device } from './device.entity';
import { Blog } from './blog.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { LikePost } from './like-post.entity';
import { LikeComment } from './like-comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;
  @Column({ type: 'character varying', length: 10, collation: 'C' })
  login: string;
  @Column({ type: 'character varying', collation: 'C' })
  email: string;
  @Column({ type: 'character varying' })
  passwordHash: string;
  @Column({ type: 'timestamptz' })
  createdAt: Date;
  @Column('boolean', { default: false })
  isBanned: boolean;
  @Column({ type: 'character varying', default: null })
  banDate: string;
  @Column({ type: 'character varying', default: null })
  banReason: string;
  ///--------
  @Column({ type: 'character varying' })
  confirmationCode: string;
  @Column({ type: 'timestamptz' })
  expirationDate: Date;
  @Column('boolean', { default: false })
  isConfirmation: boolean;
  ///--------
  @Column({ type: 'character varying' })
  recoveryCode: string;
  @Column({ type: 'timestamptz' })
  expirationDateR: Date;
  @Column('boolean', { default: false })
  isConfirmationR: boolean;
  //-------
  @OneToMany(() => Device, (d) => d.user)
  device: Device[];
  @OneToMany(() => Blog, (d) => d.user)
  blogs: Blog[];
  @OneToMany(() => Post, (d) => d.user)
  posts: Post[];
  @OneToMany(() => Comment, (d) => d.user)
  comments: Comment[];
  @OneToMany(() => LikePost, (d) => d.user)
  likePosts: LikePost[];
  @OneToMany(() => LikeComment, (d) => d.user)
  likeComments: LikeComment[];

  constructor(login: string, email: string, passwordHash: string, isConfirmation: boolean) {
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
    this.confirmationCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
    this.isConfirmation = isConfirmation;
    this.recoveryCode = randomUUID();
    this.expirationDateR = add(new Date(), { hours: 1 });
  }

  static createUser(login: string, email: string, passwordHash: string, isConfirmation: boolean): User {
    const reg = new RegExp(`^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`);
    if (login.length < 3 && login.length > 10 && !reg.test(email)) {
      throw new Error('Incorrect input data for create User');
    }
    return new User(login, email, passwordHash, isConfirmation);
  }

  getLogin() {
    return this.login;
  }

  getEmail() {
    return this.email;
  }

  checkingConfirmCode(code: string) {
    if (this.isConfirmation) return false; // throw new Error("Code has confirmation already");
    if (this.confirmationCode !== code) return false; // throw new Error("Code confirmation not equal code ");
    if (this.expirationDate < new Date()) return false; // throw new Error("Confirmation has expired");
    return true;
  }

  checkingEmail() {
    if (this.isConfirmation) return false; //throw new Error("Code has confirmation already");
    if (this.expirationDate < new Date()) return false; //throw new Error("Confirmation has expired");
    return true;
  }

  checkStatusBan() {
    return this.isBanned; // throw new Error("User banned");
  }

  updateStatusConfirmCode() {
    this.isConfirmation = true;
  }

  updateConfirmCode() {
    this.confirmationCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
  }

  updateRecoveryCode() {
    this.recoveryCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
  }

  updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash;
    this.isConfirmation = true;
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }

  banUser(banReason: string) {
    this.isBanned = true;
    this.banDate = new Date().toISOString();
    this.banReason = banReason;
  }

  unblockUser() {
    this.isBanned = false;
    this.banDate = null;
    this.banReason = null;
  }
}