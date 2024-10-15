import { Inject, Injectable } from '@nestjs/common';
import { Client } from './schema/client.schema';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ClientService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    async getClientById(client_id : string) {

        const token = await this.cacheManager.get<string>(`token:${client_id}`);

        if(!token) {
            throw new Error('Token not found!')
        }

        const config = {
            method: 'GET',
            url: `http://localhost:5050/client/${client_id}`,
            headers: { Authorization: `Bearer ${token}`},
            timeOut: 10000
        };

        try {

            const client = new Client();
            const response = await axios.request(config);

            client.cliet_name = response.data.clientName;
            client.zipCode = response.data.zipCode;

        } catch(error){
            console.log(error);
            throw new Error(`Error fetching client: ${error.message}`)
        }
    }
}
