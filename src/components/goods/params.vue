<template>
    <div class="warpper">
        <el-card>
            <el-alert title="只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span class="selectLabel">请选择商品分类：</span>
                    <el-cascader 
                    v-model="selectClass" 
                    :options="cateList"
                    :props="cateProps"
                    size="small"
                    @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <template>
                        <el-button type="primary" size="small" :disabled="isBtnDisabled">添加参数</el-button>
                        <el-table 
                        :data="manyData"
                        style="width: 100%"
                        border
                        stripe>
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-tag 
                                    type="success" 
                                    :key="item" 
                                    closable
                                    size="mini"
                                    v-for="item in showTag(scope.row.attr_vals)">
                                        {{item}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="ID"></el-table-column>
                            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="small" @click="useScope(scope.row)">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <template>
                        <el-button type="primary" size="small" :disabled="isBtnDisabled">添加属性</el-button>
                        <el-table 
                        :data="onlyData"
                        style="width: 100%"
                        border
                        stripe>
                            <el-table-column type="expand"></el-table-column>
                            <el-table-column type="index" label="ID"></el-table-column>
                            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="small" @click="useScope(scope)">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectClass: [],
                cateList: [],

                // tabs-pane active change
                activeName: 'many',
                manyData: [],
                onlyData: [],

                // cascader options
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true,
                    expandTrigger: 'hover'
                },

                // tree table 指定每列定义
                columns: [
                    {
                        label: '参数名称',
                        prop: ''
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
            this.getCateList()
        },

        methods: {
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status === 200) {
                    this.cateList = res.data
                }
            },

            async getAttributes() {
                const { data: res } = await this.$http.get(`/categories/${this.cateID}/attributes`, { params: { sel: this.activeName } })
                if (res.meta.status == 200) {
                    this.$message.success('Successful get params data')
                    this.manyData = this.activeName == 'many' ? res.data : []
                    this.onlyData = this.activeName == 'only' ? res.data : []
                    console.log(this.manyData)
                    console.log(this.onlyData)
                } else {
                    this.$message.error('Faild get params data', { showClose: true })
                }
            },

            handleChange() {
                this.selectClass = this.selectClass.length < 3 ? [] : this.selectClass 
                this.tirggerGet()
            },

            handleTabClick() {
                this.tirggerGet()
            },

            // 判断是否获取参数/属性
            tirggerGet() {
                if (!this.isBtnDisabled) {
                    this.getAttributes()
                } else {
                    this.$message.info('未选中第三级分类', { showClose: true })
                }
            },

            useScope(scope) {
                console.log(scope)
            },

            showTag(attr_vals) {
                return attr_vals.split(',')
            },

            closeTag(id, tip) {
                this.$confirm('是否删除' + tip + '参数？', '删除参数', {
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.deleteTag(id, tip)
                }).catch(() => {
                    this.$message.info('已取消删除', { showClose: true })
                })
            },

            async deleteTag(id, attrid) {
                const { data: res } = await this.$http.delete(`categories/${id}/attributes/${attrid}`)
                if (res.meta.status == 200) {
                    this.$message.success('已成功删除参数', { showClose: true })
                } else {
                    this.$message.error('删除参数失败', { showClose: true })
                }
            }
        },

        computed: {
            isBtnDisabled() {
                if (this.selectClass < 3) {
                    return true
                } else {
                    return false
                }
            },

            cateID() {
                if (this.selectClass.length == 3) {
                    return this.selectClass[2]
                } else {
                    return null
                }
            }

            // ipaddrArray(str) {
            //     console.log(str)
            //     return str.split(',')
            // }
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
        width: 16rem;
    }
    .el-table{
        margin-top: 1rem;
    }
    .el-tag{
        margin-right: .5rem;
    }
    .selectLabel{
        margin-left: .5rem;
        font-size: .75rem;
    }
    .cat_opt{
        margin-bottom: .5rem;
    }
</style>