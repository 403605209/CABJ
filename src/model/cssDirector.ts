import colorConvert from 'color-string';
const HUNDRED = 100;
export default class CssDirector {
  static lengthRule = ',width,height,top,left,right,bottom,';
  static colorRule =
    ',backgroundColor,color,borderColor,outlineColor,textDecorationColor,';
  static set(
    key: string,
    element: any,
    value: string,
    result: string,
    degree: number
  ) {
    if (degree <= 1) {
      if (this.lengthRule.includes(`,${key},`)) {
        element.style[key] = this.lengthChange(value, result, degree);
      } else if (this.colorRule.includes(`,${key},`)) {
        element.style[key] = this.colorChange(value, result, degree);
      }
    }
  }
  static lengthChange(value: string, result: string, degree: number) {
    const start = Number.parseFloat(value);
    const end = Number.parseFloat(result);
    const sub = end - start;
    const change = sub * degree;
    return `${start + change}px`;
  }
  static colorChange(value: string, result: any, degree: number) {
    const values: number[] = colorConvert.get.rgb(value);
    const rgba = [];
    for (let index = 0; index < values.length; index++) {
      rgba.push(this.changeItem(values[index], result[index], degree));
    }
    return `rgba(${rgba.join(',')})`;
  }
  static changeItem(start: number, end: number, degree: number) {
    const sub = end - start;
    const change = sub * degree;
    return start + change;
  }
  static getTargetCss(key: string, element: any): string {
    return this.getCurCss(element)[key];
  }
  static getResultCss(key: string, element: any, cssText: string): string {
    if (this.lengthRule.includes(`,${key},`)) {
      return this.lengthResultGet(key, element, cssText);
    } else if (this.colorRule.includes(`,${key},`)) {
      return this.colorResultGet(cssText);
    }
    return element.style[key];
  }
  static lengthResultGet(key: string, element: any, cssText: string) {
    if (cssText.includes('%')) {
      const parentPixel = Number.parseFloat(
        this.getCurCss(this.getParent(element))[key]
      );
      const percent = Number.parseFloat(cssText) / HUNDRED;
      return `${parentPixel * percent}px`;
    } else if (cssText.includes('vw')) {
      const bodyPixel = Number.parseFloat(this.getCurCss(document.body).width);
      const percent = Number.parseFloat(cssText) / HUNDRED;
      return `${bodyPixel * percent}px`;
    } else if (cssText.includes('vh')) {
      const bodyPixel = Number.parseFloat(this.getCurCss(document.body).height);
      const percent = Number.parseFloat(cssText) / HUNDRED;
      return `${bodyPixel * percent}px`;
    } else {
      return this.getUnit(element, cssText, this.getCurCss(element)[key]);
    }
  }
  static colorResultGet(cssText: string) {
    // [255, 255, 255, 1]
    return colorConvert.get.rgb(cssText);
  }
  static getCurCss(element: any): any {
    return getComputedStyle(element);
  }
  static getParent(element: any): any {
    return element.offsetParent || element.parentElement || document.body;
  }
  static getUnit(element: any, cssText: string, value: any) {
    if (cssText.includes('px')) {
      return cssText;
    } else if (cssText.includes('em')) {
      const parentFontPixel = Number.parseFloat(
        this.getCurCss(this.getParent(element)).fontSize
      );
      const em = Number.parseFloat(cssText);
      return `${parentFontPixel * em}px`;
    } else if (cssText.includes('rem')) {
      const bodyFontPixel = Number.parseFloat(
        this.getCurCss(document.getElementsByTagName('body')[0]).fontSize
      );
      const rem = Number.parseFloat(cssText);
      return `${bodyFontPixel * rem}px`;
    } else {
      return value;
    }
  }
}
