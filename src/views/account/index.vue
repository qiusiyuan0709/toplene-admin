<!-- 组件说明 -->
<template>
  <div>
    <el-card>
      <div slot="header">
        <span>账户设置{{ $store.state.count }}</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-form>
            <el-form-item label="媒体名称">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>

            <el-form-item label="媒体简介">
              <el-input v-model="userInfo.intro"></el-input>
            </el-form-item>

            <el-form-item label="头条号ID">
              <el-input disabled
                        :value="userInfo.id && userInfo.id.toString()"></el-input>
            </el-form-item>

            <el-form-item label="绑定手机">
              <el-input disabled
                        :value="userInfo.mobile"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary"
                         @click="handleUpdate">保存更新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2"
                :span="4">
          <!--
                  以下是updata上传组件自己的提交图片方式，默认自动提交请求，但是是POST方式
                  我们接口限制是 PATCH 方式，所以不支持自动提交，以后可以视情况来用
                 -->
          <!-- <el-upload class="avatar-uploader"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :headers="{ Authorization: token }"
                     name="photo"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="userInfo.photo"
                 :src="userInfo.photo"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->

          <el-upload class="avatar-uploader"
                     action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload"
                     :http-request="handleUpload">
            <img class="avatar"
                 v-if="userInfo.photo"
                 :src="userInfo.photo">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
// import x from ''
export default {
  name: 'AccountSetting',
  data () {
    return {
      userInfo: {},
      token: `Bearer ${JSON.parse(window.localStorage.getItem('user_info')).token}` }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo () {
      this.$http({
        method: 'GET',
        url: '/user/profile'
      }).then(data => {
        this.userInfo = data
      })
    },

    handleUpdate () {
      const { name, intro, email } = this.userInfo
      this.$http({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          name,
          intro,
          email
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '更新用户信息成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新用户信息失败')
      })
    },

    handleAvatarSuccess () { },
    beforeAvatarUpload () { },
    handleUpload (uploadConfig) {
      // axios 上传文件
      // 1.构建一个 FormData 表单对象
      //   将文件对象添加到 FormData 中
      // 2.将 FormData配置到请求体 data 选项中
      const formData = new FormData()
      formData.append('photo', uploadConfig.file)
      this.$http({
        method: 'PATCH',
        url: '/user/photo',
        data: formData
      }).then(data => {
        this.userInfo.photo = data.photo
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
