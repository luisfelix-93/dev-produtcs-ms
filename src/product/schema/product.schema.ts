import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Client } from "src/client/schema/client.schema";

export type ProductDocument = Product & Document;
@Schema()
export class Product {
    @Prop({required: true})
    title: string;
    @Prop({required: true})
    price: number;
    @Prop({required: true})
    thumbnailHd: string;  
    @Prop({required: true})
    date: Date;
    @Prop({required: true})
    seller: Client;
}

export const ProductSchema = SchemaFactory.createForClass(Product)