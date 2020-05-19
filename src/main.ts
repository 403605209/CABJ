import Vue, { VueConstructor } from 'vue';

interface CABL {
  start(key: string): void;
}
class CABL {
  start(key: string): void {
    console.log(key);
  }
}
// 暂时只用单例 - single instance
export type CABLPlugin = {
  install(vue: VueConstructor<Vue>): void;
};
const instance: CABLPlugin = {
  install(vue) {
    const alias = '$cabj';
    const cabj = new CABL() as CABL;
    vue.prototype[alias] = cabj;
    Object.defineProperty(Vue, `${alias}`, {
      get() {
        return cabj;
      },
    });
  },
};
export default instance;

export { CABL };
