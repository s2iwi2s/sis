import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlUtilService {

  constructor() { }


  toHtml(str: string): string {
    str = str.split('\n').join("<br/>");
    str = str.replace(/\s\s\s/g, '&emsp;');
    return str;
  }
}
