import cellPos from "../../utils/cellPos";

test("Ячейка A1", () => {
  expect(cellPos(1, 1)).toBe("A1");
});

test("Ячейка Z10", () => {
  expect(cellPos(26, 10)).toBe("Z10");
});

test("Ячейка AA15", () => {
  expect(cellPos(27, 15)).toBe("AA15");
});

test("Ячейка AC10", () => {
  expect(cellPos(29, 10)).toBe("AC10");
});

test("Ячейка ZZ2", () => {
  expect(cellPos(702, 2)).toBe("ZZ2");
});

test("Ячейка BXX2", () => {
  expect(cellPos(2000, 2)).toBe("BXX2");
});
