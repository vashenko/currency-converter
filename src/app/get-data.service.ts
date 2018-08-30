import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GetDataService {

  private enUrl = '../assets/i18n/en.json';
  private ukrUrl =  '../assets/i18n/ukr.json';

  constructor(private http: Http) {}

  getEnMap () {
    return this.http.get(this.enUrl)
      .map((response: Response) => response.json());
  }

  getUkrMap () {
    return this.http.get(this.ukrUrl)
      .map((response: Response) => response.json());
  }
}


