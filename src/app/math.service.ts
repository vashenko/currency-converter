import { Injectable } from '@angular/core';

@Injectable()
export class MathService {

  constructor() { }

  getMillionth(value) {
    return Math.floor(value / 1000000);
  }

  getOneHundredThousandth(value, millionth) {
    return value - millionth * 1000000;
  }

  getTenth(value) {
    return Math.floor((value / 100) * 10) * 10;
  }

  getHundredth(value) {
    return Math.floor((value / 1000) * 10);
  }

  getThousandth(value) {
    return Math.floor(value / 1000);
  }

  getBillionth(value) {
    return Math.floor(value / 1000000000);
  }
}
