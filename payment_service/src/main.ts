import express from "express";
import { info, error } from "./loggingLib";

const app = express();
const port = 5003;

app.use(express.json());

app.post("/payments", (req, res) => {
  const { amount } = req.body;
  if (amount && amount > 0) {
    info("Payment processed successfully", { amount });
    res.status(200).send({ message: "Payment processed successfully" });
  } else {
    error("Payment processing failed", { amount });
    res.status(400).send({ message: "Payment processing failed" });
  }
});

app.listen(port, () => {
  info(`Payment service listening at http://localhost:${port}`);
});
