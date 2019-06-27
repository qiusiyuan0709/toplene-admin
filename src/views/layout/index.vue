<template>
  <el-container>
    <el-aside width="200px">
      <AppAside />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main>
        <!-- layout组件的路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 这里的内容是Home，发布文章，评论管理
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'layout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-aside {
  background-color: #d0dce7;
}

.el-header {
  background-color: #aec0d1;
}

.el-main {
  background-color: #e8eff4;
}
</style>
