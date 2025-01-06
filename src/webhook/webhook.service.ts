import { Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class WebhookService {
    private readonly rabbitMQHost: string;
    private readonly rabbitMQQueue: string;

    constructor() {
        this.rabbitMQHost = process.env.RABBITMQ_HOST || 'amqp://localhost:5672';
        this.rabbitMQQueue = 'product';
    }
    /**
     * Receives the name of the newly created product and the seller's email 
     * and sends it to the notification webhook asynchronously
     * @param email 
     * @param productName 
     * @return Promise<void>
     */
    async sendProductNotification(email: string, productName: string): Promise<void> {
        try {
            const connection = await amqplib.connect(this.rabbitMQHost);
            const channel = await connection.createChannel();

            await channel.assertQueue(this.rabbitMQQueue, { durable: true });
            const message = JSON.stringify({ email, productName });
            channel.sendToQueue(this.rabbitMQQueue, Buffer.from(message), { persistent: true });

            console.log(`Sent message to queue ${this.rabbitMQQueue}: ${message}`);

            await channel.close();
            await connection.close();

        } catch (error) {
            console.log('Error sending message to queue', error);
        }
    }
}
