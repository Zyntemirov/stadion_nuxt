<template>
  <div class="content">
    <div class="card-body">
      <div class="row" style="margin-top: 25px">
        <div v-for="(stadium, key) in stadiums" :key="key" class="col-sm-3 text-center blocks">
          <nuxt-link :to="'/dashboardAdmin/requests/show/'+key" class="close_icon fa fa-calendar fa-3x"></nuxt-link>
          <img :src="'https://firebasestorage.googleapis.com/v0/b/stadion-e9852.appspot.com/o/stadium%2F'+ stadium.stadiumId + '%2Fthumb_small_' + stadium.imgNames[0] + '?alt=media'" @error="imageLoadError({stadiumId: stadium.stadiumId, name:stadium.imgNames[0]})" class="box-shadow b-r-15" style="max-width: 100%">
          <p v-if="stadium.name.length > 25">{{ stadium.name.slice(0,25)}} ...</p>
          <p v-else>{{ stadium.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        layout: 'dashboard',
        name: "stadiums",
        computed: {
            ...mapGetters({stadiums: 'stadiums/stadiums'}),
        },
    }
</script>

<style scoped>
  p {
    margin: 7px
  }

  img {
    width: 250px;
    height: 186px;
    object-fit: cover;
  }

  .blocks {
    margin-bottom: 30px;
  }

  .b-r-15 {
    border-radius: 15px;
  }

  .b-r-9 {
    border-radius: 9px;
  }

  .box-shadow {
    width: 250px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
  }

  .close_icon {
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 500px;
    position: absolute;
    top: 41%;
    color: white;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
</style>
