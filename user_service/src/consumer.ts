import amqp, { Message } from "amqplib/callback_api";
import { info, error } from "./loggingLib";
import express from "express";

const app = express();
const port = 5001;

app.use(express.json());

const createUser = (msg: Message) => {
  const { user_id } = JSON.parse(msg.content.toString());
  if (user_id) {
    info("User validated successfully", { user_id });
    // Process user validation...
  } else {
    error("User validation failed", { user_id });
  }
};

const connectToRabbitMQ = () => {
  amqp.connect("amqp://rabbitmq", (err, connection) => {
    if (err) {
      error("RabbitMQ connection failed. Retrying in 5 seconds...", {
        error: err.message,
      });
      setTimeout(connectToRabbitMQ, 5000);
      return;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      const queue = "user_queue";
      channel.assertQueue(queue, {
        durable: true,
      });
      channel.consume(queue, (msg) => {
        if (msg !== null) {
          createUser(msg);
          channel.ack(msg);
        }
      });
    });
  });
};

connectToRabbitMQ();

app.listen(port, () => {
  info(`User service listening at http://localhost:${port}`);
});
