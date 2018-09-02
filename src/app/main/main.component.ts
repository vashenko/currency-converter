import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {GetDataService} from '../get-data.service';
import {MathService} from '../math.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  map: Object;
  calculatedValue: string;
  err: string;
  currentLanguage: string;

  constructor(private translate: TranslateService,
              private getData: GetDataService,
              private math: MathService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.getData.getEnMap()
      .subscribe(res => {
        this.map = res;
      });
  }

  switchLanguage(language: string) {
    if (language === 'en') {
      this.getData.getEnMap()
        .subscribe(res => {
          this.map = res;
          this.currentLanguage = language;
        });
    } else {
      this.getData.getUkrMap()
        .subscribe(res => {
          this.map = res;
          this.currentLanguage = language;
        });
    }
  }

  ifMoreThenTen() {
    this.err = 'The maximum number of digits is 11';
    setTimeout(() => {
      this.err = ' ';
    }, 2500);
  }

  ifMoreThenTwo() {
    this.err = 'The maximum number of digits after the dot is 2';
    setTimeout(() => {
      this.err = ' ';
    }, 4500);
  }

  compareWithMap(value, map) {
    for(let i in map) {
      if (value == i) return value = map[i];
    }
  }

  checkOnDot(value) {
    return value.includes(this.map['dot']);
  }

  getIntLength(value) {
    const arr = value.split('');
    let len = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== this.map['dot']) {
        len++;
      } else {
        return len;
      }
    }
    return len;
  }

  getValueBeforeDot(value) {
    const sorted = value.split('');
    if (this.checkOnDot(sorted)) {
      sorted.splice(sorted.indexOf(this.map['dot']));
      return sorted.join('');
    } else {
      return sorted.join('');
    }
  }

  getValueAfterDot(value) {
    const sorted = value.split('');
    if (this.checkOnDot(sorted)) {
      const afterDot = sorted.splice(sorted.indexOf(this.map['dot']));
      afterDot.splice(afterDot.indexOf(this.map['dot']), 1);
      if (afterDot[0] === '0' && afterDot[1] === '0') return "";
      if (afterDot.length > 2) {
        this.ifMoreThenTwo();
        return '';
      }
      return afterDot.join('');
    } else {
      return '';
    }
  }

  getCents(value) {
    if (!value) return ' ';
    if (value[0] === '0') {
      return this.oneNumberCase(value[1]) + ' ' + this.map['cents'];
    } else if (value.length === 1) {
      return this.oneNumberCase(value * 10) + ' ' + this.map['cents'];
    } else if (value.length === 2) {
      return this.twoNumberCase(value) + ' ' + this.map['cents'];
    }
  }

  oneNumberCase(value) {
    if (!value) return '';
    return this.compareWithMap(value, this.map);
  }

  twoNumberCase(value) {
    if (!value) return '';
    if (value < 10) return this.oneNumberCase(value);
    const tenth = this.math.getTenth(value);
    const mod = value % tenth;
    for(let i in this.map) {
      let sum = tenth + mod;
      if (sum.toString() === i) {
        return this.oneNumberCase(i);
      }
    }
    return this.oneNumberCase(tenth) + ' ' + this.oneNumberCase(mod);
  }

  threeNumberCase(value) {
    if (!value) return '';
    if (value < 100) return this.twoNumberCase(value);
    const hundredth = this.math.getHundredth(value);
    const tenth = value % (hundredth * 100);
    if (this.currentLanguage === 'ukr') {
      return this.oneNumberCase(hundredth * 100) + ' ' + this.twoNumberCase(tenth);
    } else {
      return this.oneNumberCase(hundredth) + ' ' + this.map['hundred'] + ' ' + this.twoNumberCase(tenth);
    }
  }

  fourNumberCase(value) {
    if (!value) return '';
    const thousandth = this.math.getThousandth(value);
    const hundredth = value - (thousandth * 1000);
    return this.oneNumberCase(thousandth) + ' ' + this.map['thousand'] + ' ' + this.threeNumberCase(hundredth);
  }

  fiveNumberCase(value) {
    if (!value) return '';
    const tenThousandth = Math.floor(value / 1000);
    const hundredth = value - (tenThousandth * 1000);
    return this.twoNumberCase(tenThousandth) + ' ' + this.map['thousand'] + ' ' + this.threeNumberCase(hundredth);
  }

  sixNumberCase(value) {
    if (!value) return '';
    const hundredThousandth = Math.floor(value / 100000);
    const hundredth = value - (hundredThousandth * 100000);
    if (this.currentLanguage === 'ukr') {
      return this.oneNumberCase(hundredThousandth * 100) + ' ' + this.fiveNumberCase(hundredth);
    } else {
      return this.oneNumberCase(hundredThousandth) + ' ' + this.map['hundred'] + ' ' + this.fiveNumberCase(hundredth);
    }
  }

  sevenNumberCase(value) {
    if (!value) return '';
    const millionth = this.math.getMillionth(value);
    const oneHundredThousandth = this.math.getOneHundredThousandth(value, millionth);
    return this.oneNumberCase(millionth) + ' ' + this.map['million'] + ' ' + this.sixNumberCase(oneHundredThousandth);
  }

  eightNumberCase(value) {
    if (!value) return '';
    const millionth = this.math.getMillionth(value);
    const oneHundredThousandth = this.math.getOneHundredThousandth(value, millionth);
    return this.twoNumberCase(millionth) + ' ' + this.map['million'] + ' ' + this.sixNumberCase(oneHundredThousandth);
  }

  nineNumberCase(value) {
    if (!value) return '';
    const millionth = this.math.getMillionth(value);
    const oneHundredThousandth = this.math.getOneHundredThousandth(value, millionth);
    return this.threeNumberCase(millionth) + ' ' + this.map['million'] + ' ' + this.sixNumberCase(oneHundredThousandth);
  }

  tenNumberCase(value) {
    if (!value) return '';
    const billionth = this.math.getBillionth(value);
    const millionth = value - (billionth * 1000000000);
    return this.oneNumberCase(billionth) + ' ' + this.map['billion'] + ' ' + this.nineNumberCase(millionth);
  }

  calculateValue(number) {
    const valueBeforeDot = this.getValueBeforeDot(number.value);
    const valueAfterDot = this.getValueAfterDot(number.value);

    if (this.getIntLength(number.value) > 11) {
      this.ifMoreThenTen();
      return false;
    }

    if (this.getIntLength(number.value) === 1) {
      this.calculatedValue = this.oneNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 2) {
      this.calculatedValue = this.twoNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 3) {
      this.calculatedValue = this.threeNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 4) {
      this.calculatedValue = this.fourNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 5) {
      this.calculatedValue = this.fiveNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 6) {
      this.calculatedValue = this.sixNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 7) {
      this.calculatedValue = this.sevenNumberCase(valueBeforeDot) +  ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 8) {
      this.calculatedValue = this.eightNumberCase(valueBeforeDot) +  ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 9) {
      this.calculatedValue = this.nineNumberCase(valueBeforeDot) + ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
    else if (this.getIntLength(number.value) === 10) {
      this.calculatedValue = this.tenNumberCase(valueBeforeDot) +  ' ' + this.map['dollars'] + ' ' + this.getCents(valueAfterDot);
    }
  }
}
