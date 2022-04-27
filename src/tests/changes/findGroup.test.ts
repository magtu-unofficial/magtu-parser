import loadTestFile from "../loadTestFile";
import findGroup from "../../changes/findGroup";

test("Нормальный файл", () => {
  expect(findGroup(loadTestFile("changes/normal.xls"), 2).slice(0, 10)).toEqual(
    [
      { name: ["а-17-1"], displayName: "А-17-1", x: 4 },
      { name: ["а-17-2"], displayName: "А-17-2", x: 5 },
      { name: ["атп-18-1"], displayName: "АТп-18-1", x: 6 },
      { name: ["атпк-18-1"], displayName: "АТпК-18-1", x: 7 },
      { name: ["дак-17-1", "дак-18-5"], displayName: "ДаК-17-1", x: 8 },
      { name: ["дак-18-1"], displayName: "ДаК-18-1", x: 9 },
      { name: ["зик-17-1"], displayName: "ЗиК-17-1", x: 10 },
      { name: ["зик-18-1"], displayName: "ЗиК-18-1", x: 11 },
      { name: ["зик-18-5"], displayName: "ЗиК-18-5", x: 12 },
      { name: ["зио-17-1"], displayName: "ЗиО-17-1", x: 16 }
    ]
  );
});

test("С первой строки", () => {
  expect(
    findGroup(loadTestFile("changes/firstrow.xlsx"), 1).slice(0, 14)
  ).toEqual([
    { name: ["а-15-1"], displayName: "А-15-1", x: 4 },
    { name: ["а-15-2"], displayName: "А-15-2", x: 5 },
    { name: ["а-17-1"], displayName: "А-17-1", x: 6 },
    { name: ["а-17-2"], displayName: "А-17-2", x: 7 },
    { name: ["атп-18-1"], displayName: "АТп-18-1", x: 8 },
    { name: ["атпк-18-1"], displayName: "АТпК-18-1", x: 9 },
    { name: ["дак-16-1", "дак-17-5"], displayName: "ДаК-16-1", x: 10 },
    { name: ["дак-17-1", "дак-18-5"], displayName: "ДаК-17-1", x: 11 },
    { name: ["дак-18-1"], displayName: "ДаК-18-1", x: 12 },
    { name: ["зик-16-1"], displayName: "ЗиК-16-1", x: 13 },
    { name: ["зик-17-1"], displayName: "ЗиК-17-1", x: 14 },
    { name: ["зик-18-1"], displayName: "ЗиК-18-1", x: 18 },
    { name: ["зик-18-5"], displayName: "ЗиК-18-5", x: 19 },
    { name: ["зио-17-1"], displayName: "ЗиО-17-1", x: 20 }
  ]);
});

test("Неверный файл", () => {
  expect(() => {
    findGroup(loadTestFile("changes/wrong.xlsx"), 2);
  }).toThrow();
});
