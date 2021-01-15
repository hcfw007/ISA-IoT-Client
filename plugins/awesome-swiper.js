import Vue from 'vue'
import { Swiper as SwiperClass, Autoplay, EffectFade } from 'swiper/core'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

import 'swiper/swiper-bundle.css'

SwiperClass.use([Autoplay, EffectFade])

Vue.use(getAwesomeSwiper(SwiperClass))
