import Change from "./models/change";
import { urls } from "./utils/config";
import mongoose from "./utils/mongoose";
import { fileList } from "./utils/files";
import log from "./utils/log";
import Wait from "./utils/wait";
import findDate from "./changes/findDate";

(async () => {
  log.info("Парсер запущен");
  // Засекаем время работы
  const startTime = new Date();

  // Получаем список файлов в директорие замен
  const changesDir = await fileList(urls.changes.url);
  // Загружаем .xls или .xlsx файлы
  const changesLoader = new Wait();
  changesDir.forEach(file => {
    if (file.name.search(/.xls/) !== -1) {
      changesLoader.add(file.load());
    }
  });
  const changesList = await changesLoader.wait();
  log.info(
    `В директорие замен колличество файлов: ${changesDir.length}, из них .xls(x): ${changesList.length}`
  );

  // Обрабатываем каждый файл замен
  for (const file of changesList) {
    const fileTime = new Date();
    log.info(`Обработка ${file.name}`);

    // Проверяем, был ли этот файл уже распарсен
    if (await Change.hasFile(file.md5)) {
      log.info("Файл уже был обработан");
      continue;
    }

    try {
      const dates = findDate(file.sheet);
    } catch (error) {
      log.warn(`Похоже, это не замены: ${error.message}`);
      continue;
    }

    await Change.addFile(file, new Date().getTime() - fileTime.getTime());

    log.info(
      `Обработка завершена за ${new Date().getTime() - fileTime.getTime()}ms`
    );
  }

  await mongoose.connection.close();
  log.info(
    `Работа завершена за ${new Date().getTime() - startTime.getTime()}ms`
  );
})();
