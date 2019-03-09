import period from "./period";

test("Периоод 27.02.2019", () => {
  expect(period(new Date(2019, 1, 27))).toBe(1);
});

test("Периоод 28.02.2019", () => {
  expect(period(new Date(2019, 1, 28))).toBe(2);
});

test("Периоод 20.02.2019", () => {
  expect(period(new Date(2019, 1, 20))).toBe(3);
});

test("Периоод 21.02.2019", () => {
  expect(period(new Date(2019, 1, 21))).toBe(4);
});

test("Периоод 25.02.2019", () => {
  expect(period(new Date(2019, 1, 25))).toBe(1);
});

test("Периоод 02.03.2019", () => {
  expect(period(new Date(2019, 2, 2))).toBe(2);
});

test("Периоод 18.02.2019", () => {
  expect(period(new Date(2019, 1, 18))).toBe(3);
});

test("Периоод 23.02.2019", () => {
  expect(period(new Date(2019, 1, 23))).toBe(4);
});
