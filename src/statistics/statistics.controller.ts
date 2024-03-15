import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { StatisticsFilterType, StatisticsPaginationResponseType } from './dto/filter-type.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { getUser } from 'src/user/decorator/user.decorator';
@ApiTags('statistics')
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get("getAll")
  @Roles([Role.Admin,Role.User])
  @ApiQuery({name:"page",required:false})
  @ApiQuery({name:"items_per_page",required:false})
  @ApiQuery({name:"start_date",required:false})
  @ApiQuery({name:"end_date",required:false})
  @ApiQuery({name:"previousPage",required:false})
  @ApiQuery({name:"nextPage",required:false})
  getAllForUser(@getUser()user,@Query() filter: StatisticsFilterType):Promise<StatisticsPaginationResponseType>{
    const userId = Number(user.id)
    return this.statisticsService.getAllForUser(userId,filter)
  }
  @Get()
  @Roles([Role.Admin])
  @ApiQuery({name:"page",required:false})
  @ApiQuery({name:"items_per_page",required:false})
  @ApiQuery({name:"start_date",required:false})
  @ApiQuery({name:"end_date",required:false})
  @ApiQuery({name:"previousPage",required:false})
  @ApiQuery({name:"nextPage",required:false})
  getAll(@Query() filter: StatisticsFilterType):Promise<StatisticsPaginationResponseType>{
    return this.statisticsService.getAll(filter)
  }
 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatisticDto: UpdateStatisticDto) {
    return this.statisticsService.update(+id, updateStatisticDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisticsService.remove(+id);
  }
}
