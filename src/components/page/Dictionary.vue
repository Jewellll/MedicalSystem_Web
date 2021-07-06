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
                :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"
            >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column prop="typeName" label="名称" align="center"></el-table-column>
                <el-table-column prop="typeCode" label="编码" align="center"></el-table-column>
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
                                <el-option label="是" :value='1'></el-option>
                                <el-option label="否" :value='0'></el-option>
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
            <el-form  :model="editform" label-width="70px" >
                <el-form-item label="名称">
                    <el-input v-model="editform.typeName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="editform.typeCode" :disabled="true"></el-input>
                </el-form-item>
                <el-table :data="editValue"
                          border
                          class="dicTable"
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
                                <el-option label="是" :value='1'></el-option>
                                <el-option label="否" :value='0'></el-option>
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
  getEditValue,
  updateEditVal,
  delEditVal,
  getPageDict,
  queryDict, deleteDicBatch
} from '../../api/api'

import qs from 'qs'
import axios from 'axios'
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
        value: -1,
        name: '',
        isDefault: ''
      },
      editValue: [],
      addform: {
        typeName: '',
        typeCode: '',
        dictionaryDetails: [{ name: ' ', value: 0, show: false, isDefault: 0}]

      },
      addrules: {
        typeName: [{required: true, message: '请输入字典名称', trigger: 'blur'}],
        typeCode: [{required: true, message: '请输入编码', trigger: 'blur'}]
      },
      idx: -1,
      row: '',
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
        isDefault: 0
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
        value: -1,
        show: true,
        isDefault: 0
      }
      if (this.editValue == null) {
        this.editValue = [{
          id: '',
          name: ' ',
          value: -1,
          show: true,
          isDefault: 0
        }]
      } else {
        this.editValue.push(list)
      }
    },
    addDictEdit (index, row) {
      for (let i = 0; i < this.addform.dictionaryDetails.length; i++) {
        this.addform.dictionaryDetails[i].show = false
      }
      this.addform.dictionaryDetails[index].show = true
    },

    // 新增字典的删除操作
    handleDeleteAdd (index, row) {
      this.addform.dictionaryDetails.splice(index, 1)
    },

    // 新增字典
    saveAdd () {
      this.$refs.addform.validate(valid => {
        if (valid) {
          let param = this.addform
          axios({
            method: 'post',
            url: 'http://172.17.169.0:8081/dict/insertDictionary',
            data: {
              typeName: this.addform.typeName,
              typeCode: this.addform.typeCode,
              dictionaryDetails: this.addform.dictionaryDetails
            }
          }).then((res) => {
            console.log(res.data)
            if (res.data.code == '102') {
              alert('已提交，请勿重复提交')
            } else if (res.data.code == '201') {
              this.addform = {
                typeName: '',
                typeCode: '',
                dictionaryDetails: [{ name: ' ', value: 0, show: false, isDefault: 0}]

              },
              this.$message.success('添加成功')
              this.getPageData()
              // this.$message.success("请刷新页面以显示数据");
            }
          }).catch()
          this.addVisible = false
        }
      })
    },
    // 编辑操作
    handleEdit (index, row) {
      this.editVisible = true
      this.idx = index
      this.row = row
      this.editform = Object.assign({}, row)
      let a = {typeCode: this.editform.typeCode}
      getEditValue(a).then((res) => {
        let jsonObj = JSON.parse(JSON.stringify(res.data))
        this.editValue = jsonObj
        for (let i = 0; i < this.editValue.length; i++) {
          this.editValue[i].show = true
        }
      })
    },

    // 保存编辑
    saveEdit (index, row) {
      var updateVal = {typeCode: this.editform.typeCode, id: row.id, value: row.value, name: row.name, isDefault: row.isDefault}
      console.log(updateVal)
      updateEditVal(updateVal).then((res) => {
        this.getPageData()
        this.handleEdit(this.idx, this.row)
        this.$message.success('保存成功')
      })
    },
    // 编辑字典的删除操作
    // 再.then之后重新获取数据就可以刷新页面数据
    handleDeleteEditAdd (index, row) {
      let params = {id: row.id}
      this.editValue.splice(index, 1)
      delEditVal(params).then((res) => {
        this.getPageData()
      })
    },
    // 最终编辑提交

    // 删除字典项
    handleDelete (index, row) {
      if (confirm('确认删除吗？') == true) {
        axios({
          method: 'delete',
          url: 'http://172.17.169.0:8081/dict/deleteDictionaryByTypeCode/' + row.typeCode,
          data: {
          }
        }).then((res) => {
          this.$message.success('删除成功')
          this.getPageData()
        }).catch()
      }
    },
    // 触发搜索按钮
    handleSearch () {
      let para = this.query.dicName
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
      console.log(this.multipleSelection)
      if (length == 0) {
        this.$message.error('请至少选中一项！')
      } else {
        for (let i = 0; i < length; i++) {
          this.delList[i] = this.multipleSelection[i].id
        }

        deleteDicBatch({data: this.delList}).then((res) => {
          this.$message.success('删除成功')
          this.multipleSelection = []
          this.getPageData()
        })
      }
    },
    // 获取页面数据
    getPageData () {
      let para = {pageNum: this.query.page, pageSize: this.query.pageSize}
      this.listLoading = true
      getPageDict(para).then((res) => {
        console.log(res)
        this.total = res.data.pageInfo.total
        this.pageData = res.data.pageInfo.list
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
