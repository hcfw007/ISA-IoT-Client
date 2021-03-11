import Vue from 'vue'
import enums from '~/assets/classes/enums'
import { validators } from '~/assets/validators'
import { drawerConfig } from '~/assets/config'
import { simpleDownload } from '~/assets/api/ajax'

Vue.mixin({
  data() {
    return {
      enums,
      validators,
      drawerConfig,
    }
  },
  methods: {
    simpleDownload(url, queryObject) {
      simpleDownload(url, queryObject)
    },
  },
})
