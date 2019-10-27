<template>
  <div>
    <div class="topbar" style="z-index: 50; background-color: #030404;">
      <nav class="navbar top-navbar navbar-expand-md">
        <div class="navbar-collapse collapse">

          <a class="navbar-brand" style="background-color: white; margin-left: 50px">
            <b class="logo-icon p-l-10">
              <img style="max-height: 40px" src="../assets/img/logo.png" alt="homepage"
                   class="nav_style"/>
            </b>
          </a>

          <ul class="navbar-nav float-left mr-auto">
          </ul>

          <ul class="navbar-nav float-right" style="margin-top: 0px">
            <div class="uk-inline" style="background-color: white">
              <button class="uk-button uk-button-default" type="button">Админ</button>
              <div uk-dropdown="pos: bottom-center">
                <ul class="uk-nav uk-dropdown-nav">
                  <a class="dropdown-item"><i class="ti-user m-r-5 m-l-5"></i>Мой профиль</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="javascript:void(0)" id="sign-out"><i
                    class="fa fa-power-off m-r-5 m-l-5"></i> Выйти</a>
                </ul>
              </div>
            </div>

          </ul>
        </div>
      </nav>
    </div>

    <aside class="sidebar">
      <ul class="nav">
        <li>
          <nuxt-link to="/dashboard" :class="{activelink: this.$route.name === 'dashboard'}">Главная</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/dashboard/stadiums" :class="{activelink: this.$route.name === 'dashboard-stadiums'}">Мои
            стадины
          </nuxt-link>
        </li>
        <li><a href="https://stadion.kg/rent_stadium">Домой</a></li>
        <li>
          <a @click="signout" style="cursor: pointer">Выход</a>
        </li>
      </ul>
    </aside>
    <nuxt-child/>
  </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {firestore} from '~/firebase/app'

    export default {
        name: "dashboard",
        layout: "dashboard",
        head: {
            title: "Admin Panel"
        },
        middleware: 'authenticated',
        methods: {
            ...mapActions('modules/user', ['logout']),
            async signout() {
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
