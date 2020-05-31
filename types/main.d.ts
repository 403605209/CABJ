import Vue, { VueConstructor } from './vue';
interface CABJ {
  start(key: string): void;
}
export declare type CABJPlugin = {
  install(vue: VueConstructor<Vue>): void;
};
declare const instance: CABJPlugin;
export default instance;
export { CABJ };
