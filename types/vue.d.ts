import Vue, { VueConstructor } from 'vue';
import { CABJ } from './main';
declare module 'vue/types/vue' {
  interface Vue {
    $cabj: CABJ;
  }
  interface VueConstructor {
    $cabj: CABJ;
  }
}

export { VueConstructor };
export default Vue;
