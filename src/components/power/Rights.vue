<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--权限列表区域-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column label="角色" prop="role_name"></el-table-column>
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
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>-->
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //权限列表
        rightsList: []
      }
    },
    created() {
      //获取所有权限
      this.getRightsList()
    },
    methods: {
      //获取权限列表
      async getRightsList() {
        const {data: res} = await this.$http.get('rights/list')
        if (res.meta.status !== 200) {
          return this.$message.error("获取权限列表失败！")
        }
        this.rightsList = res.data
        console.log(res.data)
      }
    }
  }
</script>

<style lang="less" scoped></style>
