import addDays from "./addDays";

test("Прибавить 3 дня к 23.02.2019", () => {
  expect(addDays(new Date(2019, 1, 23), 3)).toEqual(new Date(2019, 1, 26));
});

test("Отнять 3 от 23.02.2019", () => {
  expect(addDays(new Date(2019, 1, 23), -3)).toEqual(new Date(2019, 1, 20));
});

test("Прибавить 3 дня к 28.02.2019", () => {
  expect(addDays(new Date(2019, 1, 28), 3)).toEqual(new Date(2019, 2, 3));
});
