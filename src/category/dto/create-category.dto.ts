import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @ApiProperty()
    categoriesGroup_id: number
    @IsNotEmpty()
    @ApiProperty()
    name: string
}
