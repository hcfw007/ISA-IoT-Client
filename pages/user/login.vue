<template>
  <div class="login">
    <div class="login-card">
      <a-row>
        <user-card-left />
        <a-col :span="14" class="card-right">
          <a-row>
            <a-col :span="18" :offset="3">
              <a-row>
                <a-col :span="24">
                  <a-tabs default-active-key="password-login" class="login-tabs" style="margin-top: 20px">
                    <a-tab-pane key="password-login" tab="密码登录">
                      <a-form :form="passwordLoginForm" :wrapper-col="{ span: 24 }" style="margin-top: 80px" class="text-left">
                        <a-form-item>
                          <a-input v-decorator="['username', { rules: [ validators.requiredRuleFactory('用户名称/邮箱地址/手机号码') ]}]" placeholder="请输入用户名称/邮箱地址/手机号码" />
                        </a-form-item>
                        <a-form-item>
                          <a-input v-decorator="['password', { rules: [ validators.requiredRuleFactory('密码'), validators.password ]}]" placeholder="请输入登录密码" type="password" />
                        </a-form-item>
                        <a-form-item class="img-verify-form-item">
                          <a-input v-decorator="['imageVerifyCode', { rules: [ validators.requiredRuleFactory('图形验证码') ]}]"  placeholder="请输入图形验证码">
                            <img slot="addonAfter" :src="imgVerify.src" ref="imgVerify" alt="" class="verify-img" @click="refreshVerifyImg">
                          </a-input>
                        </a-form-item>
                        <a-form-item>
                          <a-button type="primary" html-type="submit" class="login-button" @click="passwordLogin">
                            登录
                          </a-button>
                        </a-form-item>
                      </a-form>
                    </a-tab-pane>
                    <a-tab-pane key="verifycode-login" tab="验证码登录">
                      <a-form :form="verifyCodeLoginForm" :wrapper-col="{ span: 24 }" style="margin-top: 80px" class="text-left">
                        <a-form-item>
                          <a-input
                            v-decorator="['mobileOrMail', { rules: [ validators.requiredRuleFactory('手机号码/邮箱地址'), validators.mobileOrMail ]}]"
                            placeholder="请输入邮箱地址/手机号码"
                          />
                        </a-form-item>
                        <a-form-item class="img-verify-form-item">
                          <a-input v-decorator="['imageVerifyCode', { rules: [ validators.requiredRuleFactory('图形验证码') ]}]"  placeholder="请输入图形验证码">
                            <img slot="addonAfter" :src="imgVerify.src" alt="" class="verify-img" @click="refreshVerifyImg">
                          </a-input>
                        </a-form-item>
                        <a-form-item class="verify-code-form-item">
                          <a-input v-decorator="['code', { rules: [ validators.requiredRuleFactory('验证码') ]}]" placeholder="请输入验证码">
                            <span slot="addonAfter" class="clickable link-color send-verify" @click="sendVerify">发送验证码</span>
                          </a-input>
                        </a-form-item>
                        <a-form-item>
                          <a-button type="primary" html-type="submit" class="login-button" @click="verifyCodeLogin">
                            登录
                          </a-button>
                        </a-form-item>
                      </a-form>
                    </a-tab-pane>
                  </a-tabs>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12" class="text-left"><nuxt-link to="/user/register"><span class="clickable">还没有账号？立即注册</span></nuxt-link></a-col>
                <a-col :span="12" class="text-right"><nuxt-link to="/user/resetPassword"><span class="clickable link-color">忘记登录密码？</span></nuxt-link></a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getVerifyImg, getSMSCode, getMailCode, postUserPasswordLogin, postUserMailLogin, postUserMobileLogin } from '~/assets/api/ajax'
import { validators } from '~/assets/validators'
import { decode } from 'js-base64'

export default {
  layout: 'full-content',
  data() {
    return {
      passwordLoginForm: this.$form.createForm(this, { name: 'passwordLoginForm' }),
      verifyCodeLoginForm: this.$form.createForm(this, { name: 'verifyCodeLoginForm' }),
      imgVerify: {
        uuid: '',
        src: '',
      },
      validators,
    }
  },
  mounted() {
    this.refreshVerifyImg()
  },
  methods: {
    async refreshVerifyImg() {
      let uuid = new Date().valueOf()
      await getVerifyImg(uuid).then((response) => {
        if (response.status === 200) {
          let data = response.data
          let fr = new FileReader()
          fr.readAsDataURL(data)
          fr.onload = (e) => {
            this.imgVerify.src = e.target.result
          }
          this.imgVerify.uuid = uuid
        }
      }).catch((error) => {
        if (error.message === 'dense requests') return
        console.debug(error.message)
      })
    },
    sendVerify() {
      this.verifyCodeLoginForm.validateFields(['mobileOrMail'], { first: true }, (err, values) => {
        if (!err) {
          let { mobileOrMail } = values
          if (/^1[0-9]{10}$/.test(mobileOrMail)) {
            let mobile = mobileOrMail
            getSMSCode(this, undefined, { phone: mobile }, '发送验证码成功！', '发送验证码失败')
          } else {
            let mail = mobileOrMail
            getMailCode(this, undefined, { email: mail }, '发送验证码成功！', '发送验证码失败')
          }
        }
      })
    },
    async passwordLogin() {
      this.passwordLoginForm.validateFields(async (err, values) => {
        if (!err) {
          let infoObj = {
            userName: values.username,
            password: values.password,
            picCode: values.imageVerifyCode,
            uuid: this.imgVerify.uuid,
          }
          this.loginHandler(await postUserPasswordLogin(this, infoObj, '登陆成功', '登陆失败'))
        }
      })
    },
    verifyCodeLogin() {
      this.verifyCodeLoginForm.validateFields(async (err, values) => {
        if (!err) {
          let infoObj = {
            uuid: this.imgVerify.uuid,
            picCode: values.imageVerifyCode,
          }
          if (/^1[0-9]{10}$/.test(values.mobileOrMail)) {
            infoObj.phone = values.mobileOrMail
            infoObj.smsCode = values.code
            this.loginHandler(await postUserMobileLogin(this, infoObj, '登陆成功', '登陆失败'))
          } else {
            infoObj.email = values.mobileOrMail
            infoObj.emailCode = values.code
            this.loginHandler(await postUserMailLogin(this, infoObj, '登陆成功', '登陆失败'))
          }
        }
      })
    },
    loginHandler({flag, payload}) {
      if (flag) {
        let token = payload.token
        localStorage.setItem('token', token)
        this.$router.push('/')
      }
    },
  },
}
</script>

<style lang="stylus">
.login
  background-color: rgba(1, 92, 242, 1)
  width: 100vw
  height: 100vh
  background-image: url('~static/images/user/background.png')
  background-position: right bottom
  background-repeat: no-repeat
  background-attachment: scroll
  text-align: center

  .login-card
    height: 620px
    width: 850px
    display: inline-block
    margin-top: 50vh
    transform: translateY(-50%)

    &>div
      height: 100%

    .card-right
      background-color: #fff
      height: 100%
      border-radius: 0 10px 10px 0

  .login-tabs
    .ant-tabs-tab
      font-size: 16px
      font-weight: 700
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif

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

  .login-button
    width: 100%
    height: 45px
</style>
