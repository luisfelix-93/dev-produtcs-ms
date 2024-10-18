import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateProduct } from './DTO/createProduct.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProducts() {
        return this.productService.findProduct();
    }

    @Get(':productId')
    @UseGuards(JwtAuthGuard)
    async getProductByID(@Param('productId') productId: string) {
        return await this.productService.findProductByID(productId);
    }

    @Get(':client_id')
    @UseGuards(JwtAuthGuard)
    async getProductListByClient(@Param('client_id') client_id: string) {
        return await this.getProductListByClient(client_id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async registerProduct(@Body() createProductDTO : CreateProduct){
        return await this.productService.register(createProductDTO);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Param('id') productId:string) {
        return await this.productService.deleteProduct(productId);
    }
}
