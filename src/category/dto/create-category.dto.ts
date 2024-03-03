import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    categoriesGroup_id: number
    @IsNotEmpty()
    name: string
}
