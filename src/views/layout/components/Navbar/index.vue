<template>
  <el-menu class="navbar" mode="horizontal">
    <Hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <Breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/">
          <el-dropdown-item>主 页</el-dropdown-item>
        </router-link>
        <router-link to="/updatePassword">
          <el-dropdown-item divided>修改密码</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <div class="userinof-box">
      <p>{{ name }}</p>
      <p>
        <span v-for="(role, index) in roles" :key="role"><span v-if="index > 0">、</span>{{ role }}</span>
      </p>
    </div> -->
  </el-menu>
</template>

<script>
import { mapGetters, useStore } from "vuex";
import { computed } from 'vue'
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  setup() {
    const store = useStore()

    // 计算属性
    const sidebar = computed(() => { return store.getters.sidebar })

    // 方法
    function toggleSideBar() {
      store.dispatch("app/toggleSideBar")
    }

    function logout() {
      store.dispatch("LogOut").then(() => {
        this.$message({ type: "success", message: "登出成功" })
        this.$router.push({ path: "/login" })
      })
    }

    return {
      sidebar,
      toggleSideBar,
      logout
    }
  },
  // computed: {
  //   // ...mapGetters(["sidebar", "avatar", "name", "roles"])
  //   ...mapGetters(["sidebar"])
  // },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .userinof-box {
    float: right;
    height: 50px;
    margin-right: 15px;
    p {
      height: 25px;
      line-height: 23px;
      font-size: 13px;
      margin: 0;
      color: #999;
    }
    p:first-child {
      padding-top: 4px;
    }
  }
  .avatar-container {
    float: right;
    height: 50px;
    margin-right: 15px;
    .avatar-wrapper {
      cursor: pointer;
      height: 50px;
      .user-avatar {
        margin-right: 4px;
        width: 40px;
        height: 40px;
        vertical-align: middle;
        border-radius: 10px;
      }
    }
  }
}
</style>

