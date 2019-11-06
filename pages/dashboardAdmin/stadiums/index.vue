<template>
  <div class="content">
    <div class="card-body">
      <nuxt-link to="/dashboardAdmin/stadiums/new" class="btn btn-primary btn-block btn-stadium" style="width: 200px; margin-left: 10px"><i class="fa fa-plus" style="padding-right:3px; font-size: 25px; text-align: center; vertical-align: middle "></i>  Добавить стадион</nuxt-link>
      <div class="row" style="margin-top: 25px">
        <div v-for="(stadium, key) in stadiums" :key="key" class="col-sm-3 text-center blocks">
          <img :src="'https://firebasestorage.googleapis.com/v0/b/stadion-e9852.appspot.com/o/stadium%2F'+ stadium.stadiumId + '%2Fthumb_small_' + stadium.imgNames[0] + '?alt=media'" @error="imageLoadError({stadiumId: stadium.stadiumId, name:stadium.imgNames[0]})" class="box-shadow b-r-15" style="max-width: 100%">
          <p v-if="stadium.name.length > 25">{{ stadium.name.slice(0,25)}} ...</p>
          <p v-else>{{ stadium.name }}</p>
          <nuxt-link class="btn btn-success b-r-9" :to="'/dashboardAdmin/stadiums/edit/'+key"><i class="fa fa-pencil"></i>
          </nuxt-link>
          <a class="btn btn-danger b-r-9" @click.prevent="removeStadium({id: key, name: stadium.name})"><i class="fa fa-trash"></i></a>
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

        methods: {
            ...mapActions({
                del: 'stadiums/delete'
            }),
            async imageLoadError(data){
                event.target.src = 'https://firebasestorage.googleapis.com/v0/b/stadion-e9852.appspot.com/o/stadium%2F' + data.stadiumId + '%2F'+ data.name + '?alt=media';
            },
            async removeStadium(data) {
                if (confirm("Вы действительно хотите удалить " + data.name + "?")) {
                    await this.del(data)
                        .then(() => {
                            this.$uikit.notification({
                                message: 'Успешно удалено!',
                                status: 'success',
                                pos: 'top-center',
                                timeout: 2000
                            });
                        })
                        .catch((error) =>{
                            console.log('Удалить не удалось: ' + error.message);
                        });
                }
            }
        }
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
  /*override style*/
  .btn-danger {
    color: #fff !important;
    background-color: #dc3545;
    border-color: #dc3545;
  }
</style>
