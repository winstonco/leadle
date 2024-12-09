/**
 * https://www.patterns.dev/vanilla/observer-pattern/
 */
export type Observer<T = any> = (details?: T) => void;

export class Observable<T = any> {
  protected observers: Observer<T>[];

  public constructor() {
    this.observers = [];
  }

  public subscribe(observer: Observer<T>) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer<T>) {
    this.observers = this.observers.filter((v) => v !== observer);
  }

  public notify(details?: T) {
    this.observers.forEach((observer) => observer(details!));
  }
}

// export class ObservableValue<T = any> extends Observable<T> {
//   private _value: T;

//   public constructor(value: T) {
//     super();
//     this._value = value;
//   }

//   public get value() {
//     return this._value;
//   }

//   public set value(newValue: T) {
//     this._value = newValue;
//     this.notify(newValue);
//   }

//   /** NOTE: This method will not change the value. Instead, use the value setter or the setNotify method. */
//   public override notify(details?: T) {
//     super.notify(details);
//   }

//   public setAndNotify(newValue: T) {
//     this.value = newValue;
//   }
// }
