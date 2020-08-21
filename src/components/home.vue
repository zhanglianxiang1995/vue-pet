<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
    登录成功
  </div>
</template>

<script>
  export default {
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push("/login")
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
