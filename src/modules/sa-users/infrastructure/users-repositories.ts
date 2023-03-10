import { Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async saveUser(createdUser: User): Promise<string> {
    const user = await this.userRepo.save(createdUser);
    return user.id;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager.createQueryBuilder().delete().from('user').where('id = :id', { id }).execute();
        // await manager.createQueryBuilder()
        //   .delete()
        //   .from("email_confirmation")
        //   .where("userId = :id", { id })
        //   .execute();
        // await manager.createQueryBuilder()
        //   .delete()
        //   .from("email_recovery")
        //   .where("userId = :id", { id })
        //   .execute();
      })
      .catch((e) => {
        return console.log(e);
      });
    return true;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User> {
    return this.userRepo.findOneBy([{ login: loginOrEmail }, { email: loginOrEmail }]);
  }

  async findUserByConfirmationCode(confirmationCode: string): Promise<User> {
    return this.userRepo.findOneBy({ confirmationCode: confirmationCode });
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<User> {
    return await this.userRepo.findOneBy({ recoveryCode: recoveryCode });
  }

  async findUserByIdWithMapped(userId: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return null;
    return user;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      relations: { subscriptions: true },
      where: { id: userId },
    });
    if (!user) return null;
    return user;
  }

  async findUserByAuthTelegramCode(code: string) {
    return await this.userRepo.findOneBy({ authTelegramCode: code });
  }
}
