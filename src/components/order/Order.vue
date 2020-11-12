<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
        </el-col>
      </el-row>


      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="80px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="170px">
        </el-table-column>
        <el-table-column label="发货时间" prop="create_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddressDialog"></el-button>
            <el-button type="success" size="mini" icon="el-icon-delete" @click="showProgressBox"></el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
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
        :total="total" background="">
      </el-pagination>
    </el-card>


    <!-- 修改地址 -->
    <el-dialog title="修改订单地址" :visible.sync="addressDialogVisible" width="50%" @close="addressDialogClosed">
      <div>
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>

        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 物流进度 -->
    <el-dialog title="物流进度" :visible.sync="proressDialogVisible" width="50%" @close="proressDialogClosed">
      <div>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in proressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proressDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from "./citydata.js";

  export default {
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        orderlist: [],
        addressDialogVisible: false,
        addressForm: {
          address1: [],
          address2: ""
        },
        addressFormRules: {
          address1: [
            {required: true, message: "请输入省区县", trigger: "blur"}
          ],
          address2: [{required: true, message: "请输入地址", trigger: "blur"}]
        },
        cityData,
        proressDialogVisible: false,
        proressInfo: []
      };
    },
    created() {
      this.getOrderList();
    },
    methods: {
      async getOrderList() {
        const {data: res} = await this.$http.get("orders", {
          params: this.queryInfo
        });
        if (res.meta.status !== 200) {
          return this.$message.error("获取订单列表失败");
        }
        this.total = res.data.total;
        this.orderlist = res.data.goods;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },
      showAddressDialog() {
        this.addressDialogVisible = true;
      },
      async showProgressBox() {
        const {data: res} = await this.$http.get("/kuaidi/804909874412544580");
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.proressInfo = res.data;
        this.proressDialogVisible = true
      }
    }
  }
  ;
</script>
<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
