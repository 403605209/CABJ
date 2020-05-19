import Vue, { VueConstructor } from './vue';
interface CABL {
  start(key: string): void;
}
export declare type CABLPlugin = {
  install(vue: VueConstructor<Vue>): void;
};
declare const instance: CABLPlugin;
export default instance;
export { CABL };
