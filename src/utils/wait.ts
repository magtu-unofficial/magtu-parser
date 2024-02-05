export default class Wait {
  constructor(step = 3, timeOffset = 200) {
    this.step = step;
    this.timeOffset = timeOffset;
  }

  add(promise: () => Promise<any>) {
    this.promises.push(promise);
  }

  wait(): Promise<any> {
    const { promises, results, step, timeOffset } = this;
    const { length } = promises;
    let counter = 0;

    return new Promise(res => {
      const loop = (it: number) => {
        setTimeout(async () => {
          let i = it;

          const start = i + 1 - step > 0 ? i + 1 - step : 0;
          const end = i + 1 <= length ? i + 1 : length;

          try {
            const group = promises.slice(start, end);

            const groupFunc = group.map(async pr => {
              return pr();
            });

            results.push(...(await Promise.all(groupFunc)));
          } catch (error) {
            console.log(error);
          }

          counter += step;

          if (counter >= length) {
            res(results);
          } else {
            i -= step;
            loop(i);
          }
        }, timeOffset);
      };

      loop(length - 1);
    });
  }

  timeOffset: number;
  step: number;
  private promises: { (): Promise<any> }[] = [];
  private results: any[] = [];
}
