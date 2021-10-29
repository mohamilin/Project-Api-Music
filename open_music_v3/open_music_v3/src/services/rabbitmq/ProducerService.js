const amqp = require('amqplib')

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connecttion = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connecttion.createChannel()
    await channel.assertQueue(queue, {
      durable: true,
    })

    await channel.sendToQueue(queue, Buffer.from(message))

    setTimeout(() => {
      connecttion.close()
    }, 1000)
  },
}

module.exports = ProducerService
