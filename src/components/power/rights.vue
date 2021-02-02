<template>
    <div class="rights-wrapper">
        <el-card>
            <el-table
                :data="rightsList"
                style="width: 100%"
                border
                stripe>

                <el-table-column type="index" label="ID"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rightsList: []
            }
        },

        created() {
            this.getRightsList()
        },

        methods: {
            // 获取权限列表
            async getRightsList() {
                const { data: res } = await this.$http.get('rights/list')
                if (res.meta.status !== 200) {
                    return this.$message.error('Failed get rights list')
                } else {
                    this.rightsList = res.data
                    console.log(res)
                    return this.$message.success('Success get rights list')
                }
            }
        }
    }
</script>

<style lang="less" scoped>

</style>