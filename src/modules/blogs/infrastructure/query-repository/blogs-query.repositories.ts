import { Injectable } from '@nestjs/common';
import { BanInfoForBlogType, BlogOwnerInfoType, BlogViewForSaModel } from './blog-view-for-sa.dto';
import { PaginationViewDto } from '../../../../common/pagination-View.dto';
import { PaginationBlogDto } from '../../../blogger/api/input-dtos/pagination-blog.dto';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import { UsersForBanBlogView } from '../../../sa-users/infrastructure/query-reposirory/user-ban-for-blog-view.dto';
import { Blog } from '../../../../entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BannedBlogUser } from '../../../../entities/banned-blog-user.entity';
import { PaginationBannedUsersDto } from '../../../blogger/api/input-dtos/pagination-banned-users.dto';
import { BlogViewModel } from './blog-view.dto';
import { BanInfoType } from '../../../sa-users/infrastructure/query-reposirory/ban-info.dto';
import { ImageBlog } from '../../../../entities/imageBlog.entity';
import { BlogImagesViewModel, PhotoSizeModel } from '../../../blogger/infrastructure/blog-images-view.dto';
import { SubscriptionToBlog } from '../../../../entities/subscription.entity';
import { BloggerViewModel } from './blogger-view.dto';

@Injectable()
export class BlogsQueryRepositories {
  // private readonly logger = new Logger(BlogsQueryRepositories.name);
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BannedBlogUser)
    private readonly bannedBlogUserRepo: Repository<BannedBlogUser>,
    @InjectRepository(ImageBlog)
    private readonly imageBlogRepo: Repository<ImageBlog>,
    @InjectRepository(SubscriptionToBlog)
    private readonly subscriptionToBlogRepo: Repository<SubscriptionToBlog>,
  ) {}

  private mapperBlogForSaView(object: Blog): BlogViewForSaModel {
    const blogOwnerInfo = new BlogOwnerInfoType(object.userId, object.user.login);
    const banInfoForBlog = new BanInfoForBlogType(object.isBanned, object.banDate);
    return new BlogViewForSaModel(
      object.id,
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt,
      object.isMembership,
      blogOwnerInfo,
      banInfoForBlog,
    );
  }

  private mapperBlogger(blog: Blog): BloggerViewModel {
    let images: BlogImagesViewModel;
    if (blog.image === null) {
      images = new BlogImagesViewModel(null, []);
      return new BloggerViewModel(
        blog.id,
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.isMembership,
        images,
        // blog.subscribersCount,
      );
    }
    const imageWallpaperDefault = new PhotoSizeModel(blog.image.keyImageWallpaper, 1028, 312, blog.image.sizeImageWallpaper);
    const imageWallpaper = blog.image.keyImageWallpaper ? imageWallpaperDefault : null;
    const imageMainDefault = new PhotoSizeModel(blog.image.keyImageMain, 156, 156, blog.image.sizeMainImage);
    // const imageSmallMainDefault = new PhotoSizeModel(blog.image.keySmallImageMain, 48, 48, blog.image.sizeSmallImageMain);
    const imageMain = blog.image.keyImageMain ? [imageMainDefault] : [];
    images = new BlogImagesViewModel(imageWallpaper, imageMain);
    return new BloggerViewModel(
      blog.id,
      blog.name,
      blog.description,
      blog.websiteUrl,
      blog.createdAt,
      blog.isMembership,
      images,
      // blog.subscribersCount,
    );
  }

  private async mapperBlog(blog: Blog, userId?: string | null): Promise<BlogViewModel> {
    // const subscription = await this.subscriptionToBlogRepo.findOneBy({ userId: userId, blogId: blog.id });
    // const currentUserSubscriptionStatus = userId ? subscription.status : SubscriptionStatuses.None;
    let images: BlogImagesViewModel;
    if (blog.image === null) {
      images = new BlogImagesViewModel(null, []);
      return new BlogViewModel(
        blog.id,
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.isMembership,
        images,
        // currentUserSubscriptionStatus,
        // blog.subscribersCount,
      );
    }
    const imageWallpaperDefault = new PhotoSizeModel(blog.image.keyImageWallpaper, 1028, 312, blog.image.sizeImageWallpaper);
    const imageWallpaper = blog.image.keyImageWallpaper ? imageWallpaperDefault : null;
    const imageMainDefault = new PhotoSizeModel(blog.image.keyImageMain, 156, 156, blog.image.sizeMainImage);
    // const imageSmallMainDefault = new PhotoSizeModel(blog.image.keySmallImageMain, 48, 48, blog.image.sizeSmallImageMain);
    const imageMain = blog.image.keyImageMain ? [imageMainDefault] : [];
    images = new BlogImagesViewModel(imageWallpaper, imageMain);
    return new BlogViewModel(
      blog.id,
      blog.name,
      blog.description,
      blog.websiteUrl,
      blog.createdAt,
      blog.isMembership,
      images,
      // currentUserSubscriptionStatus,
      // blog.subscribersCount,
    );
  }

  private mapperBanInfo(object: BannedBlogUser): UsersForBanBlogView {
    const banInfo = new BanInfoType(object.isBanned, object.banDate, object.banReason);
    return new UsersForBanBlogView(object.userId, object.login, banInfo);
  }

  async findBlogs(data: PaginationBlogDto, userId?: string | null): Promise<PaginationViewDto<BlogViewModel>> {
    const { searchNameTerm } = data;
    let filter: any = { isBanned: false };
    if (searchNameTerm.trim().length > 0) {
      filter = { isBanned: false, name: ILike(`%${searchNameTerm}%`) };
    }
    //search all blogs for current user
    const [blogs, count] = await this.blogRepo.findAndCount({
      select: ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership', 'image', 'subscribersCount'],
      relations: { image: true },
      where: filter,
      order: { [data.isSortByDefault()]: data.isSortDirection() },
      skip: data.skip,
      take: data.getPageSize(),
    });

    const mappedBlogs = blogs.map((blog) => this.mapperBlog(blog, userId));
    const items = await Promise.all(mappedBlogs);
    const pagesCountRes = Math.ceil(count / data.getPageSize());
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, data.getPageNumber(), data.getPageSize(), count, items);
  }

  async findBlogsForSa(data: PaginationBlogDto): Promise<PaginationViewDto<BlogViewForSaModel>> {
    const { searchNameTerm } = data;
    let filter = {};
    if (searchNameTerm.trim().length > 0) {
      filter['name'] = ILike(`%${searchNameTerm}%`);
    }
    //search all blogs for current user and counting
    const [blogs, count] = await this.blogRepo.findAndCount({
      select: ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'userId', 'isBanned', 'banDate'],
      relations: { user: true },
      where: filter,
      order: { [data.isSortByDefault()]: data.isSortDirection() },
      skip: data.skip,
      take: data.getPageSize(),
    });
    //mapped for View
    const mappedBlogs = blogs.map((blog) => this.mapperBlogForSaView(blog));
    const pagesCountRes = Math.ceil(count / data.getPageSize());
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, data.getPageNumber(), data.getPageSize(), count, mappedBlogs);
  }

  async findBlogsForCurrentBlogger(data: PaginationBlogDto, userId: string): Promise<PaginationViewDto<BlogViewModel>> {
    const { searchNameTerm } = data;
    let filter: any = { userId: userId, isBanned: false };
    if (searchNameTerm.trim().length > 0) {
      filter = {
        userId: userId,
        isBanned: false,
        name: ILike(`%${searchNameTerm}%`),
      };
    }
    //search all blogs and counting for current user
    const [blogs, count] = await this.blogRepo.findAndCount({
      select: ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership', 'image'],
      relations: { image: true },
      where: filter,
      order: { [data.isSortByDefault()]: data.isSortDirection() },
      skip: data.skip,
      take: data.getPageSize(),
    });

    const mappedBlogs = blogs.map((blog) => this.mapperBlog(blog));
    const items = await Promise.all(mappedBlogs);
    const pagesCountRes = Math.ceil(count / data.getPageSize());
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, data.getPageNumber(), data.getPageSize(), count, items);
  }

  async findBlog(blogId: string, userId?: string | null): Promise<BlogViewModel> {
    const blog = await this.blogRepo.findOne({
      select: [],
      relations: { image: true },
      where: { id: blogId, isBanned: false },
    });

    if (!blog) {
      // this.logger.warn('Tried to access a blog that does not exist');
      throw new NotFoundExceptionMY(`Not found current blog with id: ${blogId}`);
    }
    return this.mapperBlog(blog, userId);
  }

  async findBlogForBlogger(blogId: string): Promise<BloggerViewModel> {
    const blog = await this.blogRepo.findOne({
      select: [],
      relations: { image: true },
      where: { id: blogId, isBanned: false },
    });

    if (!blog) throw new NotFoundExceptionMY(`Not found current blog with id: ${blogId}`);
    return this.mapperBlogger(blog);
  }

  async findBlogWithMapped(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOneBy({
      id: id,
      isBanned: false,
    });
    if (!blog) return null;
    return blog;
  }

  async findBlogWithMap(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOneBy({ id: id, isBanned: false });
    if (!blog) throw new NotFoundExceptionMY(`Not found current blog with id: ${id}`);
    return blog;
  }

  async getBannedUsersForBlog(blogId: string, data: PaginationBannedUsersDto): Promise<PaginationViewDto<UsersForBanBlogView>> {
    const { searchLoginTerm } = data;
    let filter: any = { blogId: blogId, isBanned: true };
    if (searchLoginTerm.trim().length > 0) {
      filter = {
        blogId: blogId,
        isBanned: true,
        login: ILike(`%${searchLoginTerm}%`),
      };
    }
    //search all blogs for current user
    const [blogs, count] = await this.bannedBlogUserRepo.findAndCount({
      select: ['isBanned', 'banReason', 'banDate', 'userId', 'login'],
      where: filter,
      order: { [data.isSorByDefault()]: data.isSortDirection() },
      skip: data.skip,
      take: data.getPageSize(),
    });

    //mapped for View
    const mappedBlogs = blogs.map((blog) => this.mapperBanInfo(blog));
    const pagesCountRes = Math.ceil(count / data.getPageSize());
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, data.getPageNumber(), data.getPageSize(), count, mappedBlogs);
  }

  async getImageMain(id: string): Promise<BlogImagesViewModel> {
    const imageBlogInfo = await this.imageBlogRepo.findOne({
      where: { blogId: id },
    });
    let photoInfoWallpaper = null;
    if (imageBlogInfo.keyImageWallpaper !== null) {
      photoInfoWallpaper = new PhotoSizeModel(imageBlogInfo.keyImageWallpaper, 1028, 312, imageBlogInfo.sizeImageWallpaper);
    }

    const photoInfoMain = new PhotoSizeModel(imageBlogInfo.keyImageMain, 156, 156, imageBlogInfo.sizeMainImage);
    // const photoInfoReducedMain = new PhotoSizeModel(imageBlogInfo.keySmallImageMain, 48, 48, imageBlogInfo.sizeSmallImageMain);
    return new BlogImagesViewModel(photoInfoWallpaper, [photoInfoMain]);
  }

  async getImageWallpaper(blogId: string): Promise<BlogImagesViewModel> {
    const imageBlogInfo = await this.imageBlogRepo.findOne({
      where: { blogId: blogId },
    });
    let photoInfoMain = [];
    if (imageBlogInfo.keyImageMain !== null) {
      const infoMain = new PhotoSizeModel(imageBlogInfo.keyImageMain, 156, 156, imageBlogInfo.sizeMainImage);
      // const infoReducedMain = new PhotoSizeModel(imageBlogInfo.keySmallImageMain, 48, 48, imageBlogInfo.sizeSmallImageMain);
      photoInfoMain = [infoMain];
    }
    const photoInfoWallpaper = new PhotoSizeModel(imageBlogInfo.keyImageWallpaper, 1028, 312, imageBlogInfo.sizeImageWallpaper);
    return new BlogImagesViewModel(photoInfoWallpaper, photoInfoMain);
  }
}
