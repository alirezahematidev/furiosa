import { observable, batch as legendBatch } from '@legendapp/state';

function asObservable<T>(data: T) {
  return observable(data);
}

function batch<C extends () => void>(callback: C) {
  legendBatch(callback);
}

export { batch, asObservable };
