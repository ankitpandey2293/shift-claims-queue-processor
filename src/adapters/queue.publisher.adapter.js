const amqp = require('amqplib');

const Config = {
    AMQP_URI: process.env.AMQP_URI || 'amqps://jdksxkpr:dH7lvZjqGt-6XEahnupT88S3WzRgzyns@chinook.rmq.cloudamqp.com/jdksxkpr',
    queue: 'Q_claims_inbound'
}

class QueuePublisher {
    constructor(handler) {
        this.conn;
        this.uri = Config.AMQP_URI
        this.channel;
        this.q = Config.queue;;
        this.handler = handler;
    }

    setupConnection = async () => {
        this.conn = await amqp.connect(this.uri);
        this.channel = await this.conn.createChannel();
        await this.channel.assertQueue(this.q, { durable: true });
    }

    close = async () => {
        try {
            if (this.channel) await this.channel.close();
            await this.conn.close();
        } catch (exception) {
            /** Ignore for Closing Connections */
        }
    }

    async receive() {
        this.channel.consume(this.q, async (message) => {
            try {
                const result = JSON.parse(message.content.toString());
                await this.handler(result)
                this.channel.ack(message)
            } catch (exception) {
                console.log(`QueuePublisher:receive:${exception}`)
                this.channel.nack(message)
            }

        })
    }

}

module.exports = QueuePublisher
