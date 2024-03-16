import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import {
  StatisticsFilterType,
  StatisticsPaginationResponseType,
} from './dto/filter-type.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { getUser } from 'src/user/decorator/user.decorator';
@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get('calculatorByMonth')
  @ApiQuery({ name: 'date', required: false })
  @Roles([Role.Admin, Role.User])
  async calculatorByMonth(@getUser() user, @Query('date') date: string) {
    const userId = Number(user.id);
    const parsedDate = date ? new Date(date) : new Date();
    return this.statisticsService.calculatorByMonth(userId, parsedDate);
  }
  @Get('calculatorByYear')
  @ApiQuery({ name: 'date', required: false })
  @Roles([Role.Admin, Role.User])
  async calculatorByYear(@getUser() user, @Query('date') date: string) {
    const userId = Number(user.id);
    const parsedDate = date ? new Date(date) : new Date();
    return this.statisticsService.calculatorByYear(userId, parsedDate);
  }
  @Get('calculatorByRange')
  @ApiQuery({ name: 'start_date', required: false })
  @ApiQuery({ name: 'end_date', required: false })
  @Roles([Role.Admin, Role.User])
  async calculatorByRange(
    @getUser() user,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    const userId = Number(user.id);
    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    const parsedEndDate = endDate ? new Date(endDate) : new Date();
    return this.statisticsService.calculatorByDateRange(
      userId,
      parsedStartDate,
      parsedEndDate,
    );
  }
  @Get('getAll')
  @Roles([Role.Admin, Role.User])
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'start_date', required: false })
  @ApiQuery({ name: 'end_date', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  getAllForUser(
    @getUser() user,
    @Query() filter: StatisticsFilterType,
  ): Promise<StatisticsPaginationResponseType> {
    const userId = Number(user.id);
    return this.statisticsService.getAllForUser(userId, filter);
  }
  @Get()
  @Roles([Role.Admin])
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'start_date', required: false })
  @ApiQuery({ name: 'end_date', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  getAll(
    @Query() filter: StatisticsFilterType,
  ): Promise<StatisticsPaginationResponseType> {
    return this.statisticsService.getAll(filter);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatisticDto: UpdateStatisticDto,
  ) {
    return this.statisticsService.update(+id, updateStatisticDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisticsService.remove(+id);
  }
}
