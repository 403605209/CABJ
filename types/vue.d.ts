import Vue, { VueConstructor } from 'vue';
import { CABL } from './main';
declare module 'vue/types/vue' {
  interface Vue {
    $cabl: CABL;
  }
  interface VueConstructor {
    $cabl: CABL;
  }
}

export { VueConstructor };
export default Vue;
