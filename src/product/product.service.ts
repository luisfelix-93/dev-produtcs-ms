import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { CreateProduct } from './DTO/createProduct.dto';

import { ClientService } from 'src/client/client.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel : Model<ProductDocument>,
        private readonly clientService: ClientService
    ){}

    async findProductByID(idProduct : string) : Promise<Product|null> {
        return await this.productModel.findById(idProduct).exec();
    }

    async register(productDTO: CreateProduct): Promise<Product> {
        
        const client_id = productDTO.client_id;
        const client = this.clientService.getClientById(client_id);

        const dateCreated =  Date.now();

        const newProduct = new this.productModel({
            title: productDTO.title,
            price: productDTO.price,
            thumbnailHd: productDTO.thumbnail,
            date: dateCreated,
            seller: client
        })

        return await newProduct.save();

    }

}
