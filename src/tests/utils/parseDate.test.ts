import parseDate from "../../utils/parseDate";

test("Дата 28.01.19", () => {
  expect(parseDate("28.01.19")).toEqual(new Date(2019, 0, 28));
});

test("Дата 99.99.19", () => {
  expect(() => parseDate("99.99.19")).toThrow();
});

test("Невалидная дата", () => {
  expect(() => parseDate("2f.01.1f")).toThrow();
});
