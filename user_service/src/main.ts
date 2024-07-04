import express from "express";
import { info, error } from "./loggingLib";

const app = express();
const port = 5001;

app.use(express.json());

app.post("/users", (req, res) => {
  const { username, email } = req.body;
  if (username && email) {
    info("User created successfully", { username, email });
    res.status(201).send({ message: "User created successfully" });
  } else {
    error("User creation failed", { username, email });
    res.status(400).send({ message: "User creation failed" });
  }
});

app.listen(port, () => {
  info(`User service listening at http://localhost:${port}`);
});
