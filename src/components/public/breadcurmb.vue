<template>
    <div>
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{pathName[0]}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{pathName[1]}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                parentMenuList: [],
                routePath: '',
                pathName: []
            }
        },
        props: ['menulist', 'activePath'],
        watch: {
            menulist: function(val) {
                this.parentMenuList = val
                this.checkMenuList(this.parentMenuList)
            },
            activePath: function(val) {
                this.routePath = val
                this.checkMenuList(this.parentMenuList)
            }
        },
        created() {
            this.routePath = this.$route.path
        },
        methods: {
            checkMenuList(arr) {
                arr.forEach(key => {
                    key.children.forEach(val => {
                        // console.log(val.children.length > 0 ? 'right' : 'none')
                        if ('/' + val.path === this.routePath) {
                            this.pathName = []
                            this.pathName.push(key.authName)
                            this.pathName.push(val.authName)
                            return this.pathName
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
