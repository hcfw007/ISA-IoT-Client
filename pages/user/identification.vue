<template>
  <div class="identification">
    <div class="identification-card">
      <a-row>
        <user-card-left />
        <a-col :span="14" class="card-right">
          <a-row>
            <a-col :span="18" :offset="3">
              <section v-if="contentControl.step === 'base'">
                <div class="identification-selection" @click="selectPersonalIdentification">
                  <img src="@/static/images/identification/identification-personal.png" alt="">
                  <div class="label">实名认证为个人</div>
                </div>
                <div class="identification-selection" @click="selectorganizationIdentification">
                  <img src="@/static/images/identification/identification-organization.png" alt="">
                  <div class="label">实名认证为企业</div>
                </div>
              </section>
              <section v-if="contentControl.step === 'personal'">
                <a-form :form="personal.form" :wrapper-col="{ span: 24 }" class="text-left">
                  <a-form-item>
                    <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('姓名') ]}]" placeholder="请输入姓名" />
                  </a-form-item>
                  <a-form-item>
                    <a-input v-decorator="['id', { rules: [ validators.requiredRuleFactory('身份证号'), validators.personalId ]}]" placeholder="请输入身份证号" />
                  </a-form-item>
                  <a-form-item>
                    <span>身份证照片</span>
                  </a-form-item>
                  <a-form-item>
                    <div class="image-selection" @click="chooseFile('id-front')">
                      <img src="@/static/images/identification/personal-id-front.png" alt="" id="id-front-img">
                      <div class="label">身份证国徽面</div>
                    </div>
                    <input type="file" id="id-front" accept="image/png, image/jpeg, image/bmp" class="hidden" @change="fileChange('id-front', $event)">
                    <div class="image-selection" @click="chooseFile('id-back')">
                      <img src="@/static/images/identification/personal-id-back.png" alt="" id="id-back-img">
                      <div class="label">身份证人像面</div>
                    </div>
                    <input type="file" id="id-back" accept="image/png, image/jpeg, image/bmp" class="hidden" @change="fileChange('id-back', $event)">
                  </a-form-item>
                </a-form>
                <h5 class="attention-title">注意事项</h5>
                <ol class="attention-ol">
                  <li>同一身份证只能认证一个账号；</li>
                  <li>身份证国徽面与人像面信息应为同一身份证的信息且在有效期内；</li>
                  <li>所有上传照片需清晰且未遮挡，请勿进行美化和修改，以免认证失败；</li>
                  <li>上传图片文件格式支持png，jpg和bmp；</li>
                  <li>单张图片大小不超过3MB，尺寸最小为500px*500px</li>
                  <li>所有上传信息军辉被妥善保管，不会用于其他商业用途或者传输给第三方；</li>
                </ol>
                <a-button type="primary" class="submit-button" @click="submitPersonal">
                  提交认证资料
                </a-button>
                <a-button type="danger" class="cancel-button" @click="contentControl.step = 'base'" style="margin-left: 30px">
                  选择认证方式
                </a-button>
              </section>
              <section v-if="contentControl.step === 'organization'">
                <a-form :form="organization.form" :wrapper-col="{ span: 24 }" class="text-left">
                  <a-form-item>
                    <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('企业名称') ]}]" placeholder="请输入企业名称" />
                  </a-form-item>
                  <a-form-item>
                    <a-input v-decorator="['id', { rules: [ validators.requiredRuleFactory('社会信用代码'), validators.organizationId ]}]" placeholder="请输入社会信用代码" />
                  </a-form-item>
                  <a-form-item>
                    <a-cascader :options="organization.addressCascadeOptions" placeholder="请选择地址" v-decorator="['address', { rules: [ validators.requiredRuleFactory('地址', 'select') ]}]" />
                  </a-form-item>
                  <a-form-item>
                    <a-input v-decorator="['detail', { rules: [ validators.requiredRuleFactory('详细地址'), validators.maxWordsFactory(80) ]}]" placeholder="请输入详细地址，最多80个字符" />
                  </a-form-item>
                  <a-form-item>
                    <span>营业执照扫描件</span>
                  </a-form-item>
                  <a-form-item>
                    <div class="image-selection" @click="chooseFile('id-front')">
                      <img src="@/static/images/identification/lisence.png" alt="" id="id-organization-img">
                      <div class="label">营业执照扫描件</div>
                    </div>
                    <input type="file" id="id-front" accept="image/png, image/jpeg, image/bmp" class="hidden" @change="fileChange('id-organization', $event)">
                  </a-form-item>
                </a-form>
                <h5 class="attention-title">注意事项</h5>
                <ol class="attention-ol">
                  <li>同一社会信用代码只能认证一个账号；</li>
                  <li>所有上传照片需清晰且未遮挡，请勿进行美化和修改，以免认证失败；</li>
                  <li>上传图片文件格式支持png，jpg和bmp；</li>
                  <li>单张图片大小不超过3MB，尺寸最小为500px*500px</li>
                  <li>所有上传信息军辉被妥善保管，不会用于其他商业用途或者传输给第三方；</li>
                </ol>
                <a-button type="primary" class="submit-button" @click="submitOrganization">
                  提交认证资料
                </a-button>
                <a-button type="danger" class="cancel-button" @click="contentControl.step = 'base'" style="margin-left: 30px">
                  选择认证方式
                </a-button>
              </section>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getUserInfo, postPersonalIdApplication, postOrganizationIdApplication } from '~/assets/api/ajax'
