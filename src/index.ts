import fetch from "node-fetch";

import Change from "./models/change";
import Timetable from "./models/timetable";
import { urls, bot } from "./utils/config";
import mongoose from "./utils/mongoose";
import { fileList } from "./utils/files";
import log from "./utils/log";
import Wait from "./utils/wait";
import day from "./utils/day";
import findDate from "./changes/findDate";
import findGroup from "./changes/findGroup";
import parseChanges from "./changes/parseChanges";
import loadTimetables from "./timetable/loadTimetables";
import findRows from "./timetable/findRows";
import parseTimetable from "./timetable/parseTimetable";

(async () => {
  try {
    log.info("Парсер запущен");
    const startTime = new Date();

    const changesDir = await fileList(urls.changes.url);
    const changesLoader = new Wait();
    changesDir.forEach(file => {
      if (file.name.search(/.xls/) !== -1) {
        changesLoader.add(() => file.load());
      }
    });
    const changesList = await changesLoader.wait();
    log.info(
      `В директории замен колличество файлов: ${changesDir.length}, из них .xls(x): ${changesList.length}`
    );

    let isNewTimetableApplied = false;
    for (const file of changesList) {
      const fileTime = new Date();
      log.info(`Обработка ${file.name}`);

      if (await Change.hasFile(file.md5)) {
        log.info("Файл уже был обработан");
        continue;
      }

      try {
        const dates = findDate(file.sheet);
        const groups = findGroup(file.sheet, dates[0].y - 1);
        const timetablesList = await loadTimetables(dates[0].date);

        const timetableLoader = new Wait();

        for (const group of groups) {
          if (timetablesList[group.name[0]]) {
            group.file = timetablesList[group.name[0]];
            timetableLoader.add(() => timetablesList[group.name[0]].load());
          } else {
            log.warn(`Не найдено расписание для группы ${group.displayName}`);
          }
        }

        await timetableLoader.wait();

        const groupNames: Array<string> = [];

        for (const group of groups) {
          if (group.file) {
            group.name.forEach(name => {
              if (groupNames.findIndex(v => v === name) !== -1) {
                group.name.pop();
              }
            });

            groupNames.push(...group.name);

            let rows: { [index: number]: number } = {};
            try {
              rows = findRows(group.file.sheet);
            } catch (error) {
              log.error(error.message);
            }
            for (const date of dates) {
              const timetable = new Timetable({
                group: group.name,
                displayName: group.displayName,
                date: date.date
              });

              try {
                timetable.addTimetable(
                  parseTimetable(day(date.date), rows, group.file.sheet)
                );
              } catch (error) {
                const msg = `Ошибка обработки расписания ${group.file.name}: ${error.message}`;
                log.error(msg);
                timetable.addError(msg);
              }

              try {
                timetable.addChanges(parseChanges(group, date, file.sheet));
              } catch (error) {
                const msg = `Ошибка обработки замен ${file.name}: ${error.message}`;
                log.error(msg);
                timetable.addError(msg);
              }

              const dup = await Timetable.findOne({
                group: group.name,
                displayName: group.displayName,
                date: date.date
              });
              if (dup) {
                await dup.remove();
              }
              await timetable.save();
            }
          }
        }
        isNewTimetableApplied = true;
      } catch (error) {
        log.warn(`Похоже, ${file.name} не замены: ${error.message}`);
        continue;
      }

      await Change.addFile(file, new Date().getTime() - fileTime.getTime());

      log.info(
        `Обработка завершена за ${new Date().getTime() - fileTime.getTime()}ms`
      );
    }

    if (isNewTimetableApplied) {
      try {
        const res = await fetch(bot);
        log.info(await res.text());
      } catch (error) {
        log.warn(`Не удалось оповестить бота ${error.message}`);
      }
    }

    await mongoose.connection.close();
    log.info(
      `Работа завершена за ${new Date().getTime() - startTime.getTime()}ms`
    );
  } catch (error) {
    log.error(error);
  }
})();
