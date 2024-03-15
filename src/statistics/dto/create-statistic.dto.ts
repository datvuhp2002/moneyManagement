import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateStatisticDto {
    @ApiProperty()
    @IsOptional()
    expense: number
    @ApiProperty()
    @IsOptional()
    revenue: number
    @ApiProperty()
    @IsNotEmpty()
    day :number
    @ApiProperty()
    @IsNotEmpty()
    month :number
    @ApiProperty()
    @IsNotEmpty()
    year :number
    @IsNotEmpty()
    wallet_id:number
}

