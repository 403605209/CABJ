export default class CssDirector {
  static lengthRule = ',width,height,top,left,right,bottom,';
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
  static getTargetCss(key: string, element: any): string {
    switch (key) {
      case 'width':
        return element.offsetWidth;
      case 'height':
        return element.offsetHeight;
    }
    return '';
  }
  // tslint:disable-next-line: cyclomatic-complexity
  static getResultCss(key: string, element: any, cssText: string): string {
    switch (key) {
      // width
      case 'width':
        return this.lengthGet(element, cssText, 'offsetWidth');
      // height
      case 'height':
        return this.lengthGet(element, cssText, 'offsetHeight');
    }
    return element.style[key];
  }
  static lengthGet(element: any, cssText: string, property: string) {
    if (cssText.includes('%')) {
      const parentPixel = element.offsetParent[property];
      const percent = Number.parseFloat(cssText) / 100;
      return `${parentPixel * percent}px`;
    } else {
      return this.getUnit(element, cssText, element[property]);
    }
  }
  static getUnit(element: any, cssText: string, value: any) {
    if (cssText.includes('px')) {
      return cssText;
    } else if (cssText.includes('em')) {
      const parentFontPixel = Number.parseFloat(
        getComputedStyle(element.offsetParent).fontSize
      );
      const em = Number.parseFloat(cssText);
      return `${parentFontPixel * em}px`;
    } else if (cssText.includes('rem')) {
      const bodyFontPixel = Number.parseFloat(
        getComputedStyle(document.getElementsByTagName('body')[0]).fontSize
      );
      const rem = Number.parseFloat(cssText);
      return `${bodyFontPixel * rem}px`;
    } else {
      return value;
    }
  }
}
