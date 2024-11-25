/**
 * https://www.patterns.dev/vanilla/observer-pattern/
 */
export type Observer<T> = (details: T) => void;

export class Observable<T> {
  private observers: Observer<T>[];

  public constructor() {
    this.observers = [];
  }

  public subscribe(observer: Observer<T>) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer<T>) {
    this.observers = this.observers.filter((v) => v !== observer);
  }

  public notify(details: T) {
    this.observers.forEach((observer) => observer(details));
  }
}
