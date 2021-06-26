<template>
    <div>
        <div class="container">
            <div class="crumb">
                <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>字典</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="handle-box">
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="handleAdd"
                >新增字典</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.dicName" placeholder="字典名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="pageData"
                border
                class="table"
                ref="multipleTable"
                v-loading="listLoading"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column prop="typeName" label="名称" align="center"></el-table-column>
                <el-table-column prop="typeCode" label="编码" align="center"></el-table-column>
                <el-table-column prop="modifier" label="字典值" align="center">
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="query.page"
                    :page-sizes="[1,2,5,10]"
                    :page-size="query.pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 新增字典 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="80%">
            <el-form ref="addform" :model="addform" label-width="70px" :rules="addrules">
                <el-form-item label="字典名称 " prop="typeName" label-width="100px">
                    <el-input v-model="addform.typeName" ></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="typeCode" label-width="100px">
                    <el-input v-model.number="addform.typeCode"></el-input>
                </el-form-item>
                <el-table
                    :data="addform.dictionaryDetails"
                    border
                    class="dicTable"
                >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="字典值">
                        <template slot-scope="scope">
                            <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.name"></el-input>
                            <span v-show="!scope.row.show">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="序号">
                        <template slot-scope="scope">
                            <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.value"></el-input>
                            <span v-show="!scope.row.show">{{scope.row.value}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="默认值" >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.isDefault" placeholder="默认值">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </template>

                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="addDictEdit(scope.$index,scope.row)">编辑</el-button>
                            <el-button @click.native.prevent="handleDeleteAdd(scope.$index,scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <el-button class="handle-del add"
                           @click="addRow">添加</el-button>
            </el-form>
            <span slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveAdd">提 交</el-button>
    </span>
        </el-dialog>

        <!-- 编辑字典 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="60%">
            <el-form ref="editform" :model="editform" label-width="70px" >
                <el-form-item label="名称">
                    <el-input v-model="editform.typeName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="editform.typeCode" :disabled="true"></el-input>
                </el-form-item>
                <el-table :data="editValue"
                          border
                          class="dicTable"
                          row-key="date"
                >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="name" label="字典值"  align="center" width="120px">
                        <template slot-scope="scope">
                            <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.name"></el-input>
                            <span v-show="!scope.row.show">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="序号" align="center">
                        <template slot-scope="scope">
                            <el-input placeholder=" " v-show="scope.row.show" v-model="scope.row.value"></el-input>
                            <span v-show="!scope.row.show">{{scope.row.value}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isDefault" label="默认值" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.isDefault" placeholder="默认值">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="280px" align="center">
                        <template slot-scope="scope">
                            <el-button @click="saveEdit(scope.$index,scope.row)">保存</el-button>
                            <el-button @click.native.prevent="handleDeleteEditAdd(scope.$index,scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="handle-del add"
                           @click="addEditRow">添加</el-button>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false;">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
import {
  addDict,
  getDictPage,
  getEditValue,
  updateEditVal,
  delEditVal,
  delDictVal,
  getPageDict,
  getFinnalDict,
  queryDict
} from '../../api/api'
import Sortable from 'sortablejs'
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        page: 1, // 当前页码
        pageSize: 5,
        dicName: ''
      },
      total: 0,
      pageData: [],
      listLoading: false,
      valueData: [],
      selectTotal: 0,
      multipleSelection: [],
      delList: [],
      delIdList: [],
      editVisible: false,
      addVisible: false,
      editform: {
        typeName: ' ',
        typeCode: ' ',
        value: ' ',
        name: ' ',
        isDefault: ' '
      },
      editValue: [],
      addform: {
        typeName: '',
        typeCode: '',
        dictionaryDetails: [{ name: ' ', value: '0', show: false, isDefault: '0'}]

      },
      addrules: {
        typeName: [{required: true, message: '请输入字典名称', trigger: 'blur'}],
        typeCode: [{required: true, message: '请输入编码', trigger: 'blur'}]
      },
      idx: -1,
      id: -1
    }
  },
  created () {
    this.getPageData(),
    this.$watch('query.dicName', (newVal, oldVal) => {
      if (newVal == '') {
        this.getPageData()
      }
    })
  },
  methods: {
    // 新增操作
    handleAdd () {
      this.addVisible = true
    },
    addRow () {
      let list = {
        name: ' ',
        value: '',
        show: false,
        isDefault: '0'
      }
      this.addform.dictionaryDetails.push(list)
      for (let i = 0; i < this.addform.dictionaryDetails.length; i++) {
        this.addform.dictionaryDetails[i].value = i
      }
    },
    addEditRow () {
      let list = {
        id: '',
        name: ' ',
        value: '',
        show: true,
        isDefault: '0'
      }
      this.editValue.push(list)
    },
    addDictEdit (index, row) {
      for (let i = 0; i < this.addform.dictionaryDetails.length; i++) {
        this.addform.dictionaryDetails[i].show = false
      }
      this.addform.dictionaryDetails[index].show = true
    },
    // 移动操作
    // 向上移动
    // moveUp (index, row) {
    //   let that = this
    //   if (index > 0) {
    //     let upDate = that.editValue[index - 1]
    //     that.editValue.splice(index - 1, 1)
    //     that.editValue.splice(index, 0, upDate)
    //     // let obj = JSON.stringify(this.editValue)
    //     // console.log(obj);
    //   } else {
    //     alert('已经是第一条，不可上移')
    //   }
    // },
    // // 向下移动
    // moveDown (index, row) {
    //   let that = this
    //   if ((index + 1) === that.editValue.length) {
    //     alert('已经是最后一条，不可下移')
    //   } else {
    //     let downDate = that.editValue[index + 1]
    //     that.editValue.splice(index + 1, 1)
    //     that.editValue.splice(index, 0, downDate)
    //   }
    // },

    // 新增字典的删除操作
    handleDeleteAdd (index, row) {
      this.addform.dictionaryDetails.splice(index, 1)
    },

    // 新增字典
    saveAdd () {
      this.$refs.addform.validate(valid => {
        if (valid) {
          let param = this.addform
          console.log(param)
          addDict(param).then(res => {
            if (res.code == '102') {
              alert('已提交，请勿重复提交')
            } else if (res.code == '201') {
              this.addform = {
                typeName: '',
                typeCode: '',
                dictionaryDetails: [{ name: ' ', value: '0', show: false, isDefault: '0'}]

              },
              this.$message.success('添加成功')
              this.getPageData()
              // this.$message.success("请刷新页面以显示数据");
            }
          })
          this.addVisible = false
        }
      })
    },
    // 编辑操作
    handleEdit (index, row) {
      this.editVisible = true
      this.idx = index
      this.editform = Object.assign({}, row)
      let a = {typeCode: this.editform.typeCode}
      getEditValue(a).then((res) => {
        let jsonObj = JSON.parse(JSON.stringify(res.data))
        this.editValue = jsonObj
        for (let i = 0; i < this.editValue.length; i++) {
          this.editValue[i].show = true
          this.editValue[i].isDefault = this.editValue[i].isDefault == '0' ? '0' : '1'
        }
      })
    },

    // 保存编辑
    saveEdit (index, row) {
      var updateVal = {typeCode: this.editform.typeCode, id: row.id, value: row.value, name: row.name, isDefault: row.isDefault}
      console.log(updateVal)
      updateEditVal(updateVal).then((res) => {
        this.getPageData()
        this.handleEdit(index, row)
        this.$message.success(`保存成功`)
      })
    },
    // 编辑字典的删除操作
    // 再.then之后重新获取数据就可以刷新页面数据
    handleDeleteEditAdd (index, row) {
      let params = {typeCode: row.typeCode, value: row.value}
      this.editValue.splice(index, 1)
      delEditVal(params).then((res) => {
        this.getPageData()
      })
    },
    // 最终编辑提交

    // 删除字典项
    handleDelete (index, row) {
      if (confirm('确认删除吗？') == true) {
        let params = {typeCode: row.typeCode}
        delDictVal(params).then((res) => {
          this.$message.success('删除成功')
          this.getPageData()
        })
      }
    },
    // 触发搜索按钮
    handleSearch () {
      let para = {typeName: this.query.dicName}
      queryDict(para).then((res) => {
        this.pageData = res.data
      })
    },

    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delAllSelection () {
      const length = this.multipleSelection.length
      if (length == 0) {
        this.$message.error('请至少选中一项！')
      } else {
        let str = ''
        this.delList = this.delList.concat(this.multipleSelection)
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].dicName + ' '
          this.delIdList.push(this.multipleSelection[i].dicId)
        }
        this.deleteDicBatch()
        this.$message.error(`删除了${str}`)
        this.multipleSelection = []
      }
    },
    // 获取页面数据
    getPageData () {
      let para = {pageNum: this.query.page, pageSize: this.query.pageSize}
      this.listLoading = true
      getPageDict(para).then((res) => {
          //console.log(res.data)
        this.total = res.data.pageInfo.total
        this.pageData = res.data.pageInfo.list
        for (let i = 0; i < this.pageData.length; i++) {
          this.valueData = this.pageData[i].dictionaryDetails
          let data = ''
          for (let j = 0; j < this.valueData.length; j++) {
            data += this.valueData[j].name + ' '
          }
          this.pageData[i].modifier = data
        }
        this.listLoading = false
      })
    },
    handlePageChange (val) {
      this.$set(this.query, 'page', val)
      this.getPageData()
    },
    handleSizeChange (val) {
      this.$set(this.query, 'pageSize', val)
      this.getPageData()
    }

  }
  // mounted() {
  //   const table = document.querySelector('.el-table__body-wrapper tbody')
  //   const self = this
  //   Sortable.create(table, {
  //     onEnd({ newIndex, oldIndex }) {
  //       const targetRow = self.editValue.splice(oldIndex, 1)[0]
  //       self.editValue.splice(newIndex, 0, targetRow)
  //     }
  //   })
  // }
}
</script>
<style scoped>
.container {
    margin-top: 8px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px 10px;
    background-color: #FFFFFF;
    height: 100vh;
    border-radius: 5px;
}
.crumbs{
    margin-left: 2px;
}
.handle-box {
    margin-top: 20px;
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.dicTable{
    width: 90%;
    font-size: 14px;
    align: center;
    margin-left: 5%;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.add{
    margin-left: 5%;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
