import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import log from "./log";
import IConfig from "../interfaces/config";

dotenv.config();

export const mongoUri = process.env.MONGO_URI;
export const bot = process.env.BOT;

const configPath = path.resolve(process.argv[2] || "urls.json");
log.info(`Конфиг: ${configPath}`);

let urls: IConfig;

try {
  urls = JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));
} catch (error) {
  log.error(`Ошибка парсинга конфига ${error.message}`);

  process.exit(-1);
}

export { urls };
