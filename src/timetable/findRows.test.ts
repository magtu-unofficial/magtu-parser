import loadTestFile from "../loadTestFile";
import findRows from "./findRows";

test("Нормальное расписание", () => {
  expect(findRows(loadTestFile("timetable/1.xlsx"))).toEqual({
    1: 7,
    2: 18,
    3: 29,
    4: 40
  });

  expect(findRows(loadTestFile("timetable/2.xlsx"))).toEqual({
    1: 7,
    2: 16,
    3: 26,
    4: 35
  });

  expect(findRows(loadTestFile("timetable/3.xlsx"))).toEqual({
    1: 7,
    2: 16,
    3: 28,
    4: 39
  });
});

test("Ячейка не существует", () => {
  expect(() => findRows(loadTestFile("timetable/wrong.xlsx"))).toThrow();
});
