<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/syslogo.jpg" alt="宠物商城" width="45px">
        <span>管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体-->
    <el-container>

      <!--侧边栏目-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">

          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">

            <!--一级菜单的模板-->
            <template slot="title">

              <!--图标-->
              <i class="el-icon-location"></i>

              <!--文本-->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.authName}}
                </span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>

        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  export default {
    data() {
      return {
        //左侧菜单树
        menulist: [],
        isCollapse: false,
        //被激活的链接地址
        activePath: ""
      };
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push("/login");
      },
      async getMenuList() {
        const {data: res} = await this.$http.get("menus");
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menulist = res.data;
      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      //保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem("activePath", activePath);
      }
    }
  };
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    align-items: center;
    color: #fff;
    font-size: 20px;

  > div {
    display: flex;
    align-items: center;

  span {
    margin-left: 15px;
  }

  }
  }

  .el-aside {
    background-color: #333744;

  .el-menu {
    border-right: 0;
  }

  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
