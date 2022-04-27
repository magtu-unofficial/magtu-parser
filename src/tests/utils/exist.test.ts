import loadTestFile from "../loadTestFile";
import exist from "../../utils/exist";

test("Ячейка существует", () => {
  expect(exist(loadTestFile("timetable/1.xlsx"), 1, 7)).toBe(true);
});

test("Ячейка не существует", () => {
  expect(exist(loadTestFile("timetable/1.xlsx"), 1, 4)).toBe(false);
});
