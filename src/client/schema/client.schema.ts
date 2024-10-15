import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Client{
    @Prop()
    cliet_name: string;
    @Prop()
    zipCode: string;
}