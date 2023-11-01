import "reflect-metadata"
import express from "express";
import securedRouter from "./routes/secured";
import responceMiddleware from "./middlewares/responseMiddleware";
import { log } from "./utils/logger";


const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(responceMiddleware);

const router = express.Router();
router.use("/secured", securedRouter);
app.use(router);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    log.info(`OPTIONS request: ${req.method}`);
    res.sendStatus(200);
  } else {
    next();
  }
});

app.listen(PORT, () => {
  log.debug(`Server running on ${PORT}`);
});