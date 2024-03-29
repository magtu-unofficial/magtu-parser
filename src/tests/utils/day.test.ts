import day, { week } from "../../utils/day";

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
    test("02.09.2019", () => {
      expect(day(new Date(2019, 8, 2), true)).toBe(0);
    });

    test("03.09.2019", () => {
      expect(day(new Date(2019, 8, 3), true)).toBe(1);
    });

    test("05.09.2019", () => {
      expect(day(new Date(2019, 8, 5), true)).toBe(3);
    });
  });

  describe("Четная неделя", () => {
    test("09.09.2019", () => {
      expect(day(new Date(2019, 8, 9), true)).toBe(6);
    });

    test("10.09.2019", () => {
      expect(day(new Date(2019, 8, 10), true)).toBe(7);
    });

    test("12.09.2019", () => {
      expect(day(new Date(2019, 8, 12), true)).toBe(9);
    });
  });
});
