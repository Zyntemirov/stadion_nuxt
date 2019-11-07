<template>
  <div>
    <div class="topbar" style="z-index: 50; background-color: #030404;">
      <nav class="navbar top-navbar navbar-expand-md">
        <div class="navbar-collapse collapse">

          <a class="navbar-brand">
            <b class="logo-icon p-l-10">
              <img style="max-height: 30px" src="../assets/img/logo-stadium_final_fixed.png" alt="homepage"
                   class="nav_style"/>
            </b>
          </a>

          <ul class="navbar-nav float-left mr-auto">
          </ul>

          <ul class="navbar-nav float-right" style="margin-top: 0px">
            <div class="uk-inline">
              <button class="uk-button uk-button-default" type="button" style="border-radius: 13px; background-color: white">Админ</button>
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
          <nuxt-link to="/dashboardAdmin" :class="{activelink: this.$route.name === 'dashboardAdmin'}">Главная</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/dashboardAdmin/stadiums" :class="{activelink: this.$route.name === 'dashboardAdmin-stadiums'}">
            Мои стадины
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/dashboardAdmin/histories" :class="{activelink: this.$route.name === 'dashboardAdmin-histories'}">
            История заказов
          </nuxt-link>
        </li>
        <li><a href="https://stadion.kg/rent_stadium">Домой</a></li>
        <li>
          <a @click="signout" style="cursor: pointer">Выход</a>
        </li>
      </ul>
    </aside>
    <nuxt-child/>
    <footer class="footer text-center">
      All Rights Reserved by Stadion.kg. Designed and Developed by <a href="https://wrappixel.com">AZ</a>.
    </footer>
  </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {firestore} from '~/firebase/app'

    export default {
        name: "dashboardAdmin",
        layout: "dashboardAdmin",
        head: {
            title: "Admin Panel"
        },
        middleware: 'authenticatedAdmin',
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

  .footer {
    position: absolute;
    margin-left: 40%;
  }

  .topbar {
    position: fixed;
    width: 100%;
  }
</style>
