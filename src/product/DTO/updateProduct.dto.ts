import { IsNumber, IsString } from "class-validator";

export class UpdateProductDTO {
    @IsString()
    readonly title: string;

    @IsNumber()
    price: number

    @IsString()
    thumbnail: string
}