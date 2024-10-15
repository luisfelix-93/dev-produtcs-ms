import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateProduct } from './DTO/createProduct.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get(':id')
    async getProductByID(@Param('id') productId: string){
        return await this.productService.findProductByID(productId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async registerProduct(@Body() createProductDTO : CreateProduct){
        return await this.productService.register(createProductDTO);
    }
}
