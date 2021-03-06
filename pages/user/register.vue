<template>
  <div class="register">
    <div class="register-card">
      <a-row>
        <user-card-left />
        <a-col :span="14" class="card-right">
          <a-row>
            <a-col :span="18" :offset="3">
              <a-row style="margin-top: 20px">
                <a-col :span="12" class="text-left"><span class="register-title">注册账户</span></a-col>
                <a-col :span="12" class="text-right"><nuxt-link to="/user/login"><span class="login-link">已有账号 立即登录</span></nuxt-link></a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form :form="registerForm" :wrapper-col="{ span: 24 }" style="margin-top: 20px" class="text-left">
                    <a-form-item>
                      <a-input v-decorator="['username', { rules: [ validators.requiredRuleFactory('用户名') ]}]" placeholder="设置用户名称" />
                    </a-form-item>
                    <a-form-item>
                      <a-input v-decorator="['password', { rules: [ validators.requiredRuleFactory('密码'), validators.password ]}]" placeholder="请设置6-20位登录密码" type="password" />
                    </a-form-item>
                    <a-form-item>
                      <a-input v-decorator="['confirmPassword', { rules: [ validators.confirmPassword, validators.password, { validator: validateConfirmPassword } ]}]" placeholder="再次输入登录密码" type="password" />
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        v-decorator="['mobileOrMail', { rules: [ validators.requiredRuleFactory('手机号码/邮箱地址'), validators.mobileOrMail ]}]"
                        placeholder="请输入邮箱地址/手机号码"
                      />
                    </a-form-item>
                    <a-form-item class="img-verify-form-item">
                      <a-input v-decorator="['imageVerifyCode', { rules: [ validators.requiredRuleFactory('图形验证码') ]}]" placeholder="请输入图形验证码">
                        <img
                          slot="addonAfter"
                          ref="verifyImg"
                          src=""
                          alt=""
                          class="verify-img"
                          @click="refreshVerifyImg()"
                        >
                      </a-input>
                    </a-form-item>
                    <a-form-item class="verify-code-form-item">
                      <a-input v-decorator="['code', { rules: [ validators.requiredRuleFactory('验证码') ]}]" placeholder="请输入验证码">
                        <span slot="addonAfter" class="clickable link-color send-verify" @click="sendVerify">发送验证码</span>
                      </a-input>
                    </a-form-item>
                    <a-form-item class="text-left">
                      <a-checkbox v-decorator="['agreement', { valuePropName: 'checked', rules: [ validators.agreement ]}]" default-check="false">勾选同意《用户服务协议》</a-checkbox>
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" html-type="submit" class="register-button" @click="register">
                        注册
                      </a-button>
                    </a-form-item>
                  </a-form>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getVerifyImg, getSMSCode, getMailCode, postUserRegister } from '~/assets/api/ajax'
import { validators } from '~/assets/validators'

export default {
  layout: 'full-content',
  data() {
    return {
      registerForm: this.$form.createForm(this, { name: 'registerForm' }),
      imgVerify: {
        uuid: '',
      },
      validators,
    }
  },
  mounted() {
    this.refreshVerifyImg()
  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
      let password1 = this.registerForm.getFieldValue('password')
      let password2 = this.registerForm.getFieldValue('confirmPassword')
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
    register() {
      this.registerForm.validateFields(async (err, values) => {
        if (!err) {
          let infoObj = {
            userName: values.username,
            password: values.password,
            picCode: values.imageVerifyCode,
            picUuid: this.imgVerify.uuid,
            verifyNumber: values.mobileOrMail,
            veryCode: values.code,
          }
          let { flag } = await postUserRegister(this, infoObj, '注册成功！', '注册失败')
          if (flag) {
            this.$router.push('/user/login')
          }
        }
      })
    },
    async refreshVerifyImg() {
      let uuid = new Date().valueOf()
      await getVerifyImg(uuid).then((response) => {
        if (response.status === 200) {
          let data = response.data
          let fr = new FileReader()
          fr.readAsDataURL(data)
          fr.onload = (e) => {
            this.$refs.verifyImg.src = e.target.result
          }
          this.imgVerify.uuid = uuid
        }
      }).catch((error) => {
        if (error.message === 'dense requests') return
        console.debug(error.message)
      })
    },
    sendVerify() {
      this.registerForm.validateFields(['mobileOrMail'], (err, values) => {
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
  },
}
</script>

<style lang="stylus">
.register
  background-color: rgba(1, 92, 242, 1)
  width: 100vw
  height: 100vh
  background-image: url('~static/images/user/background.png')
  background-position: right bottom
  background-repeat: no-repeat
  background-attachment: scroll
  text-align: center

  .register-card
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

      .register-title
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

  .register-button
    width: 100%
    height: 45px
</style>
