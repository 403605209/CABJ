import CssDirector from './model/cssDirector';
import CABJInit from './polyfill';

interface CABJ {
  target(element: any): CABJ;
  start(func: (option: any) => void): CABJ;
  end(func: (option: any) => void): CABJ;
  from(option: any): CABJ;
  to(option: any): CABJ;
  time(time: number): CABJ;
  // 但什么时候触发别的事件
  when(func: (option: any) => boolean): CABJ;
  // 不用run当什么时候触发
  trigger(func: (option: any) => void): CABJ;
  // 当什么时候开关一些属性,如display:hide
  condition(func: (option: any) => boolean): CABJ;
  run(): CABJ;
  over(): CABJ;
}
class CABJ {
  private element: any;
  private animationId: number;
  private startTime: number;
  private timeSum: number;
  private step: number;
  private animations: any[];
  private times: any[];
  private startState: any;
  private endState: any;
  private process: number;
  private startFunc: any;
  private endFunc: any;
  constructor() {
    this.animations = [];
    this.times = [];
    this.startState = {};
    this.endState = {};
    this.animationId = 0;
    this.startTime = 0;
    this.timeSum = 0;
    this.step = 0;
    this.process = 0;
  }
  target(element: any): CABJ {
    if (element == null) {
      throw new Error("can't get the property style !");
    }
    this.element = element;
    return this;
  }
  start(func: (option: any) => void): CABJ {
    this.startFunc = func;
    return this;
  }
  end(func: (option: any) => void): CABJ {
    this.endFunc = func;
    return this;
  }
  from(option: any): CABJ {
    this.startState = option;
    return this;
  }
  to(option: any): CABJ {
    this.animations.push(option);
    return this;
  }
  // time肯能精细到map,每一个样式执行时间,事件有可能无限循环,设置线性,曲线
  time(time: number): CABJ {
    if (this.animations.length - (this.times.length + 1) !== 0) {
      throw new Error("set time: animation can't be null !");
    }
    const length = this.animations.length - this.times.length;
    const interval = time / length;
    this.timeSum += time;
    const initTime =
      this.times.length > 0 ? this.times[this.times.length - 1] : 0;

    for (let index = 1; index <= length; index++) {
      const value = index * interval + initTime;
      this.times.push(value);
    }
    return this;
  }
  // tslint:disable-next-line: cyclomatic-complexity
  run(): CABJ {
    // cancel
    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId);
    }
    this.animationId = 0;
    // start func
    if (this.startFunc) {
      this.startFunc(this);
    }
    // init state
    if (this.startState) {
      for (const key of Object.keys(this.startState)) {
        this.element.style[key] = this.startState[key];
      }
    }
    for (const result of this.animations) {
      for (const key of Object.keys(result)) {
        this.endState[key] = result[key];
      }
    }
    this.startTime = window.performance.now();
    this.animationId = window.requestAnimationFrame(this.animate.bind(this));
    return this;
  }
  // 暂停
  // 结束
  over(isSetEndState: boolean = true): CABJ {
    if (isSetEndState) {
      this.setEndState();
    }
    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId);
    }
    this.animationId = 0;
    return this;
  }
  // tslint:disable-next-line: cyclomatic-complexity
  private animate(time: number) {
    const interval = time - this.startTime;
    const beforeTime = this.step !== 0 ? this.times[this.step - 1] : 0;
    this.process =
      (interval - beforeTime) / (this.times[this.step] - beforeTime);
    this.animateStep();

    // 超时进行下一步
    if (interval > this.times[this.step]) {
      this.step += 1;
      if (this.step < this.animations.length) {
        const result: any = this.animations[this.step];
        for (const key of Object.keys(result)) {
          this.startState[key] = CssDirector.getTargetCss(key, this.element);
        }
      }
    }
    if (time < this.startTime + this.timeSum) {
      this.animationId = window.requestAnimationFrame(this.animate.bind(this));
    } else {
      // end func
      if (this.endFunc) {
        this.endFunc(this);
      }
      this.over();
    }
  }
  private animateStep() {
    const result: any = this.animations[this.step];
    for (const key of Object.keys(result)) {
      this.animateItem(key);
    }
  }
  private animateItem(key: string) {
    if (!this.startState[key]) {
      this.startState[key] = CssDirector.getTargetCss(key, this.element);
    }
    const value = this.startState[key];
    const result = CssDirector.getResultCss(
      key,
      this.element,
      this.animations[this.step][key]
    );
    const process = this.process;
    CssDirector.set(key, this.element, value, result, process);
  }
  private setEndState() {
    const result: any = this.endState;
    for (const key of Object.keys(result)) {
      this.element.style[key] = CssDirector.getResultCss(
        key,
        this.element,
        result[key]
      );
    }
  }
}

export default CABJ;
export { CABJInit, CssDirector };
