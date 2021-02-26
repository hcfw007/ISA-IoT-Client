import Vue from 'vue'
import enums from '~/assets/classes/enums'
import { validators } from '~/assets/validators'
import { drawerConfig } from '~/assets/config'

Vue.mixin({
  data() {
    return {
      enums,
      validators,
      drawerConfig,
    }
  },
})
