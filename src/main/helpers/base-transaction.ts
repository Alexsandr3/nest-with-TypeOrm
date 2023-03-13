import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseTransaction<TransactionInput, TransactionOutput> {
  protected constructor(private readonly connection: DataSource) {}
  // this function will contain all of the operations that you need to perform
  // and has to be implemented in all transaction classes
  protected abstract onExecute(data: TransactionInput, manager: EntityManager): Promise<TransactionOutput>;

  private createRunner(): QueryRunner {
    return this.connection.createQueryRunner();
  }

  // this is the main function that runs the transaction
  async run(data: TransactionInput): Promise<TransactionOutput> {
    // since everything in Nest.js is a singleton we should create a separate
    // QueryRunner instance for each call
    const queryRunner = this.createRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.onExecute(data, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  // this is a function that allows us to use other "transaction" classes
  // inside of any other "main" transaction, i.e. without creating a new DB transaction
  async runWithoutTransaction(data: TransactionInput, manager: EntityManager): Promise<TransactionOutput> {
    return this.onExecute(data, manager);
  }
}
