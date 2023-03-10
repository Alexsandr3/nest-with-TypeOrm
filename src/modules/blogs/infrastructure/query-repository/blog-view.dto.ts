import { BlogImagesViewModel } from '../../../blogger/infrastructure/blog-images-view.dto';
import { SubscriptionStatuses } from '../../../../entities/subscription.entity';

//SubscriptionStatuses
export class BlogViewModel {
  public id: string;
  public name: string;
  public description: string;
  public websiteUrl: string;
  public createdAt: string;
  public isMembership: boolean;
  public images: BlogImagesViewModel;
  public currentUserSubscriptionStatus: SubscriptionStatuses;
  public subscribersCount: number;
  constructor(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    images: BlogImagesViewModel,
    currentUserSubscriptionStatus: SubscriptionStatuses,
    subscribersCount: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.isMembership = isMembership;
    this.images = images;
    this.currentUserSubscriptionStatus = currentUserSubscriptionStatus;
    this.subscribersCount = subscribersCount;
  }
}
