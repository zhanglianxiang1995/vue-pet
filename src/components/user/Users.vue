<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible =true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :enterable="false" content="修改" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :enterable="false" content="分配权限" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          //和发邮箱
          return cb()
        }
        cb(new Error('请输入合法邮箱'))
      }

      //验证手机号的规则
      var checkmobile = (rule, value, cb) => {
        //验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/

        if (regMobile.test(value)) {
          //正确手机号
          return cb()
        }
        cb(new Error('请输入正确的手机号'))
      }
      return {
        //获取用户列表的参数
        queryInfo: {
          query: "",
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 2
        },
        userlist: [],
        total: 0,
        //添加用户对话框的显示和隐藏
        addDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
              min: 3,
              max: 10, message: '用户名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {
              min: 6,
              max: 15,
              message: '密码的长度在6~15个字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [{required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkmobile, trigger: 'blur'}
          ]
        },
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          email: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [{required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkmobile, trigger: 'blur'}
          ]
        },
        setRoleDialogVisible: false,
        userInfo: {},
        rolesList: [],
        selectedRoleId: ''
      }
    },
    created() {
      this.getUserList();
    }
    ,
    methods: {
      async getUserList() {
        const {data: res} = await
          this.$http.get("users", {
            params: this.queryInfo
          });
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！");
        }
        this.userlist = res.data.users;
        this.total = res.data.total;
        console.log(res);
      }
      ,
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      }
      ,
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      }
      ,
      //修改用户的状态
      async userStateChanged(userinfo) {
        console.log("状态：" + userinfo)
        const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("更新用户状态失败！")
        }
        this.$message.success("更新用户状态成功！")
      },
      //重置用户信息的弹框
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //新增用户
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          //可以发妻添加用户的网络请求
          const {data: res} = await this.$http.post("users", this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error("添加用户失败！")
          }
          this.$message.success("添加用户成功")
          this.addDialogVisible = false;
          this.getUserList()
        })
      },
      //修改用户信息弹框是否显示
      async showEditDialog(id) {
        const {data: res} = await this.$http.get("users/" + id)
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败")
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      //修改用户信息的弹框重置
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put("users/" + this.editForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
          if (res.meta.status !== 200) {
            this.$message.error("更新用户信息失败！")
          }
          this.$message.success("更新用户信息成功")
          this.editDialogVisible = false;
          this.getUserList()
        })
      },
      async removeUserById(id) {
        const confirmResult = await this.$confirm("确认删除该用户吗？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: "取消",
          type: "warning"
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info("已取消删除该用户！")
        }
        const {data: res} = await this.$http.delete("users/" + id)
        if (res.meta.status !== 200) {
          return this.$message.error("删除用户失败！")
        }
        this.$message.success("成功删除该用户！")
        this.getUserList()
      },
      async setRole(userInfo) {
        this.userInfo = userInfo
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error("获取角色列表失败！")
        }
        this.rolesList = res.data
        this.setRoleDialogVisible = true

      },
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error("请选择要分配的角色")
        }
        const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        })
        if (res.meta.status !== 200) {
          return this.$message.error("分配角色失败！")
        }
        this.$message.success("分配角色成功")
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      setRoleDialogClosed() {
        this.selectedRoleId = '',
          this.userInfo = []
      }
    }

  };
</script>
<style lang="less" scoped>
</style>
