import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _statistics: any;
  public get statistics(): any {
    return this._statistics;
  }
  public set statistics(value: any) {
    this._statistics = value;
  }
  async onModuleInit() {
    await this.$connect();
  }
}
