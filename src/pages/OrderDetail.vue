<template>
  <div class="AddOrder" v-loading="loadingBg">
    <el-row>
      <el-col :span="24">
        <el-button type="danger" plain icon="el-icon-plus" size="small" :disabled="status == '投放'" @click="chooseOrder" style="float:right;">选择订单</el-button>
      </el-col>
      <el-col :span="24">
        <!-- 订单列表 -->
        <el-table class="MarginT_20"
          ref="selectTask"
          @select="selectRWD"
          @select-all="selectRWDAll"
          v-loading="loading"
          :data="addTableOrder"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <!-- <el-table-column
            prop="fselect"
            label="fselect"
            width="80"
            show-overflow-tooltip>
          </el-table-column> -->
          <!-- <el-table-column
            prop="uniqueSign"
            label="uniqueSign"
            show-overflow-tooltip>
          </el-table-column> -->
          <!-- <el-table-column
            label="checked">
            <template slot-scope="scope">
              <span>{{scope.row.checked ? 1: 0}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="uniqueSign"
            label="uniqueSign"
            show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column
            prop="单据编号"
            label="单据编号"
            width="110"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="日期"
            label="日期"
            width="110">
          </el-table-column>
          <el-table-column
            prop="交货日期"
            label="交货日期"
            width="110">
          </el-table-column>
          <el-table-column
            prop="物料名称"
            label="物料名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="物料代码"
            label="物料代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="规格型号"
            label="规格型号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="有无BOM单"
            label="有无BOM单"
            width="110">
          </el-table-column>
          <el-table-column
            prop="数量"
            label="数量"
            width="80">
          </el-table-column>
          <el-table-column
            prop="任务单数量"
            label="任务单数量"
            width="110">
            <template slot-scope="scope">
              <el-input v-model="scope.row['任务单数量']" @blur="changeRWNumber(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="单位"
            label="单位"
            width="60">
          </el-table-column>
          <el-table-column
            prop="购货单位"
            label="购货单位"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="部门"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="业务员"
            label="业务员"
            width="100">
          </el-table-column>
          <el-table-column v-if="status != '投放中' && status != '投放'"
            prop=""
            label="操作"
            width="60">
            <template slot-scope="scope">
              <i class="el-icon-delete CursorPointer" @click="moveLine(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="MarginT_20">
        <!-- <el-button size="small" type="danger" :loading="btLoading" :disabled="status == '投放'" @click="showGX">勾选项</el-button> -->
        <el-button size="small" type="danger" :loading="btLoading" :disabled="status == '投放中' || status == '投放'" @click="submit">保 存</el-button>
        <el-button size="small" type="success" :loading="btLoading" @click="operate('运算')" :disabled="status == '投放中' || status == '投放'">运 算</el-button>
        <el-button size="small" type="warning" :loading="btLoading" @click="operate('申请单投放')" :disabled="status == '' || FSourceClosed == 1">申请单投放</el-button>
        <el-button size="small" type="warning" :loading="btLoading" @click="operateRWD('任务单投放')" :disabled="status == ''">任务单投放</el-button>
        <el-button size="small" type="primary" :loading="btLoading" @click="seeReport">运算报告</el-button>
        <el-button size="small" type="info" :loading="btLoading" :disabled="status == '投放' || status == '投放中'" @click="delReport">整单删除</el-button>
      </el-col>
    </el-row>
    <!-- 添加订单 -->
    <el-dialog title="订单选择" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="800px">
      <div>
        <el-row class="MarginT_10">
          <el-col :span="24">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="订单号" size="small">
                <el-input v-model="filterOrderNo" icon="el-icon-search" size="small" placeholder="请输入订单号"></el-input>
              </el-form-item>
              <el-form-item size="small">
                <el-button type="primary" size="small" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table
          ref="tableSelectedList"
          @select="selectSingle"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          :data="orderList"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <!-- <el-table-column
            label="checked">
            <template slot-scope="scope">
              <span>{{scope.row.checked ? 1: 0}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="uniqueSign"
            label="uniqueSign"
            show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column
            prop="单据编号"
            label="单据编号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="日期"
            label="日期"
            width="110">
          </el-table-column>
          <el-table-column
            prop="交货日期"
            label="交货日期"
            width="110">
          </el-table-column>
          <el-table-column
            prop="物料名称"
            label="物料名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="物料代码"
            label="物料代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="规格型号"
            label="规格型号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="数量"
            label="数量"
            width="100">
          </el-table-column>
          <el-table-column
            prop="单位"
            label="单位"
            width="60">
          </el-table-column>
          <el-table-column
            prop="购货单位"
            label="购货单位"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="部门"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="业务员"
            label="业务员"
            width="100">
          </el-table-column>
        </el-table>
        <el-pagination v-if="orderList.length > 0" style="margin: 10px 0;"
          @current-change="handleCurrentChange"
          :current-page.sync="curPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="sum">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="sureChoosAll">添加全部</el-button>
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChoosed">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 运算报告 -->
    <el-dialog
      title="运算报告"
      :visible.sync="dialogVisibleReport"
      fullscreen>
      <OperationalReport :timeStamp="timeStamp" :orderMRPId="orderMRPId" :status="status"/>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleReport = false">关 闭</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Message } from 'element-ui'
// import $ from 'jquery'
import {objDeepCopy} from '../util/utils'
import OperationalReport from '../components/OperationalReport'
export default {
  name: 'AddOrder',
  data () {
    return {
      loading: false,
      loadingBg: false,
      btLoading: false,
      dialogAddVisible: false,
      dialogVisibleReport: false,
      status: '',
      FICMOClosed: 0, // 任务单投放（0未投放，1已投放）
      FSourceClosed: 0, // 申请单投放（0未投放，1已投放）
      filterOrderNo: '',
      orderList: [],
      curPage: 1,
      pageSize: 5,
      sum: 0,
      addTableOrder: [],
      selectedAllList: [],
      selectedUniqueSignList: [],
      timeStamp: '',
      selectTask: [] // 勾选的任务单列表
    }
  },
  computed: {
    ...mapState({
      orderMRPId: state => state.orderMRPId,
      userInfo: state => state.userInfo
    })
  },
  created () {
    this.getDetail()
    this.getOrderList()
  },
  watch: {
    selectedAllList: function (newVal) {
      this.addTableOrder = newVal
    }
  },
  components: {
    OperationalReport
  },
  methods: {
    moveLine (row) {
      this.$confirm('确认移除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectSingle([], row)
      }).catch(() => {
      })
    },
    chooseOrder () {
      this.handleCurrentChange()
      this.dialogAddVisible = true
    },
    search () {
      this.curPage = 1
      this.handleCurrentChange()
    },
    // 提交
    submit () {
      if (this.addTableOrder.length === 0) {
        this.$message({
          message: '请至少添加一条订单记录!',
          type: 'warning'
        })
        return false
      }
      let Data = {
        'items': this.addTableOrder
      }
      this.btLoading = true
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_Insert xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(Data) + '</FJSON>'
      tmpData += '<FBiller>' + this.userInfo.fname + '</FBiller>'
      tmpData += '<ID>' + this.orderMRPId + '</ID>'
      tmpData += '</MRP_Insert>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'
      this.Send.post('MRP_Insert', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('MRP_InsertResponse')[0].getElementsByTagName('MRP_InsertResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = (JSON.parse(HtmlStr))[0]
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.MRP_InsertResponse.MRP_InsertResult
        let Info = (JSON.parse(Result))[0]
        if (Info.code === '1') {
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.getDetail()
          this.btLoading = false
        } else if (Info.code === '2') {
          this.$message({
            message: '保存失败，有未投放完的单据!',
            type: 'warning'
          })
          this.btLoading = false
        } else {
          this.$message({
            message: '修改失败!',
            type: 'error'
          })
          this.btLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
      })
    },
    sureChoosed () {
      this.addTableOrder = this.selectedAllList
      this.dialogAddVisible = false
    },
    // 选择添加筛选的全部数据
    sureChoosAll () {
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += "<FSQL><![CDATA[exec [Z_MRP_SeorderAll]'" + this.filterOrderNo + "']]></FSQL>"
      tmpData += '</JA_LIST>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('JA_LIST', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('JA_LISTResponse')[0].getElementsByTagName('JA_LISTResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = JSON.parse(HtmlStr)
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
        let Info = JSON.parse(Result)
        // console.log('All', Info)
        // this.addTableOrder = Info.map((item, idx) => {
        //   item.idx = idx
        //   item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
        //   this.selectSingle([], item)
        //   return item
        // })
        Info.map((item, idx) => {
          item.idx = idx
          item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
          if (!item.checked) {
            this.selectSingle([], item)
          }
          return item
        })
        this.addTableOrder = this.selectedAllList
        this.handleCurrentChange()
        this.dialogAddVisible = false
      }).catch((error) => {
        console.log(error)
      })
    },
    // 工单列表的勾选切换
    async handleSelectionChange (curSelection) {
    },
    selectAll (selection) {
      if (selection.length === 0) { // 本页全部取消勾选
        this.orderList.map(order => {
          this.selectSingle([], order)
        })
      } else { // 本页全部加入勾选
        this.orderList.map(order => {
          if (!order.checked) {
            this.selectSingle([], order)
          }
        })
      }
    },
    // 单独勾选取消时从列表移除
    selectSingle (selection, row) {
      // console.log('selectSingle', row)
      if (row.checked) { // 取消勾选
        let temp = objDeepCopy(this.selectedAllList)
        temp.map((item, idx) => {
          if (item.uniqueSign === row.uniqueSign) {
            this.orderList[row.idx].checked = false
            this.selectedAllList.splice(idx, 1)
            let index = this.selectedUniqueSignList.indexOf(row.uniqueSign)
            if (index > -1) {
              this.selectedUniqueSignList.splice(index, 1)
            }
          }
        })
      } else { // 加入勾选
        // 再次检查重复
        let index = this.selectedUniqueSignList.indexOf(row.uniqueSign)
        if (index === -1) {
          row.checked = true
          this.selectedUniqueSignList.push(row.uniqueSign)
          this.selectedAllList.push(row)
        }
      }
    },
    async handleCurrentChange () {
      let curList = await this.getOrderList()
      if (this.selectedAllList.length > 0) {
        this.selectedAllList.map((itemS) => {
          curList.map((item, idx) => {
            if (item.uniqueSign === itemS.uniqueSign) {
              this.$refs.tableSelectedList.toggleRowSelection(curList[idx], true)
              this.orderList[idx].checked = true
            }
          })
        })
      }
    },
    operate (type) {
      this.loadingBg = true
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_Status xmlns="http://tempuri.org/">'
      tmpData += '<FType>' + type + '</FType>'
      tmpData += '<ID>' + this.orderMRPId + '</ID>'
      tmpData += '</MRP_Status>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('MRP_Status', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('MRP_StatusResponse')[0].getElementsByTagName('MRP_StatusResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = (JSON.parse(HtmlStr))[0]
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.MRP_StatusResponse.MRP_StatusResult
        let Info = (JSON.parse(Result))[0]
        // console.log('operate', Info)
        if (Info.code === '1' || Info.code === 1) {
          this.$message({
            message: type + '成功!',
            type: 'success'
          })
          this.loadingBg = false
          this.getDetail()
        } else if (Info.code === '2' || Info.code === 2) {
          this.$message({
            message: '您还存在未投放的单子，不能进行运算!',
            type: 'warning'
          })
          this.loadingBg = false
        } else if (Info.code === '3' || Info.code === 3) {
          this.$message({
            message: '您还存在未审核的采购申请单，不能进行运算!',
            type: 'warning'
          })
          this.loadingBg = false
        } else {
          this.$message({
            message: type + '失败!',
            type: 'error'
          })
          this.loadingBg = false
        }
      }).catch((error) => {
        console.log(error)
        this.loloadingBgading = false
      })
    },
    // 任务单投放
    operateRWD () {
      if (this.selectTask.length === 0) {
        this.$message({
          message: '请先选择需要投放的单据!',
          type: 'warning'
        })
        return false
      }
      let Data = {
        'items': this.selectTask
      }
      this.btLoading = true
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_ICMO xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(Data) + '</FJSON>'
      tmpData += '<ID>' + this.orderMRPId + '</ID>'
      tmpData += '</MRP_ICMO>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'
      this.Send.post('MRP_ICMO', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('MRP_ICMOResponse')[0].getElementsByTagName('MRP_ICMOResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = (JSON.parse(HtmlStr))[0]
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.MRP_ICMOResponse.MRP_ICMOResult
        let Info = (JSON.parse(Result))[0]
        if (Info.code === '1') {
          this.$message({
            message: '任务单投放成功!',
            type: 'success'
          })
          this.btLoading = false
          this.selectTask = []
          this.getDetail()
        } else {
          this.$message({
            message: '任务单投放失败!',
            type: 'error'
          })
          this.btLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
      })
    },
    // 任务单单独投放勾选
    selectRWD (selection, row) {
      if (row.fselect !== 2 && !row.checkedRW && row['有无BOM单'] === 'Y') {
        row.checkedRW = true
        this.selectTask.push(row)
      } else {
        if (row.fselect === 2 || row['有无BOM单'] === 'N') {
          Message.closeAll()
          Message.warning({
            message: '该记录不满足投放条件，不可勾选!'
          })
          // this.$message({
          //   message: '该记录不满足投放条件，不可勾选!',
          //   type: 'warning'
          // })
        }
        this.$refs.selectTask.toggleRowSelection(row, false)
        this.selectTask.map((item, idx) => {
          if (item.uniqueSign === row.uniqueSign) {
            this.addTableOrder[row.idx].checkedRW = false
            this.selectTask.splice(idx, 1)
          }
        })
      }
    },
    // 任务单全选
    selectRWDAll (selection) {
      if (selection.length === 0) { // 本页全部取消勾选
        this.addTableOrder.map(order => {
          this.selectRWD([], order)
        })
      } else { // 本页全部加入勾选
        this.addTableOrder.map(order => {
          if (!order.checkedRW) {
            this.selectRWD([], order)
          }
        })
      }
    },
    seeReport () {
      this.timeStamp = (new Date()).getTime()
      this.dialogVisibleReport = true
    },
    delReport () {
      this.$confirm('该操作将彻底删除整张单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sureDel()
      }).catch(() => {
      })
    },
    sureDel () {
      this.btLoading = true
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_DEL xmlns="http://tempuri.org/">'
      tmpData += '<ID>' + this.curReportId + '</ID>'
      tmpData += '</MRP_DEL>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'
      this.Send.post('MRP_DEL', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('MRP_DELResponse')[0].getElementsByTagName('MRP_DELResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = (JSON.parse(HtmlStr))[0]
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.MRP_DELResponse.MRP_DELResult
        let Info = (JSON.parse(Result))[0]
        if (Info.code === '1') {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.$router.push({name: 'MRPList'})
        } else {
          this.$message({
            message: '删除失败!',
            type: 'error'
          })
          this.btLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
      })
    },
    changeRWNumber (row) {
      let Data = {
        'items': [{FOrderInterID: row.FOrderInterID, FOrderEntryID: row.FOrderEntryID, FAuxqty: row['任务单数量']}]
      }
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_FAuxqty xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(Data) + '</FJSON>'
      tmpData += '</MRP_FAuxqty>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'
      this.Send.post('MRP_FAuxqty', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('MRP_FAuxqtyResponse')[0].getElementsByTagName('MRP_FAuxqtyResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = (JSON.parse(HtmlStr))[0]
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.MRP_FAuxqtyResponse.MRP_FAuxqtyResult
        let Info = (JSON.parse(Result))[0]
        if (Info.code === '1') {
          // this.$message({
          //   message: '任务单投放成功!',
          //   type: 'success'
          // })
        } else {
          this.$message({
            message: '数量修改失败!',
            type: 'error'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getOrderList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
        tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
        tmpData += '<soap:Body> '
        tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
        tmpData += "<FSQL><![CDATA[exec [Z_MRP_Seorder] '" + this.filterOrderNo + "'," + Number((this.curPage - 1) * this.pageSize + 1) + ',' + this.curPage * this.pageSize + ']]></FSQL>'
        tmpData += '</JA_LIST>'
        tmpData += '</soap:Body>'
        tmpData += '</soap:Envelope>'

        this.Send.post('JA_LIST', tmpData
        ).then(res => {
          // let xml = res.data
          // let parser = new DOMParser()
          // let xmlDoc = parser.parseFromString(xml, 'text/xml')
          // // 提取数据
          // let Result = xmlDoc.getElementsByTagName('JA_LISTResponse')[0].getElementsByTagName('JA_LISTResult')[0]
          // let HtmlStr = $(Result).html()
          // let Info = JSON.parse(HtmlStr)
          // 解析
          let xmlData = this.$x2js.xml2js(res.data)
          let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
          let Info = JSON.parse(Result)
          if (Info.length > 0) {
            this.orderList = Info.map((item, idx) => {
              item.idx = idx
              item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
              item.checked = false
              return item
            })
            this.sum = Info[0].fcount
            this.loading = false
            resolve(Info)
          } else {
            this.orderList = []
            this.sum = []
            this.loading = false
            resolve([])
          }
        }).catch((error) => {
          console.log(error)
          this.loading = false
        })
      })
    },
    getDetail () {
      this.loading = true
      this.addTableOrder = []
      this.selectedAllList = []
      this.selectedUniqueSignList = []
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += "<FSQL><![CDATA[select * from Z_MRPDetail where finterid='" + this.orderMRPId + "']]></FSQL>"
      tmpData += '</JA_LIST>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Send.post('JA_LIST', tmpData
      ).then(res => {
        // let xml = res.data
        // let parser = new DOMParser()
        // let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // // 提取数据
        // let Result = xmlDoc.getElementsByTagName('JA_LISTResponse')[0].getElementsByTagName('JA_LISTResult')[0]
        // let HtmlStr = $(Result).html()
        // let Info = JSON.parse(HtmlStr)
        // 解析
        let xmlData = this.$x2js.xml2js(res.data)
        let Result = xmlData.Envelope.Body.JA_LISTResponse.JA_LISTResult
        let Info = JSON.parse(Result)
        // console.log('Detail', Info)
        if (Info.length > 0) {
          this.status = Info[0]['状态']
          this.FSourceClosed = Info[0]['FSourceClosed']
          this.FICMOClosed = Info[0]['FICMOClosed']
          this.curReportId = Info[0].FInterID
          this.selectedAllList = Info.map((item, idx) => {
            item.idx = idx
            item['单据编号'] = item['订单单号']
            item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
            item.checked = true
            item.checkedRW = false
            this.addTableOrder.push(item)
            this.selectedUniqueSignList.push(item.uniqueSign)
            return item
          })
        }
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    showGX () {
      console.log(this.selectTask)
    }
  }
}
</script>

<style scoped>
.AddOrder{
  padding: 10px 0;
}
</style>
