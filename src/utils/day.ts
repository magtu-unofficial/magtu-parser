export const week = (d: Date) => {
  // Copy-paste lol
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

/*
Нечетня недея
0 - пн  3 - чт
1 - вт  4 - пт
2 - ср  5 - сб
Четная неделя
6 - пн  9 - чт
7 - вт 10 - пт
8 - ср 11 - сб
*/

export default (date: Date): number => {
  return date.getDay() - 1 + (week(date) % 2 ? 0 : 1 * 6);
};
