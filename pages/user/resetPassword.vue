<template>
  <div class="reset">
    <div class="reset-card">
      <a-row>
        <a-col :span="10" class="card-left">
          <div class="rectangle" />
        </a-col>
        <a-col :span="14" class="card-right">
          <a-row  v-if="currentStep !== 2">
            <a-col :span="18" :offset="3" class="text-left">
              <a-row style="margin-top: 40px">
                <a-col :span="24"><span class="reset-title">重置密码</span></a-col>
              </a-row>
              <a-row style="margin-top: 20px">
                <a-col :span="24">
                  <a-steps :current="currentStep" @change='onStepChange' labelPlacement="vertical">
                    <a-step description="验证邮箱地址/手机号码"></a-step>
                    <a-step description="设置新密码"></a-step>
                    <a-step description="密码重置成功"></a-step>
                  </a-steps>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form :form="step1Form" :wrapper-col="{ span: 24 }" style="margin-top: 20px" v-if="currentStep === 0">
                    <a-form-item>
                      <a-input
                        v-decorator="['mobileOrMail', { rules: [ validators.requiredRuleFactory('手机号码/邮箱地址'), validators.mobileOrMail ]}]"
                        placeholder="请输入邮箱地址/手机号码"
                      />
                    </a-form-item>
                    <a-form-item class="verify-code-form-item">
                      <a-input v-decorator="['code', { rules: [ validators.requiredRuleFactory('验证码') ]}]" placeholder="请输入验证码">
                        <span slot="addonAfter" class="clickable link-color send-verify" @click="sendVerify">发送验证码</span>
                      </a-input>
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" html-type="submit" class="reset-button" @click="gotoStep2">
                        下一步
                      </a-button>
                    </a-form-item>
                    <a-form-item class="text-center">
                      <nuxt-link to="/user/login"><span class="clickable link-color">返回账号登录</span></nuxt-link>
                    </a-form-item>
                  </a-form>
                  <a-form :form="step2Form" :wrapper-col="{ span: 24 }" style="margin-top: 20px" v-if="currentStep === 1">
                    <a-form-item>
                      <a-input v-decorator="['password', { rules: [ validators.requiredRuleFactory('密码'), validators.password ]}]" placeholder="请设置6-20位登录密码" type="password" />
                    </a-form-item>
                    <a-form-item>
                      <a-input v-decorator="['confirmPassword', { rules: [ validators.confirmPassword, validators.password, { validator: validateConfirmPassword } ]}]" placeholder="再次输入登录密码" type="password" />
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" html-type="submit" class="reset-button" @click="gotoStep3">
                        确定
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row v-else>
            <a-col :span="18" :offset="3" class="text-center">
              <h2 style="margin-top: 240px"><a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" style="font-size: 60px" /></h2>
              <h2 class="success-hint">密码重置成功</h2>
              <nuxt-link to="/user/login"><a-button type="primary" class="reset-button">重新登录</a-button></nuxt-link>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getSMSCode, getMailCode, postPasswordReset } from '~/assets/api/ajax'
import { validators } from '~/assets/validators'

export default {
  layout: 'full-content',
  data() {
    return {
      step1Form: this.$form.createForm(this, { name: 'step1Form' }),
      step2Form: this.$form.createForm(this, { name: 'step2Form' }),
      imgVerify: {
        uuid: '',
      },
      resetInfo: {},
      validators,
      currentStep: 0,
    }
  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
      let password1 = this.step2Form.getFieldValue('password')
      let password2 = this.step2Form.getFieldValue('confirmPassword')
      if (password2.length < 6 || password1.length > 20) {
        callback()
        return
      }
      if (password1 !== password2) {
        callback('两次密码输入不一致！')
        return
      }
      callback()
    },
    onStepChange(e) {
      if (this.currentStep < e) {
        return
      } else {
        this.currentStep = e
      }
    },
    sendVerify() {
      this.step1Form.validateFields(['mobileOrMail'], (err, values) => {
        if (!err) {
          let { mobileOrMail } = values
          if (/^1[0-9]{10}$/.test(mobileOrMail)) {
            let mobile = mobileOrMail
            getSMSCode(this, null, { phone: mobile }, '发送验证码成功！', '发送验证码失败')
          } else {
            let mail = mobileOrMail
            getMailCode(this, null, { email: mail }, '发送验证码成功！', '发送验证码失败')
          }
        }
      })
    },
    gotoStep2() {
      this.step1Form.validateFields((err, values) => {
        if (!err) {
          this.resetInfo.mobileOrMail = values.mobileOrMail
          this.resetInfo.code = values.code
          this.currentStep = 1
        }
      })
    },
    gotoStep3() {
      this.step2Form.validateFields(async (err, values) => {
        if (!err) {
          this.resetInfo.password = values.password
          let infoObj = {
            password: this.resetInfo.password,
            verifyCode: this.resetInfo.code,
          }
          if (/^1[0-9]{10}$/.test(values.mobileOrMail)) {
            infoObj.phone = values.mobileOrMail
          } else {
            infoObj.email = values.mobileOrMail
          }
          let { flag, payload } = await postPasswordReset(this, infoObj, '重置成功', '重置失败')
          if (flag) {
            this.currentStep = 2
          }
        }
      })
    },
  },
}
</script>

<style lang="stylus">
.reset
  background-color: rgba(1, 92, 242, 1)
  width: 100vw
  height: 100vh
  background-image: url('~static/images/user/background.png')
  background-position: right bottom
  background-repeat: no-repeat
  background-attachment: scroll
  text-align: center

  .reset-card
    height: 620px
    width: 850px
    display: inline-block
    margin: auto
    margin-top: calc(50vh - 380px)

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

      .reset-title
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif
        font-size: 16px
        font-weight: 700

      .login-link
        color: #999

  .ant-input
    height: 45px
    padding: 10px 3px
    text-align: left

  .ant-input-group-addon
    padding: 0
    border: 0
    position: absolute
    top: 1px
    z-index: 999
    text-align: center

  .img-verify-form-item
    .ant-input
      padding-right: 140px

    .verify-img
      height: 43px
      width: 120px

    .ant-input-group-addon
      right: 120px

  .verify-code-form-item
    .ant-input-group-addon
      right: 15px
      width: 80px
      background-color: transparent

    .send-verify
      display: inline-block
      height: 43px
      line-height: 43px
      background-color: transparent

    .ant-input
      padding-right: 100px

  .reset-button
    width: 100%
    height: 45px
</style>
