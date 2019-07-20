export default class Wait {
  add(promise: Promise<any>) {
    this.promises.push(promise);
  }

  wait(): Promise<Array<any>> {
    return Promise.all(this.promises);
  }
  promises: Array<Promise<any>> = [];
}
