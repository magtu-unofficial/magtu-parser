import day, { week } from "./day";

describe("week", () => {
  test("01.01.2019", () => {
    expect(week(new Date(2019, 0, 1))).toBe(1);
  });

  test("29.07.2019", () => {
    expect(week(new Date(2019, 6, 29))).toBe(31);
  });

  test("04.08.2019", () => {
    expect(week(new Date(2019, 7, 4))).toBe(31);
  });
});

describe("day", () => {
  describe("Неетная неделя", () => {
    for (let i = 0; i < 6; i += 1) {
      test(`День ${i}`, () => {
        expect(day(new Date(2019, 7, i + 12))).toBe(i);
      });
    }
  });

  describe("Четная неделя", () => {
    for (let i = 0; i < 6; i += 1) {
      test(`День ${i}`, () => {
        expect(day(new Date(2019, 7, i + 19))).toBe(i + 6);
      });
    }
  });
});
