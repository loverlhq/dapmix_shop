<template>
    <div class="user_wrapper">
        <!-- <el-breadcrumb separator='/'>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb> -->

        <el-card>
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索的用户名" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2.5">
                    <el-button type="primary" @click="addDialogVisible = true" icon="el-icon-plus">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表单模板 -->
            <el-table 
                :data="userList"
                style="width: 100%"
                border
                stripe>
                <el-table-column type="index" label="ID"></el-table-column>
                <el-table-column prop="role_name" label="角色" width="160"></el-table-column>
                <el-table-column prop="username" label="用户名" width="160"></el-table-column>
                <el-table-column prop="mobile" label="联系方式" width="160"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" ></el-table-column>
                <el-table-column label="是否启用" width="100">
                    <template slot-scope='scope'>
                        <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <!-- edit -->
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- delete -->
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUser(scope.row.id)"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip placement="top" content="角色分配" effect="dark" :enterable="false">
                            <el-button size="mini" type="info" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加对话框 -->
        <el-dialog
            title="Add user"
            :visible.sync="addDialogVisible"
            width="50%"
            @close='dialogClosed("add")'
            center>
            <template>
                <el-form label-width="6rem" :model="addUserInfo" :rules="rules" ref="addUserInfoRef" status-icon>
                    <el-form-item label="username:" prop="username">
                        <el-input placeholder="Please enter the new username" v-model="addUserInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="password:" prop="password">
                        <el-input placeholder="Please enter the new user password" v-model="addUserInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item label="email:" prop="email">
                        <el-input placeholder="Please enter the new user email" v-model="addUserInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="mobile:" prop="mobile">
                        <el-input placeholder="Please enter the new user mobile" v-model="addUserInfo.mobile"></el-input>
                    </el-form-item>
                </el-form>
                
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="checkUserInfo('add')">Submit</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog
            title="Edit user"
            :visible.sync="editDialogVisible"
            width="50%"
            @close='dialogClosed("edit")'
            center>
            <template>
                <el-form label-width="6rem" :model="editUserInfo" :rules="rules" ref="editUserInfoRef" status-icon>
                    <el-form-item label="username:">
                        <el-input placeholder="Please enter the new username" v-model="editUserInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="email:" prop="email">
                        <el-input placeholder="Please enter the new user email" v-model="editUserInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="mobile:" prop="mobile">
                        <el-input placeholder="Please enter the new user mobile" v-model="editUserInfo.mobile"></el-input>
                    </el-form-item>
                </el-form>
                
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="checkUserInfo('edit')">Submit</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分配对话框 -->
        <el-dialog
            title="Assigning Roles"
            :visible.sync="roleDialogVisible"
            @close="setRoleDialogClosed"
            width="50%">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <div>
                    <p>分配新角色：
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                    
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveUserRole">Submit</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            // 校验邮箱函数
            var checkEmail = (rule, value, callback) => {
                // 邮箱正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (!regEmail.test(value)) {
                    callback(new Error('请输入正确的邮箱'))
                } else {
                    return callback()
                }
            }
            // 校验电话号码
            var checkMobile = (rule, value, callback) => {
                if (!(/^1[3-9]\d{9}$/).test(value)) {
                    callback(new Error('请输入正确的电话号码'))
                } else {
                    return callback()
                }
            }

            return {
                // 列表显示数据
                queryInfo: {
                    query: '', // 筛选值
                    pagenum: 1, // 初始化页码
                    pagesize: 10 // 初始化单页数据数量
                },
                // 添加用户数据
                addUserInfo: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 获取编辑用户数据暂存
                editUserInfo: {},
                // 获取用户列表数组
                userList: [],
                total: 0,
                
                // 控制对话框展示
                addDialogVisible: false,
                editDialogVisible: false,
                roleDialogVisible: false,

                // 分配用户信息
                userInfo: {},
                // 角色数据列表
                rolesList: [],
                // 已选中ID值
                selectedRoleId: '',

                // 表单规则校验
                rules: {
                    username: [
                        { required: true, message: 'username cannot  be empty', trigger: 'blur' },
                        { min: 3, max: 10, message: 'username length cannot be less than 3 or greater than 10', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'password cannot  be empty', trigger: 'blur' },
                        { min: 6, max: 15, message: 'username length cannot be less than 6 or greater than 15', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: 'email cannot  be empty', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: 'mobile cannot  be empty', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                }
            }
        },

        created() {
            // 初始化用户列表显示
            this.getUserList()
        },

        methods: {
            // 获取用户列表
            async getUserList() {
                const { data: res } = await this.$http.get('users', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('Failed get user list')
                } else if (res.data.total === 0) {
                    this.userList = res.data.users
                    this.total = res.data.total
                    return this.$message.warning('No parameters matching the search')
                } else {
                    this.userList = res.data.users
                    this.total = res.data.total
                    return this.$message.success('Success get user list')
                }
            },
            // 修改用户状态
            async userStatusChange(userStatus) {
                const { data: res } = await this.$http.put(`users/${userStatus.id}/state/${userStatus.mg_state}`)
                if (res.meta.status !== 200) {
                    userStatus.mg_state = !userStatus.mg_state
                    return this.$message.error('Failed update user status')
                } else {
                    return this.$message.success('Success update user status')
                }
            },
            // 添加用户数据
            async addUserPost() {
                const { data: res } = await this.$http.post('/users', this.addUserInfo)
                if (res.meta.status === 201) {
                    this.$message.success('Success add a new user')
                    this.getUserList()
                } else {
                    this.$message.danger('Failed add a new user')
                }
            },
            // 修改用户数据
            async changeUser(userStatus) {
                const { data: res } = await this.$http.put('users/' + this.editUserInfo.id, {
                     email: this.editUserInfo.email, 
                     mobile: this.editUserInfo.mobile 
                    })
                
                if (res.meta.status !== 200) {
                    return this.$message.error('Failed update user information')
                } else {
                    this.editDialogVisible = false
                    this.getUserList()
                    return this.$message.success('Success update user information')
                }
            },
            
            // 获取分页页码 & 单页可显示数据数量
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            handleCurrentChange(newSize) {
                this.queryInfo.pagenum = newSize
                this.getUserList()
            },
            
            // 关闭对话框清空对应对话框表单内数据
            dialogClosed(dialogRef) {
                switch (dialogRef) {
                    case 'add': {
                        this.$refs.addUserInfoRef.resetFields()
                        break
                    }
                    case 'edit': {
                        this.$refs.editUserInfoRef.resetFields()
                        break
                    }
                }
            },
            // 检查数据是否合法 => 发送对应请求
            checkUserInfo(operate) {
                switch (operate) {
                    case 'add' : {
                        this.$refs.addUserInfoRef.validate(valid => {
                            if (!valid) {
                                return 0
                            } else {
                                this.addUserPost()
                            }
                        })
                        break
                    }
                    case 'edit' : {
                        this.$refs.editUserInfoRef.validate(valid => {
                            if (valid) {
                                this.changeUser()
                            } else {
                                return 0
                            }
                        })
                    }
                }
            },

            // 修改对话框
            async showEditDialog(id) {
                const { data: res } = await this.$http.get('users/' + id)
                this.editDialogVisible = true
                if (res.meta.status !== 200) {
                    return this.$message.error('Failed search user from ID')
                } else {
                    this.editUserInfo = res.data
                }
            },

            // 删除用户
            removeUser(id) {
                // 弹框询问是否删除
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '删除用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('users/' + id).then(() => {
                        this.$message.success('删除成功', { showClose: true })
                        this.getUserList()
                    }).catch(err => {
                        return this.$message.error(err, { showClose: true })
                    })
                }).catch(err => {
                    this.$message.info('已取消删除', { showClose: true })
                    return err
                })
            },

            // 分配角色对话框
            setRole(userInfo) {
                this.userInfo = userInfo

                // 展示对话框前获取所有角色列表
                this.$http.get('/roles').then(data => {
                    this.rolesList = data.data.data
                }).catch(error => {
                    return this.$message.error(error, { showClose: true })
                })

                this.roleDialogVisible = true
            },

            // 分配角色权限
            saveUserRole(user) {
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择需要分配的角色')
                }
                this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId }).then(msg => {
                    this.roleDialogVisible = false
                    this.getUserList()
                    this.$message.success('成功分配角色权限')
                }).catch(() => {
                    this.$message.error('更新角色权限失败', { showClose: true })
                })
            },

            // 清除分配对话框缓存
            setRoleDialogClosed() {
                this.selectedRoleId = ''
                this.userInfo = {}
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-table{
        margin-top: 1rem;
        font-size: .75rem;
    }
</style>
