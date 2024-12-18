import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateProduct } from './DTO/createProduct.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller('products')
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

    @Get('productByClient/:client_id')
    @UseGuards(JwtAuthGuard)
    async getProductListByClient(@Param('client_id') client_id: string, @Req() request: any) {
        const sessionId = request.sessionId;
        return await this.productService.findProductListByIdClient(client_id, sessionId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async registerProduct(@Body() createProductDTO : CreateProduct, @Req() request: any){
        const sessionId = request.sessionId;
        return await this.productService.register(createProductDTO, sessionId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Param('id') productId:string) {
        return await this.productService.deleteProduct(productId);
    }

    /**
     * Executa mensagens da fila RabbitMQ com identificador 'find-product-by-id'.
     * @Param {Payload} data - Dados enviados na mensagelm (productId)
     */

    @MessagePattern('find-product-by-id')
    async findProductById(@Payload() data:{productId: string}) {
        const { productId } = data;
        console.log(`Recebendo requisição para buscar produto: ${productId}`);

        try {
            // Chama o serviço que busca o produto pelo ID no banco de dados
            const product = await this.productService.findProductByID(productId);

            if (!product) {
            return { error: 'Produto não encontrado.' };
            }

            console.log('Produto encontrado:', product);
            return product; // Retorna o produto encontrado
        } catch(error) {
            console.error('Erro ao buscar produto', error.message);
            return { error: `Erro ao buscar produto: ${error.message}` }
        }
    }
}
