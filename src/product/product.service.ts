import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { CreateProduct } from './DTO/createProduct.dto';

import { ClientService } from 'src/client/client.service';
import { UpdateProductDTO } from './DTO/updateProduct.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel : Model<ProductDocument>,
        private readonly clientService: ClientService
    ){}

    async findProduct() : Promise<Product[]> {
        return await this.productModel.find().exec();
    }
    async findProductByID(idProduct : string) : Promise<Product|null> {
        return await this.productModel.findById(idProduct).exec();
    }

    async register(productDTO: CreateProduct, sessionId: string): Promise<Product> {
        
        const client_id = productDTO.client_id;
        const client = await this.clientService.getClientById(client_id, sessionId);
        if(!client) {
            return null;
        }
        if(client.clientType !== 'store') {
            return null;
        } 
        const dateCreated =  Date.now();
        console.log(client);
        const newProduct = new this.productModel({
            title: productDTO.title,
            price: productDTO.price,
            thumbnailHd: productDTO.thumbnail,
            date: dateCreated,
            seller: client 
        })

        return await newProduct.save();

    }

    async findProductListByIdClient(client_id: string, sessionId: string):Promise<Product[]>{
        const client = await this.clientService.getClientById(client_id, sessionId);
        if(!client) {
            return null;
        }

        return await this.productModel.find({seller: client}).exec();
    }
    async updateProduct(productId: string, productDTO: UpdateProductDTO): Promise<Product|null> {
        return await this.productModel.findByIdAndUpdate(productId, productDTO, {new: true}).exec();
    }

    async deleteProduct(productId: string): Promise<Product|null> {
        return await this.productModel.findByIdAndDelete(productId);
    }

    

}
