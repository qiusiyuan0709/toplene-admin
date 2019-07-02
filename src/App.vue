<template>
  <div id="app">
    <h1>{{ $store.state.count }}</h1>
    <button @click="$store.commit('increment')">点击提交mutation改变count</button>
    <button @click="$store.state.count++">点击提交mutation改变count</button>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;
}
</style>
