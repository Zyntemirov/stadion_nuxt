<template>
  <div>
    <aside class="sidebar">
      <div class="nav__title nav_style" align="center"><img src="../assets/img/logo.png" alt="logo" style="width: 50%"></div>
      <ul class="nav">
        <li><nuxt-link to="/dashboard" :class="{activelink: this.$route.name === 'dashboard'}">Главная</nuxt-link></li>
        <li><nuxt-link to="/dashboard/stadiums" :class="{activelink: this.$route.name === 'dashboard-stadiums'}">Мои стадины</nuxt-link></li>
        <li>
          <a @click="signout" style="cursor: pointer">Выход</a>
        </li>
      </ul>
    </aside>
    <nuxt-child/>
  </div>
</template>

<script>
  import {mapGetters, mapActions } from 'vuex'
  import {firestore} from '~/firebase/app'
  export default {
    name: "dashboard",
    layout: "dashboard",
    head: {
      title: "Admin Panel"
    },
    middleware: 'authenticated',
    methods: {
      ...mapActions('modules/user', [ 'logout' ]),
      async signout () {
        await this.logout()
        this.$router.push('/')
      },
    },
  };
</script>

<style scoped>
  .activelink {
    background: white !important;
    color: #000000 !important;
  }

  .nav_style {
    background-color: white;
    border-radius: 30px
  }
</style>
