/* eslint-disable handle-callback-err */
/* eslint-disable handle-callback-err */
/* eslint-disable handle-callback-err */
/* eslint-disable handle-callback-err */
<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png"
             alt="黑马头条">
      </div>
      <div class="login-form">
        <!-- 表单验证：
        rules  配置验证规则
        将需要验证的字段通过 prop配置到 el-form-item 上
        ref  获取表单的组件，可以手动调用表单组件的验证方法 -->
        <el-form ref="ruleForm"
                 :model="form"
                 :rules="rules">
          <el-form-item prop='mobile'>
            <el-input v-model="form.mobile"
                      placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop='code'>
            <!-- 支持栅格布局 -->
            <el-col :span="10">
              <el-input v-model="form.code"
                        placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10"
                    :offset="2">
              <el-button @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-login"
                       type="primary"
                       @click="handleLogin"
                       :loading="loginLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt' // gt.js 会向全局 window 暴露一个函数 initGeetest
export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据
        mobile: '17683753439',
        code: '',
        agree: '' // 是否同意用户协议
      },
      loginLoading: false, // 登录按钮的 loading 状态
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度在 6 个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null // 通过 initGeetest 得到极验验证码对象
    }
  },
  methods: {
    handleLogin () {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // >= 200 < 400 的状态码都会进入这里
        // Element 提供的 Message 消息提示组件，这也是组件调用的一种方式
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        this.loginLoading = false

        // 建议路由跳转都是用 name 去跳转，路由传参非常方便
        this.$router.push({
          name: 'home'
        })
      })
        .catch(err => { // >= 400 的 HTTP状态吗都会进入 catch 中
          if (err.response.status === 400) {
            this.$message.error('登陆失败，手机号或验证码错误')
          }
          this.loginLoading = false
        })
    },
    handleSendCode () {
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // 手机号码有效 初始化验证码插件
        this.showGeetest()
      })
    },
    showGeetest () {
      const { mobile } = this.form

      if (this.captchaObj) {
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏按钮式
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            captchaObj.verify()
          }).onSuccess(function () {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
              captchaObj.getValidate()
            //  调用 获取短信验证码（极验 API2）接口， 发送短信
            axios({
              method: '',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              console.log(res.data)
            })
          })
        })
      })
    }
  }
}

</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  background-image: url(../../assets/login_bg.jpg);
}
.login-form-wrap {
  background-color: #fff;
  padding: 50px;
  border-radius: 10px;

  .btn-login {
    width: 100%;
  }
}
.login-head {
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  img {
    width: 200px;
  }
}
</style>
