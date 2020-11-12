<template>
  <div class="login_container">
    <img src="../assets/bj.jpg" width="100%" height="100%" alt="">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/petlog.jpg" alt="">
      </div>
      <el-form :model="loginfrom" ref="loginFromRel" :rules="loginFromRules" label-width="0px" class="login_from">
        <!-- 用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="loginfrom.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" type="password" v-model="loginfrom.password"></el-input>
        </el-form-item>

        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //这是登录表单的数据绑定对象
        loginfrom: {
          username: 'admin',
          password: '123456'
        },
        loginFromRules: {
          username: [
            {required: true, message: "请输入登录账号", triggerb: blur()},
            {min: 3, max: 15, message: "请输入长度在3 — 15个左右的字母", triggerb: blur()}
          ],
          password: [
            {required: true, message: "请输入登录密码", triggerb: blur()},
            {min: 6, max: 15, message: "请输入长度在6 — 15个左右的字母", triggerb: blur()}
          ]
        }
      }
    }
    ,
    methods: {
      //重置按钮事件
      resetLoginFrom() {
        //获取ref 应用并重置表单
        this.$refs.loginFromRel.resetFields();
      },
      //校验
      login() {
debugger
        this.$refs.loginFromRel.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post('login', this.loginfrom);
          if(typeof res.value!= "undefined"){
                  console.log("qwe")
                }else{
              console.log("asd")
                }
          if (res.meta.status !== 200) return this.$message.error('登录失败，请重新确认用户名和密码！');
          this.$message.success('登录成功');
          window.sessionStorage.setItem('token', res.data.token);
          this.$router.push('/home')
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  }

  .login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

</style>
