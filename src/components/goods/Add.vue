<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>


      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息">
        </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="hangdleChange"
                           clearable change-on-select></el-cascader>
            </el-form-item>
          </el-tab-pane>


          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>


          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>


          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>


          <el-tab-pane label="商品内容" name="4" prop="goods_cat">
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>


    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        activeIndex: 0,
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          pics: [],
          goods_introduce: '',
          attrs: []
        },
        addFormRules: {
          goods_name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
          goods_price:
            [{required: true, message: '请输入商品价格', trigger: 'blur'}],
          goods_weight:
            [{required: true, message: '请输入商品重量', trigger: 'blur'}],
          goods_number:
            [{required: true, message: '请输入商品数量', trigger: 'blur'}],
          goods_cat:
            [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        },
        catelist: [],
        cateProps: {value: 'cat_id', label: 'cat_name', children: 'children'},
        manyTableData: [],
        onlyTableData: [],
        uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        previewVisible: false,
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类数据失败')
        }
        this.catelist = res.data
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      }
      ,
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      async removeById(id) {
        const confirmResult = await
          this.$confirm('此操作将永久删除该商品,是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('取消删除！')
        }
        const {data: res} = await
          this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error("删除商品失败!")
        }
        this.$message.success("删除商品成功!")
        this.getGoodsList()
      },
      goAddpage() {
        this.$router.push('/goods/add')
      },
      hangdleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }

      },
      beforeTabLeave(activeName, oldActiveName) {
        console.log('离开' + oldActiveName)
        console.log('进入' + activeName)
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      async tabClicked() {
        if (this.activeIndex === '1') {
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}})
          if (res.meta.status !== 200) {
            return this.$message.error("获取动态参数列表失败!")
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals = item.attr_vals.split(' ') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          this.manyTableData = res.data
        } else if (this.activeIndex === '2') {
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}})
          if (res.meta.status !== 200) {
            return this.$message.error("获取静态属性失败!")
          }
          this.onlyTableData = res.data
        }
      },
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.previewVisible = true
      },
      handleRemove() {
        const filePath = file.response.data.tmp_path
        const i = this.addForm.pics.findIndex(x => x.pic === filePath)
        this.addForm.pics.splice(i, 1)

      },
      handleSuccess(response) {
        //1.拼接得到一个图片信息对象
        const picInfo = {pic: response.data.tem_path}
        this.addForm.pics.push(picInfo)
      },
      add() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项')
          }
          //执行添加的逻辑
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(",")


          //处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })

          //静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs

          //发起添加请求
          const {data: res} = await this.$http.post('goods', form)
          if (res.meta.status !== 201) {
            return this.$message.error("添加商品失败")
          }
          this.$message.success("添加商品成功")
          this.$router.push("/goods")
        })
      }

    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }
  }
</script>
<style lang="less" scoped>

  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px !important;
  }

</style>
