import express from "express";
import path from "path";
import cors from "./middlewares/cors";
import router from "./middlewares/router";
import handleError from "./middlewares/handleServerError";
import { PORT } from "./helpers/environments";
import { init as initDb } from "./db";

const app = express();

app.use((req, res, next) => {
  console.log("url: ", req.url);
  console.log("route: ", req.route);
  console.log("query: ", req.query);
  console.log("method: ", req.method);
  next();
});
app.use(cors);
app.use(express.json());
app.use(
  "/images",
  express.static(path.resolve(process.cwd(), "public/images")),
);
app.use(router);
app.use(handleError);

initDb()
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)),
  )
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
