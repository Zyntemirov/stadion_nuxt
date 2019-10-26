<template>
  <div class="content">
    <div class="card-body">
      <nuxt-link to="/dashboard/stadiums/new" class="btn btn-primary btn-block">Добавить новый стадион</nuxt-link>

      <div class="row" style="margin-top: 10px">
        <div v-for="(stadium, key) in stadiums" :key="key" class="col-sm-3 text-center blocks">
          <img :src="'https://firebasestorage.googleapis.com/v0/b/stadion-e9852.appspot.com/o/stadium%2F'+ stadium.stadiumId + '%2Fthumb_small_' + stadium.imgNames[0] + '?alt=media'" @error="imageLoadError({stadiumId: stadium.stadiumId, name:stadium.imgNames[0]})" style="max-width: 100%">
          <p>{{ stadium.name.slice(0,25)}} ...</p>
          <nuxt-link class="btn btn-success" :to="'/dashboard/stadiums/edit/'+key"><i class="fa fa-pencil"></i>
          </nuxt-link>
          <a class="btn btn-danger" @click.prevent="removeStadium({id: key})"><i class="fa fa-trash"></i></a>
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
            ...mapGetters({stadiums: 'stadiums/stadiums'})
        },
        methods: {
            ...mapActions({
                del: 'stadiums/delete'
            }),
            async imageLoadError(data){
                event.target.src = 'https://firebasestorage.googleapis.com/v0/b/stadion-e9852.appspot.com/o/stadium%2F' + data.stadiumId + '%2F'+ data.name + '?alt=media';
            },
            async removeStadium(data) {
                if (confirm("вы уверены ?")) {
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
    margin: 1px
  }

  img {
    width: 250px;
    height: 186px;
    object-fit: cover;
  }

  .blocks {
    margin-bottom: 30px;
  }

  /*override style*/
  .btn-danger {
    color: #fff !important;
    background-color: #dc3545;
    border-color: #dc3545;
  }
</style>
