import CssDirector from './model/cssDirector';
import AnimacioInit from './polyfill';

interface Animacio {
  target(element: any): Animacio;
  start(func: (option: any) => void): Animacio;
  end(func: (option: any) => void): Animacio;
  from(option: any): Animacio;
  to(option: any): Animacio;
  time(time: number): Animacio;
  when(
    func: (animationStep: number, degree: number, element: any) => void
  ): Animacio;
  // 不用run当什么时候触发
  trigger(func: (option: any) => void): Animacio;
  /// Only executed once the conditions are met
  /// { if:func, do:func }
  condition(conditions: any[]): Animacio;
  run(): Animacio;
  over(): Animacio;
  // TODO:速度函数
}
class Animacio {
  private element: any;
  private animationId: number;
  private startTime: number;
  private timeSum: number;
  private step: number;
  private conditions: any[];
  private animations: any[];
  private times: any[];
  private startState: any;
  private endState: any;
  private process: number;
  private startFunc: any;
  private endFunc: any;
  private whenFunc: any;
  constructor() {
    this.conditions = [];
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
  target(element: any): Animacio {
    if (element == null) {
      throw new Error("can't get the property style !");
    }
    this.element = element;
    return this;
  }
  start(func: (option: any) => void): Animacio {
    this.startFunc = func;
    return this;
  }
  end(func: (option: any) => void): Animacio {
    this.endFunc = func;
    return this;
  }
  from(option: any): Animacio {
    this.startState = option;
    return this;
  }
  to(option: any): Animacio {
    this.animations.push(option);
    return this;
  }
  // time肯能精细到map,每一个样式执行时间,事件有可能无限循环,设置线性,曲线
  time(time: number): Animacio {
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
  when(
    func: (animationStep: number, degree: number, element: any) => void
  ): Animacio {
    this.whenFunc = func;
    return this;
  }
  condition(conditions: any[]): Animacio {
    this.conditions = conditions;
    return this;
  }
  // tslint:disable-next-line: cyclomatic-complexity
  run(): Animacio {
    const _self = this;
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
    setTimeout(function () {
      _self.over();
    }, this.timeSum);
    return this;
  }
  // 暂停
  // 结束
  over(isSetEndState: boolean = true): Animacio {
    this.process = 1;
    // run condition
    this.runCondition();
    // end func
    if (this.endFunc) {
      this.endFunc(this);
    }
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
    // When you switch the tab, it will not run, here is replaced by the window time
    time = window.performance.now();
    const interval = time - this.startTime;
    const beforeTime = this.step !== 0 ? this.times[this.step - 1] : 0;
    this.process =
      (interval - beforeTime) / (this.times[this.step] - beforeTime);
    this.animateStep();

    if (time < this.startTime + this.timeSum) {
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
      this.animationId = window.requestAnimationFrame(this.animate.bind(this));
    } else {
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
    // run whenFun
    if (this.whenFunc) {
      this.whenFunc(this.step, process, this.element);
    }
    // run condition
    this.runCondition();
  }
  private runCondition() {
    if (this.conditions.length > 0) {
      for (let i = this.conditions.length - 1; i >= 0; i--) {
        const condition = this.conditions[i];
        if (condition.if(this.step, this.process, this.element)) {
          condition.do(this.step, this.process, this.element);
          this.conditions.splice(i, 1);
        }
      }
    }
  }
  private setEndState() {
    const result: any = this.endState;
    for (const key of Object.keys(result)) {
      this.element.style[key] = result[key];
    }
  }
}

export default Animacio;
export { AnimacioInit, CssDirector };
