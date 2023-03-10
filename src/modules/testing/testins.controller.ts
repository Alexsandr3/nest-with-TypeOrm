import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Testing')
@Controller(`testing`)
export class TestingController {
  constructor(protected testingService: TestingService) {}

  @ApiOperation({ summary: 'Clear database: delete all data from all tables/collections' })
  @ApiResponse({ status: 204, description: 'success' })
  @Delete(`/all-data`)
  @HttpCode(204)
  async deleteDB() {
    return await this.testingService.truncateDBTables();
    // return await this.testingService.deleteAll();
  }
}
