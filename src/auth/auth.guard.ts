import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService : JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
    
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if(!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];

        try{
            const decodedToken = this.jwtService.verify(token);
            const userId = decodedToken.sub;

            await this.cacheManager.set(`token:${userId}`, token, 3600);
            return true;


        } catch(error) {
            console.log('Error trying to authorizate the requisition', error)
        }
    }

}