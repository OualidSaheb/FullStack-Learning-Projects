const PORT = 3000;

import express from "express";
export const app = express();

import { connect } from "./database/index.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(router);

connect(() => {
  app.listen(PORT, () => {
    console.log(`Serveur NodeJS démarré sur http://localhost:${PORT}`);
  });
});
