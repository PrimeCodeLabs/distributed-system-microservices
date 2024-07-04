import amqp from "amqplib/callback_api";
import { info, error } from "./loggingLib";
import express from "express";

const app = express();
const port = 5003;

app.use(express.json());

const processPayment = (msg: any) => {
  const { amount } = JSON.parse(msg.content.toString());
  if (amount && amount > 0) {
    info("Payment processed successfully", { amount });
    // Process payment...
  } else {
    error("Payment processing failed", { amount });
  }
};

amqp.connect("amqp://rabbitmq", (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    const queue = "payment_queue";
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        processPayment(msg);
        channel.ack(msg);
      }
    });
  });
});

app.listen(port, () => {
  info(`Payment service listening at http://localhost:${port}`);
});
