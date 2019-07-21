import loadTestFile from "../loadTestFile";
import findDate from "./findDate";

test("Нормальный файл", () => {
  expect(findDate(loadTestFile("changes/normal.xls"))).toEqual({
    0: {
      date: new Date(2019, 3, 8),
      pairs: 6,
      y: 3
    },
    1: {
      date: new Date(2019, 3, 9),
      pairs: 6,
      y: 10
    },
    2: {
      date: new Date(2019, 3, 10),
      pairs: 6,
      y: 17
    }
  });
});

test("Два дня", () => {
  expect(findDate(loadTestFile("changes/twodays.xls"))).toEqual({
    0: {
      date: new Date(2019, 3, 8),
      pairs: 6,
      y: 3
    },
    1: {
      date: new Date(2019, 3, 9),
      pairs: 6,
      y: 10
    }
  });
});

test("С первой строки", () => {
  expect(findDate(loadTestFile("changes/firstrow.xlsx"))).toEqual({
    0: {
      date: new Date(2019, 1, 25),
      pairs: 6,
      y: 2
    },
    1: {
      date: new Date(2019, 1, 26),
      pairs: 6,
      y: 9
    },
    2: {
      date: new Date(2019, 1, 27),
      pairs: 6,
      y: 16
    }
  });
});

test("Неверный файл", () => {
  expect(() => {
    findDate(loadTestFile("changes/wrong.xlsx"));
  }).toThrow();
});
