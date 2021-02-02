<template>
    <el-container class="home_contanier">
        <el-header>
            <div class="header_info">
                <img src="../assets/daplogo.png" class="header_logo">
                <span class="header_title">后台管理</span>
            </div>
            <el-button type="info" @click="logout">exit</el-button>
        </el-header>

        <el-container>
            <el-aside :width="isCollapse ? '64px' : '14rem'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>

                <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#506572"
                    text-color="#fff"
                    active-text-color="#0bbbcc"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <el-submenu :index="'' +item.id" v-for='item in menulist' :key='item.id'>
                        <template slot="title">
                            <i :class="'el-icon-' + iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/' +subItem.path + ''" v-for='subItem in item.children' :key='subItem.id' @click="saveNavPath('/' +subItem.path)">
                            <template>
                                <i :class="'el-icon-' + iconsObj[subItem.id]"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
        
            <el-main>
                <router-view name="title" :menulist="menulist" :activePath="activePath"></router-view>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                menulist: [],
                iconsObj: {
                    125: 'user-solid',
                    103: 'lock',
                    101: 's-goods',
                    102: 's-order',
                    145: 's-marketing',
                    110: 'tickets',
                    111: 'document-copy',
                    112: 's-operation',
                    104: 'goods',
                    115: 'set-up',
                    121: 'receiving',
                    107: 'document',
                    146: 'data-analysis'
                },
                isCollapse: false,
                activePath: ''
            }
        },

        created() {
            this.getMenuList()
            this.getNavPath()
        },

        methods: {
            logout() {
                window.sessionStorage.clear()
                this.$router.push('/login') 
            },

            async getMenuList() {
                const { data: res } = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menulist = res.data
            },

            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },

            saveNavPath(path) {
                window.sessionStorage.setItem('activePath', path) 
                this.activePath = path
            },
            getNavPath(path) {
                const sessionPath = window.sessionStorage.getItem('activePath')
                this.activePath = (sessionPath !== '' ? sessionPath : '/welcome')
            }
        }
    }
</script>

<style lang="less" scoped>
    .home_contanier{
        height: 100%;
    }

    .el-header{
        background-color: #373d41;

        padding-left: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        color: white;
        font-size: 1rem;
        .header_info {
            display: flex;
            align-items: center;

            img {
                width: 15rem;
                height: auto;
            }

            span {
                margin-left: 2rem;
            }
        }
    }

    .el-aside{
        background-color: #506572;

        .toggle-button{
            color: white;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            background-color: #365d75;
            letter-spacing: .2rem;
            cursor: pointer;
        }
        .el-menu{
            border: 0
        }
    }

    .el-main{
        background-color: #e7f0f7;
    }
</style>