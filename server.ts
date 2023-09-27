import express from "express";
import router from "./routes/chatRoute";

const PORT = process.env.PORT ?? 5000;
const app = express();

app.use(express.json());
app.use(router);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
