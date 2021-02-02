<template>
    <div>
        <el-card>
            <el-row type="flex" justify="space-between">
                <el-col :span="8">
                    <el-input placeholder="请输入需要搜索的分类ID" v-model="cateInput" clearable @clear="getGoodsClass">
                        <el-button slot="append" icon="el-icon-search" @click="findCateID()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2.5">
                    <el-button type="primary" icon="el-icon-plus" @click="addCateDialogControl()">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 树形表格 -->
            <tree-table class="treeTab" :data="goodsClass" :columns="columns" :selection-type="false" :expand-type="false" index-text='#' :show-index="true" border>
                <template slot="cateEnable" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-cion-error" v-else></i>
                </template>
                <template #level="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="info" v-else-if="scope.row.cat_level === 2">三级</el-tag>
                </template>
                <template v-slot:operation="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[5, 10, 20, 100]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="pagination">
            </el-pagination>
        </el-card>

        <el-dialog
        title="添加分类"
        :visible.sync='addCateDialogVisible'
        width="60%"
        @close='addDialogClosed()'>
            <template>
                <el-form ref="addFormRef" label-width="6rem" :model="addForm" :rules="addFormRules">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-col :span="12">
                            <el-input placeholder="请输入新增分类名称" v-model="addForm.cat_name"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <el-col :span="12">
                            <el-cascader
                            v-model="selectedClass"
                            :options="parentClass"
                            :props="{
                                value: 'cat_id',
                                label: 'cat_name',
                                children: 'children',
                                checkStrictly: true,
                                expandTrigger: 'hover'
                            }"
                            @change="parentCateChanged"
                            clearable></el-cascader>
                        </el-col>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="DialogClosed()">取 消</el-button>
                    <el-button type="primary" @click="addCate()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog
        title="编辑分类"
        :visible.sync="editCateDialogVisible"
        width="60%">
            <template>
                <el-form class="editForm" ref="changeCateRef" v-model="changeCate" label-width="8rem">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="分类ID：">
                                <el-input v-model="changeCate.cat_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="分类等级：">
                                <el-input v-model="changeCate.cat_level" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="父级分类名称：">
                                <el-input v-model="changeCate.cat_pid_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="父级分类ID：">
                                <el-input v-model="changeCate.cat_pid" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="22">
                            <el-form-item label="分类名称：">
                                <el-input v-model="changeCate.cat_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeCategories(changeCate)" >确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 商品分类总列表
                goodsClass: [],
                testCate: [],

                // 添加分类可选择父级商品分类
                parentClass: [],
                // 添加分类已选择的父级
                selectedClass: [],

                // id查询分类
                cateInput: '',
                cateID: [],

                // 编辑分类暂存
                changeCate: {
                    cat_id: 0,
                    cat_level: 0,
                    cat_name: '',
                    cat_pid: 0,
                    cat_pid_name: ''
                },
                putCateChange: {
                    cat_name: ''
                },

                // 控制dialog参数
                addCateDialogVisible: false,
                editCateDialogVisible: false,

                // 添加分类表单
                addForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                // 添加分类规则
                addFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },

                // 查询条件
                querInfo: {
                    // 1:only level 1; 2:level 1 and 2; 3:all level
                    type: 3,
                    // 分页页码
                    pagenum: 1,
                    // 单页展示数量
                    pagesize: 100
                },
                // 总数据页码
                total: 0,

                // tree table 指定每列定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否启用',
                        type: 'template',
                        template: 'cateEnable'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'level'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'operation'
                    }
                ]
            }
        },
        created() {
            this.getGoodsClass()
        },
        methods: {
            // 获取商品分类列表
            getGoodsClass() {
                this.$http.get('categories', { params: this.querInfo }).then(data => {
                    this.goodsClass = data.data.data.result
                    this.total = data.data.data.total
                }).catch(err => {
                    this.$message.error(err, { showClose: true })
                })
            },
            // 获取父级商品分类
            getParentGoodsClass() {
                this.$http.get('categories', { params: { type: 2 } }).then(data => {
                    this.parentClass = data.data.data
                }).catch(err => {
                    this.$message.error(err, { showClose: true })
                })
            },

            // 分页
            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize
                this.getGoodsClass()
            },
            handleCurrentChange(newPage) {
                this.querInfo.pagenum = newPage
                this.getGoodsClass()
            },

            // 关闭弹窗并清除对话框缓存
            DialogClosed() {
                this.addCateDialogVisible = false
                this.$refs.addFormRef.resetFields()
                this.selectedClass = []
                this.addForm.cat_level = 0
                this.addForm.cat_pid = 0
            },

            // 添加分类dialog
            addCateDialogControl() {
                this.getParentGoodsClass()
                this.addCateDialogVisible = true
            },
            // 验证提交信息
            addCate() {
                this.$refs.addFormRef.validate(async valid => {
                    if (valid) {
                        const { data: res } = await this.$http.post('categories', this.addForm)
                        if (res.meta.status === 201) {
                            this.$message.success('Success add ' + this.addForm.cat_name + ' categories', { showClose: true })
                        } else {
                            this.$message.error('faild add ' + this.addForm.cat_name + ' categories', { showClose: true })
                        }
                    }
                })

                this.addCateDialogVisible = false
                this.getGoodsClass()
            },

            // 添加分类dialog选择发生变化触发这个函数
            parentCateChanged() {
                // 提交表单元素的父级id赋值
                this.addForm.cat_pid = this.selectedClass.length > 0 ? this.selectedClass[this.selectedClass.length - 1] : 0
                // 提交表单元素的等级赋值
                this.addForm.cat_level = this.selectedClass.length > 0 ? this.selectedClass.length : 0
            },

            // id查询分类
            async findCateID() {
                if (this.cateInput.length < 1) {
                    this.getGoodsClass()
                    return
                } 
                const findRom = await this.findCateByID(this.cateInput)
                if (findRom) {
                    this.goodsClass = []
                    this.goodsClass.push(findRom)
                } else {
                    this.getGoodsClass()
                }
            },

            // 编辑分类dialog
            async showEditCate(cate) {
                this.changeCate = cate
                const parentInfo = cate.cat_pid < 1 ? undefined : await this.findCateByID(this.changeCate.cat_pid)
                this.changeCate.cat_pid_name = parentInfo ? parentInfo.cat_name : '无父级分类'
                this.editCateDialogVisible = true
            },

            // 通过ID查询分类
            async findCateByID(cate_id) {
                const { data: res } = await this.$http.get('categories/' + cate_id)
                if (res.meta.status === 200) {
                    this.$message.success('Success find categories by id', { showClose: true })
                    return res.data
                } else {
                    this.$message.error('faild find categories by id', { showClose: true })
                    return undefined
                }
            },

            // 编辑分类
            async changeCategories(cate) {
                this.putCateChange.cat_name = cate.cat_name
                const { data: res } = await this.$http.put(`categories/${cate.cat_id}`, this.putCateChange)
                if (res.meta.status === 200) {
                    this.$message.success('Success update categories name', { showClose: true })
                    this.getGoodsClass()
                } else {
                    this.$message.error('Faild update categories name', { showClose: true })
                }
                this.editCateDialogVisible = false
            },

            deleteCate(cate) {
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '删除分类', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { 
                    this.deleteCateByID(cate)
                        .then(res => {
                            this.$message.success('Success deleted ' + cate.cat_name + ' categories', { showClose: true })
                            this.getGoodsClass()
                        }).catch(err => {
                            return this.$message.error(err, { showClose: true })
                        })
                }).catch(err => {
                    this.$message.info('Cancel delete ' + cate.cat_name + ' categories', { showClose: true })
                    return err
                })
            },
            // 删除分类
            async deleteCateByID(cate) {
                const { data: res } = await this.$http.delete('categories/' + cate.cat_id)
                console.log(res)
            }
        }
    }
</script>

<style lang="less" scoped>
    .treeTab,
    .pagination{
        margin-top: 1rem;
        font-size: .75rem;
    }

    .el-cascader{
        width: 100%
    }

    .el-icon-success{
        color: lightseagreen
    }
    .el-icon-error{
        color: lightsalmon;
    }
</style>

<style lang="less">
    div.el-cascader-menu{
        min-width: 14rem;
        min-height: 14rem;
        max-height: 23rem;
    }
</style>