import cors, { CorsOptionsDelegate } from "cors";
import { CORS_WHITE_LIST } from "../helpers/environments";

const corsOptions: CorsOptionsDelegate = (req, cb) => {
  const API = req.headers.origin;

  if (!CORS_WHITE_LIST) {
    console.log("CORS ERROR: No whitelist defined");
    return cb(null, { origin: false });
  }

  try {
    const URLS: string[] = JSON.parse(CORS_WHITE_LIST);

    if (!API) {
      return cb(null, { origin: true, credentials: true });
    }

    const isExists = URLS.some(
      (url) => url.replace(/\/$/, "") === API.replace(/\/$/, ""),
    );

    if (isExists) {
      return cb(null, {
        origin: true,
        credentials: true,
      });
    }

    console.log(`the api:${API} is an unauthorized API`, 403, "CORS ERROR");
    return cb(null, { origin: false, credentials: false });
  } catch (err) {
    console.error("CORS JSON Parse Error", err);
    return cb(null, { origin: false });
  }
};

export default cors(corsOptions);
