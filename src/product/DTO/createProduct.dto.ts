import { IsNumber, IsString } from "class-validator";

export class CreateProduct {
    @IsString()
    readonly title: string;

    @IsNumber()
    price: number

    @IsString()
    thumbnail: string

    @IsString()
    client_id : string
}