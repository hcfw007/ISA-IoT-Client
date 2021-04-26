<template>
  <div class="result">
    <div class="result-card">
      <a-row>
        <a-col :span="10" class="card-left">
          <div class="rectangle" />
        </a-col>
        <a-col :span="14" class="card-right">
          <a-row>
            <a-col :span="18" :offset="3">
              <section v-if="contentControl.result === 'pending'">
                <img src="@/static/images/identification/clock.png" alt="">
                <div class="hint">
                  <h4>认证资料提交成功</h4>
                  <h5>我们将尽快完成资料审核</h5>
                  <h5 class="clickable" @click="reload">刷新页面</h5>
                </div>
              </section>
              <section v-if="contentControl.result === 'rejected'">
                <img src="@/static/images/identification/error.png" alt="">
                <div class="hint">
                  <h4>认证资料审核不通过</h4>
                  <h5>原因：<span style="color: red">{{ contentControl.reason }}</span></h5>
                  <h5 class="clickable" @click="goto('/user/identification')">重新提交资料</h5>
                </div>
              </section>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getUserInfo, getUserIdInfo } from '~/assets/api/ajax'

export default {
  layout: 'full-content',
  data() {
    return {
      user: {},
      contentControl: {
        result: 'pending',
        reason: '',
      },
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      let {result, payload} = await getUserInfo(this)
      let user = payload
      this.user = user
      localStorage.setItem('userInfo', JSON.stringify(user))
      if (user.verified === 1) {
        this.$toast('实名认证已通过，无需重复认证', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        this.$router.push('/')
      }
      if (user.verified === 3) {
        this.$toast('尚未提交实名审核材料', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        this.$router.push('/user/identification')
      }
      if (user.verified === 2) {
        let userId = user.userId
        let userIdInfoResponse = await getUserIdInfo(this, null, null, '', '', { userId })
        this.contentControl.reason = userIdInfoResponse.payload.remark
        this.contentControl.result = 'rejected'
      }
    },
    reload() {
      location.reload()
    },
  },
}
</script>

<style lang="stylus">
.result
  background-color: rgba(1, 92, 242, 1)
  width: 100vw
  height: 100vh
  background-image: url('~static/images/user/background.png')
  background-position: right bottom
  background-repeat: no-repeat
  background-attachment: scroll
  text-align: center

  .result-card
    height: 620px
    width: 850px
    display: inline-block
    margin: auto
    margin-top: 50vh
    transform: translateY(-50%)

    &>div
      height: 100%

    .card-left
      background-color: rgba(64, 158, 255, 1)
      height: 100%
      border-radius: 10px 0 0 10px

      .rectangle
        height: 80px
        width: 30px
        border: solid 1px #fff
        margin: auto
        margin-top: calc(50% + 40px)

    .card-right
      background-color: #fff
      height: 100%
      border-radius: 0 10px 10px 0
      padding-top: 30px

      img
        margin-top: 150px
        margin-bottom: 30px
        width: 100px
        height: 100px

</style>
