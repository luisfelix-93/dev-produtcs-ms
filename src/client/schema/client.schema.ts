import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Client{
    
    @Prop()
    client_name: string;
    @Prop()
    email: string;
    @Prop()
    clientType: string;
    @Prop()
    zipCode: string;
}