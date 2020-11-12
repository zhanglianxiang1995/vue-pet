<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table :data="cateList" class="treeTable" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#"
                  border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level ===2">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>一级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>

        <!--添加分类的对话框-->

      </tree-table>

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

    <!-- 分配角色 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <div>
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged"
                         clearable change-on-select></el-cascader>
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        cateList: [],
        total: 0,
        columns: [{label: '分类名称', prop: 'cat_name'}, {label: '是否有效', type: 'template', template: 'isok'}, {label: '排序', type: 'template', template: 'order'}, {
          label: '操作',
          type: 'template',
          template: 'opt'
        }],
        addCateDialogVisible: false,
        addCateForm: {
          cat_name: '',
          cat_pid: 0,
          //分类的等级，默认要添加的是一级分类
          cat_level: 0
        },
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        parentCateList: [],
        cascaderProps: {value: 'cat_id', label: 'cat_name', children: 'children'},
        selectedKeys: []
      }

    },
    created() {
      this.getCateList()
    }
    ,
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get(`categories`, {params: this.queryInfo})
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类列表失败！")
        }
        this.cateList = res.data.result
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCateList();
      }
      ,
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getCateList();
      },
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      showAddCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        if (res.meta.status !== 200) {

          return this.$message.error("获取父级数据失败！")
        }
        this.parentCateList = res.data
      },
      parentCateChanged() {
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          const {data: res} = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error("添加分类失败！")
          }
          this.$message.success("分类添加成功！")
          this.getCateList()
          this.addCateDialogVisible = false
        })
      }
    }
  };
</script>
<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%
  }
</style>
