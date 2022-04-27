import { findTimtableFile } from "../../timetable/loadTimetables";
import { Efrom } from "../../interfaces/config";
import { File } from "../../utils/files";

const testData = {
  "Испк-18-1": [
    new File("ИСпК-18-1 с 01.02.19.xls", "test", Efrom.local),
    new File("ИСпК-18-1 изм с 01.03.19.xls", "test", Efrom.local),
    new File("ИСпК-18-1.xls", "test", Efrom.local)
  ],
  "испк-18-2": [new File("ИСпК-18-2.xls", "test", Efrom.local)]
};

const testData2 = {
  "Испк-18-1": [
    new File("ИСпК-18-1 с 01.02.19.xls", "test", Efrom.local),
    new File("ИСпК-18-1 изм.xls", "test", Efrom.local),
    new File("ИСпК-18-1.xls", "test", Efrom.local)
  ],
  "испк-18-2": [new File("ИСпК-18-2.xls", "test", Efrom.local)]
};

test("Последний файл замен", () => {
  expect(findTimtableFile(testData, new Date(2019, 5, 15))).toEqual({
    "испк-18-1": new File("ИСпК-18-1 изм с 01.03.19.xls", "test", Efrom.local),
    "испк-18-2": new File("ИСпК-18-2.xls", "test", Efrom.local)
  });
});

test("Средниый файл замен", () => {
  expect(findTimtableFile(testData, new Date(2019, 1, 15))).toEqual({
    "испк-18-1": new File("ИСпК-18-1 с 01.02.19.xls", "test", Efrom.local),
    "испк-18-2": new File("ИСпК-18-2.xls", "test", Efrom.local)
  });
});

test("Первый файл замен", () => {
  expect(findTimtableFile(testData, new Date(2019, 0, 15))).toEqual({
    "испк-18-1": new File("ИСпК-18-1.xls", "test", Efrom.local),
    "испк-18-2": new File("ИСпК-18-2.xls", "test", Efrom.local)
  });
});

test("Файл расписания без даты", () => {
  expect(findTimtableFile(testData2, new Date(2019, 0, 15))).toEqual({
    "испк-18-1": new File("ИСпК-18-1 изм.xls", "test", Efrom.local),
    "испк-18-2": new File("ИСпК-18-2.xls", "test", Efrom.local)
  });
});
