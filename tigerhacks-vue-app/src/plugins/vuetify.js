import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'

import Vuetify, {
  VCard, 
  VToolbar
} from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  components: {
    VCard, 
    VToolbar
  }, 
  directives: {
    Ripple
  }, 
  defaultAssets: {
    font: true, 
    icons: 'mdi'
  }, 
  icons: {
    iconfont: 'mdi', 
    values: {
      info: "mdi-about", 
      product: 'mdi-dropbox',
      support: 'mdi-lifebuoy',
      steam: 'mdi-steam-box',
      pc: 'mdi-desktop-classic',
      xbox: 'mdi-xbox',
      playstation: 'mdi-playstation',
      switch: 'mdi-nintendo-switch',
    }
  }
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true
  }
});
