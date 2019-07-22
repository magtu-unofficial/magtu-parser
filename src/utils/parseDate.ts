import { date } from "./regexp";

export default (str: string): Date => {
  const numbers = str
    .match(date)
    .splice(1, 4)
    .map((val: string) => {
      if (isNaN(parseInt(val, 10))) {
        throw Error("В дате не цифры. Я не знаю как");
      }
      return parseInt(val, 10);
    });

  if (numbers[1] > 12) throw Error("Месяц больше чем 12");
  if (numbers[2] >= 31) throw Error("Месяц больше чем 31");
  return new Date(2000 + numbers[2], numbers[1] - 1, numbers[0]);
};