import list from 'china-location/dist/location.json'

function generateOptions(locationJson) {
  let options = []
  for (let provinceKey in locationJson) {
    let province = locationJson[provinceKey]
    let provinceObj = {
      value: province.name,
      label: province.name,
      children: [],
    }
    for (let cityKey in province.cities) {
      let city = province.cities[cityKey]
      let cityObj = {
        value: city.name,
        label: city.name,
        children: [],
      }
      for (let districtKey in city.districts) {
        let district = city.districts[districtKey]
        let districtObj = {
          value: district,
          label: district,
        }
        cityObj.children.push(districtObj)
      }
      provinceObj.children.push(cityObj)
    }
    options.push(provinceObj)
  }
  return options
}

function getImageBase64(img, type, callback) {
  let image = new Image()
  image.src = getObjectURL(img)
  image.onload = function() {
    let canvas = document.createElement('canvas')
    let width = image.width
    let height = image.height
    if (width > height && (height > 800 || width > 800)) {
      height = Math.round(800 * height / width)
      width = 800
    } else {
      width = Math.round(800 * width / height)
      height = 800
    }
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, width, height)
    let dataURL = canvas.toDataURL(type)
    callback(dataURL)
  }
}

function getObjectURL(file) {
  var url = null
  if (window.createObjcectURL !== undefined) {
    url = window.createOjcectURL(file)
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

export default {
  layout: 'full-content',
  data() {
    return {
      user: {},
      contentControl: {
        step: 'base',
      },
      personal: {
        form: this.$form.createForm(this, { name: 'personalForm' }),
      },
      organization: {
        form: this.$form.createForm(this, { name: 'organizationForm'}),
        addressCascadeOptions: [],
      },
    }
  },
  mounted() {
    this.getUser()
    this.organization.addressCascadeOptions = generateOptions(list)
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
        // this.$router.push('/')
      }
      if (user.verified === 0) {
        this.$toast('实名认证审核中，请耐心等待', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        this.$router.push('/user/result')
      }
    },
    selectPersonalIdentification() {
      this.contentControl.step = 'personal'
      this.personal.form.resetFields()
      this.$nextTick(() => {
        document.getElementById('id-front-img').value = ''
        document.getElementById('id-back-img').value = ''
      })
    },
    selectorganizationIdentification() {
      this.contentControl.step = 'organization'
      this.organization.form.resetFields()
      this.$nextTick(() => {
        document.getElementById('id-organization-img').value = ''
      })
    },
    chooseFile(id) {
      document.getElementById(id).click()
    },
    fileChange(id, e) {
      let file = e.target.files[0]
      if (!file) {
        return
      }
      let type = file.type
      getImageBase64(file, type, function(code) {
        document.getElementById(id + '-img').src = code
      })
    },
    submitPersonal() {
      this.personal.form.validateFields(async (err, values) => {
        if (document.getElementById('id-back-img').src.length < 5 * 1024) {
          this.$toast('请上传身份证背面图案', {
            customCss: {
              'background-color': '#E6A23C',
              color: '#fff',
            },
          })
          return
        }
        if (document.getElementById('id-front-img').src.length < 5 * 1024) {
          this.$toast('请上传身份证正面图案', {
            customCss: {
              'background-color': '#E6A23C',
              color: '#fff',
            },
          })
          return
        }
        if (!err) {
          let info = {
            backImg: document.getElementById('id-back-img').src,
            frontImg: document.getElementById('id-front-img').src,
            name: values.name,
            number: values.id,
          }
          let {flag, payload} = await postPersonalIdApplication(this, info, '提交实名认证信息成功', '提交实名认证信息失败')
          if (flag) {
            this.$router.push('/')
          }
        }
      })
    },
    submitOrganization() {
      this.organization.form.validateFields(async (err, values) => {
        if (document.getElementById('id-organization-img').src.length < 5 * 1024) {
          this.$toast('请上传营业执照扫描件', {
            customCss: {
              'background-color': '#E6A23C',
              color: '#fff',
            },
          })
          return
        }
        if (!err) {
          let info = {
            licenseImg: document.getElementById('id-organization-img').src,
            name: values.name,
            number: values.id,
            address: `${ values.address[0] }/${ values.address[1] }/${ values.address[2] }/${ values.detail }`,
          }
          let {flag, payload} = await postOrganizationIdApplication(this, info, '提交实名认证信息成功', '提交实名认证信息失败')
          if (flag) {
            this.$router.push('/user/result')
          }
        }
      })
    },
  },
}
</script>

<style lang="stylus">
.identification
  background-color: rgba(1, 92, 242, 1)
  width: 100vw
  height: 100vh
  background-image: url('~static/images/user/background.png')
  background-position: right bottom
  background-repeat: no-repeat
  background-attachment: scroll
  text-align: center

  .identification-card
    height: 620px
    width: 850px
    display: inline-block
    margin: auto
    margin-top: 50vh
    transform: translateY(-50%)

    &>div
      height: 100%

    .card-right
      background-color: #fff
      height: 100%
      border-radius: 0 10px 10px 0
      padding-top: 30px

      .ant-form-item
        margin-bottom: 10px

  .identification-selection
    width: 200px
    height: 150px
    background-color: rgb(237, 246, 255)
    border-radius: 15px
    text-align: center
    position: relative
    overflow: hidden
    cursor: pointer
    margin: 30px 0
    display: inline-block

    img
      max-width: 160px
      max-height: 100px
      margin: auto
      margin-top: 10px

    .label
      position: absolute
      right: 0
      left: 0
      bottom: 0
      height: 30px
      background-color: rgb(0, 129, 255)
      color: #fff

  .image-selection
    width: 120px
    height: 100px
    background-color: rgb(237, 246, 255)
    border-radius: 15px
    text-align: center
    position: relative
    overflow: hidden
    cursor: pointer
    display: inline-block

    &:not(:first-child)
      margin-left: 20px

    img
      max-width: 80px
      max-height: 90px
      margin: auto

    .label
      position: absolute
      right: 0
      left: 0
      bottom: 0
      height: 20px
      background-color: rgb(0, 129, 255)
      color: #fff
      font-size: 12px
      line-height: 20px

  .attention-ol
    text-align: left
    font-size: 12px
    padding-left: 12px

  .attention-title
    text-align: left
    font-size: 14px
</style>
