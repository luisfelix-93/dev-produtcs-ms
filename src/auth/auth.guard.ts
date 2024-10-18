import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        // Verificar se o header de autorização está presente
        if (!authHeader) {
            return false;
        }

        // Extrair o token do cabeçalho Authorization
        const token = authHeader.split(' ')[1];

        try {
            // Verificar o token usando o JwtService
            const decodedToken = this.jwtService.verify(token);
            const clientId = decodedToken.clientId;

            // Armazenar o token no cache, com TTL de 1 hora (3600 segundos)
            await this.cacheManager.set(`token:${clientId}`, token, 3600 * 1000);
            console.log(`Token stored in cache for userId: ${clientId}: ${token}`);

            // Se o token for válido, retornar true (permissão concedida)
            return true;

        } catch (error) {
            console.log('Error trying to authorize the requisition', error);

            // Retornar false em caso de erro
            return false;
        }
    }
}
