import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum SubscriptionStatuses {
  Subscribed = 'Subscribed',
  Unsubscribed = 'Unsubscribed',
  None = 'None',
}

@Entity()
export class SubscriptionToBlog {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  blogId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'bigint', default: null })
  telegramId: number;
  @Column({
    type: 'enum',
    enum: SubscriptionStatuses,
    default: SubscriptionStatuses.None,
  })
  status: SubscriptionStatuses;
  @ManyToOne(() => User, (u) => u.subscriptions)
  user: User;

  constructor(blogId: string, userId: string, user: User, telegramId: number) {
    this.blogId = blogId;
    this.userId = userId;
    this.user = user;
    this.telegramId = telegramId;
  }

  static createSubscriptionToBlog(blogId: string, userId: string, user: User) {
    return new SubscriptionToBlog(blogId, userId, user, user.telegramId);
  }

  subscription() {
    this.status = SubscriptionStatuses.Subscribed;
  }

  unSubscription() {
    this.status = SubscriptionStatuses.Unsubscribed;
  }
}
