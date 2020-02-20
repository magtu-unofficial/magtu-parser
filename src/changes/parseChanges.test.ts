import { splitString } from "./parseChanges";

test("Общая пара", () => {
  expect(splitString("Инф. Техн (ТО)", 2)).toMatchObject([
    { number: 2, subgroup: "common" }
  ]);
});

test("Первая подгруппа", () => {
  expect(splitString("1. Инф. Техн (Пр)", 2)).toMatchObject([
    { number: 2, subgroup: "first" }
  ]);
});

test("Вторая подгруппа", () => {
  expect(splitString("2. Инф. Техн (Пр)", 2)).toMatchObject([
    { number: 2, subgroup: "second" }
  ]);
});

test("Пары для двух подгрупп", () => {
  expect(splitString("1. Ин.Яз 2. Инф. Техн (Пр)", 2)).toMatchObject([
    { number: 2, subgroup: "first" },
    { number: 2, subgroup: "second" }
  ]);
});

test("Общая пара МДК", () => {
  expect(splitString("МДК.11.21 Безе данных", 2)).toMatchObject([
    { number: 2, subgroup: "common" }
  ]);
});

test("Первая подгруппа МДК", () => {
  expect(splitString("1. МДК.11.21 Безе данных", 2)).toMatchObject([
    { number: 2, subgroup: "first" }
  ]);
});

test("Вторая подгруппа МДК", () => {
  expect(splitString("2. МДК.11.21 Безе данных", 2)).toMatchObject([
    { number: 2, subgroup: "second" }
  ]);
});

test("Пары для двух подгрупп МДК", () => {
  expect(
    splitString("1. МДК.11.21 Безе данных 2. МДК.11.21 Безе данных", 2)
  ).toMatchObject([
    { number: 2, subgroup: "first" },
    { number: 2, subgroup: "second" }
  ]);
});
