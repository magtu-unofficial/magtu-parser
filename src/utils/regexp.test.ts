import { groupG, date } from "./regexp";

test("Группа Испк-18-1", () => {
  expect("Испк-18-1".match(groupG)[0]).toBe("Испк-18-1");
});

test("Группа Испк-18-1/испк-18-5", () => {
  expect("Испк-18-1/испк-18-5".match(groupG)[0]).toBe("Испк-18-1");
  expect("Испк-18-1/испк-18-5".match(groupG)[1]).toBe("испк-18-5");
});

test("Группа Испк-118-1", () => {
  expect("Испк-118-1".match(groupG)).toBe(null);
});

test("Группа 18ИП-М", () => {
  expect("18ИП-М".match(groupG)[0]).toBe("18ИП-М");
});

test("Дата 28.01.19", () => {
  expect("ППи-15-1у с  28.01.19.xlsx".match(date).slice(1, 4)).toEqual([
    "28",
    "01",
    "19"
  ]);
});
