import { Inject, Injectable } from '@nestjs/common';
import { Client } from './schema/client.schema';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ClientService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    async getClientById(client_id : string):Promise<Client> {

        const token = await this.cacheManager.get(`token:${client_id}`);

        if(!token) {
            console.log('token not found!')
            return null
        }

        const config = {
            method: 'GET',
            url: `${process.env.CLIENT_URL}/${client_id}`,
            headers: { Authorization: `Bearer ${token}`},
            timeOut: 10000
        };

        try {

            const client = new Client();
            const response = await axios.request(config);
            client.client_name = response.data.clientName;
            client.zipCode = response.data.zipCode;
            console.log(client)
            return client;

        } catch(error){
            console.log(error);
            throw new Error(`Error fetching client: ${error.message}`)
        }
    }
}
