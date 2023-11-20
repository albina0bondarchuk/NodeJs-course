import express from "express";
import { expressjwt as jwt } from "express-jwt";
import helmet from "helmet";

import { log } from "./utils/logger";
import { AppDataSource } from "./ormconfig";

import responceMiddleware from "./middlewares/responseMiddleware";
import securedRouter from "./routes/secured";
import publicRouter from "./routes/public";
import { authMiddleware } from "./middlewares/authMiddleware";

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(helmet());
    app.use(responceMiddleware);
    app.use(
      "/secured",
      jwt({
        secret: process.env.JWT_SECRET_KEY ?? "my-secret-key",
        algorithms: ["HS256"],
      }),
    );

    app.use(function (err, req, res, next) {
      if (err.name === "UnauthorizedError") {
        res.forbidden({ message: err.inner.message });
      } else {
        next(err);
      }
    });

    const router = express.Router();

    router.use("/secured", securedRouter);
    router.use("/public", publicRouter);
    app.use(router);

    app.listen(PORT, () => {
      log.debug(`Server running on ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
