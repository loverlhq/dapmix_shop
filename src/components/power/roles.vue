<template>
    <div class="roles-wrapper">
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" icon="el-icon-plus">添加角色</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-table
                        :data="rolesList"
                        border
                        stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-row :class="['borderBottom', index1 === 0 ? 'borderTop' : '']" v-for="(itemOne, index1) in scope.row.children" :key="itemOne.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="handleClose(scope.row, itemOne)">{{itemOne.authName}}</el-tag>
                                        <i class="icon el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-row :class="[index2 !== 0 ? 'borderTop' : '']" v-for="(itemTwo, index2) in itemOne.children" :key="itemTwo.id">
                                            <el-col :span="8">
                                                <el-tag closable type="success" @close="handleClose(scope.row, itemTwo)">{{itemTwo.authName}}</el-tag>
                                                <i class="icon el-icon-caret-right"></i>
                                            </el-col>
                                            <el-col>
                                                <el-tag closable type="info" @close='handleClose(scope.row, itemThree)'  v-for="(itemThree) in itemTwo.children" :key="itemThree.id">{{itemThree.authName}}</el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                                <!-- <pre>{{scope.row}}</pre> -->
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="ID"></el-table-column>
                        <el-table-column label="角色名称" prop="roleName"></el-table-column>
                        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                        <el-table-column label="操作" min-width="160">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
                                <el-button size="mini" type="info" icon="el-icon-setting" @click="settingRole(scope.row)">分配权限</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <el-dialog
            title="分配权限"
            :visible.sync='settingRightDialogVisible'
            width="40%"
            @close='cleandefkeys'>
                <el-tree
                    :data="rightsList"
                    :props="treePorps"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :default-checked-keys='defkeys'
                    ref='treeRef'>
                </el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="settingRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeRoleRight()">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rolesList: [],
                rightsList: [],
                editRoleUser: {

                },
                addRoleRights: '',
                treePorps: {
                    label: 'authName',
                    children: 'children'
                },
                defkeys: [],
                settingId: '',

                settingRightDialogVisible: false,
                editDialogVisible: false
            }
        },

        created() {
            this.getRolesList()
        },

        methods: {
            getRolesList() {
                this.$http.get('roles').then(e => {
                    console.log(e)
                    this.rolesList = e.data.data
                    this.$message.success('Success get roles list')
                }).catch(e => {
                    this.$message.error('Failed get roles list')
                })
            },
            // getRightsByID(role_id) {
            //     this.$http.get('roles/' + role_id).then(e => {

            //     })
            // },

            // editRole() {
            //     this.$http.put(this.editRoleUser).then(() => {
            //         this.getRolesList()
            //         this.$message.success('Success edit role information')
            //     }).catch(e => {
            //         this.$message.error('Failed edit role information')
            //     })
            // },
            // deleteRole(id) {
            //     this.$http.delete('role/' + id).then(() => {
            //         this.getRolesList()
            //         this.$message.success('Success delete role')
            //     }).catch(e => {
            //         this.$message.error('Failed delete role')
            //     })
            // },
            changeRoleRight() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idstr = keys.join(',')
                this.$http.post('roles/' + this.settingId + '/rights', { 
                    rids: idstr 
                }).then(() => {
                    this.getRolesList()
                    this.$message.success('Success add role right')
                }).catch(e => {
                    this.$message.error('Failed add role rights')
                })
                this.settingRightDialogVisible = false
            },
            deleteRightById(role, right) {
                this.$http.delete('roles/' + role.id + '/rights/' + right.id).then(res => {
                    role.children = res.data.data
                    this.$message.success('成功删除 ' + role.roleName + ' 权限: ' + right.authName)
                }).catch(e => {
                    this.$message.error('Failed delete role right: ' + right.authName)
                })
            },

            handleClose(role, right) {
                this.$confirm(right.authName + '权限将被取消，是否继续?', '权限变更', {
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.deleteRightById(role, right)
                }).catch(() => {
                    this.$message.info('已取消删除')
                })
            },

            settingRole(role) {
                this.settingId = role.id
                this.$http.get('rights/tree').then(res => {
                    this.rightsList = res.data.data
                    this.getLeafKes(role, this.defkeys)
                    // console.log(res)
                }).catch(() => {
                    this.$message.error('获取权限数据失败')
                })

                this.settingRightDialogVisible = true
            },
            // 递归获取三级权限ID保存
            getLeafKes(target, arr) {
                if (!target.children) {
                    return arr.push(target.id)
                } else {
                    target.children.forEach(item => {
                        this.getLeafKes(item, arr)
                    })
                }
            },
            cleandefkeys() {
                this.defkeys = []
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-table {
        margin-top: 1rem;
        font-size: .75rem;
    }

    .el-row{
        display: flex;
        align-items: center;
        justify-items: center;
    }
    .borderBottom{
        border-bottom: 1px solid #eeeeee;
    }
    .borderTop{
        border-top: 1px solid #eeeeee;
    }

    .el-tag{
        margin: .75rem .5rem;
    }
    i.icon{
        margin-left: 1rem;
    }
</style>