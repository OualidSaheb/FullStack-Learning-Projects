import "./environment/index.js";

const PORT = process.env.PORT ?? 3000;


import express from "express";
const app = express();
import cors from "cors";

import * as db from "./database/index.js";
import path from "path";
import router from "./routes/index.js";
import { logger, log, errors } from "./middlewares/logger.middleware.js";
import { swaggerUi, swaggerDocument, swaggerOptions} from "./routes/openapi.js";
import { i18n, i18nConfig } from "./middlewares/i18n.middleware.js";
import "./ecosystem.config.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

i18nConfig(app);

app.use(router);
app.use(log);
app.use(errors);



db.connect((database) => {
  app.listen(PORT, () => {
    logger.info(i18n.__("SERVER_STARTED", { PORT }));
  });
});
