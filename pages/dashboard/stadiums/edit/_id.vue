<template>
  <div class="content">
    <div class="card">
      <div class="card-header text-center">
        <h4 class="m-0">Редактировать</h4>
      </div>
      <div class="card-body">
        <div id="map" style="width: 100%; height: 400px"></div>
        {{form}}
        <form @submit.prevent="handleSubmit">
          <h3 class="card-title" align="center">Заполните все поля </h3>
          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Название поля</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="form.name"
                     placeholder="Сантьяго Бернабеу" required>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Цена</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="form.price"
                     onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                     maxlength="5"
                     placeholder="1000" required>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Полный
              адрес</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="form.address"
                     placeholder="Иса Ахунбаева, 102а" required>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Рабочее время</label>
            <div class="col-sm-2">
              <div class="input-group">
                <vue-timepicker :minute-interval="15" v-model="form.open_time"
                                placeholder="Время начала"></vue-timepicker>
              </div>
            </div>
            <div class="col-sm-2">
              <div class="input-group">
                <vue-timepicker :minute-interval="15" v-model="form.close_time"
                                placeholder="Время окончания"></vue-timepicker>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Тип</label>
            <div class="col-sm-9">
              <select class="select2 form-control custom-select" v-model="form.type"
                      style="width: 100%; height:36px;">
                <option value="Мини">Мини</option>
                <option value="Футзал">Футзал</option>
                <option value="Большой">Большой</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Инфраструктура</label>
            <div class="col-sm-9">
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.ceiling"
                       id="stadium_ceiling_edit">
                <label class="custom-control-label" for="stadium_ceiling_edit">Крыша</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.dressing_room"
                       id="stadium_dressing_room_edit">
                <label class="custom-control-label" for="stadium_dressing_room_edit">Раздевалки</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.lighting"
                       id="stadium_lighting_edit_edit">
                <label class="custom-control-label" for="stadium_lighting_edit_edit">Освещение</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.shower"
                       id="stadium_shower_edit">
                <label class="custom-control-label" for="stadium_shower_edit">Душ</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.tribune"
                       id="stadium_tribune_edit">
                <label class="custom-control-label" for="stadium_tribune_edit">Трибуна</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.parking"
                       id="stadium_parking_edit">
                <label class="custom-control-label" for="stadium_parking_edit">Парковка</label>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Фото</label>
            <div class="col-sm-9">
              <div>
                <input type="file" @change="uploadImage" multiple
                       accept="image/*">
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-2">
            </div>
            <div class="col-sm-9">
              <div v-for="(image, key) in imgNames" class="image_choose" v-bind:key="image">
                <div v-if="image">
                  <span class="close_icon fa fa-close fa-2x" @click="delImg({id:form.stadiumId, index: key, name:image})"></span>
                  <img :src="'https://firebasestorage.googleapis.com/v0/b/stadion-e9852.appspot.com/o/stadium%2F'+ form.stadiumId + '%2Fthumb_small_' + image + '?alt=media'" class="img-thumbnail pic">
                </div>
              </div>
              <img v-for="img in images" v-bind:key="img" :src="img" class="pic">
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Описание</label>
            <div class="col-sm-9">
                  <textarea class="form-control" v-model="form.description" placeholder="Напишите....." rows="3"
                            id="stadium_description_edit" required></textarea>
            </div>
          </div>

          <div class="form-group" align="center">
            <nuxt-link to="/dashboard/feedback" class="btn btn-danger">отменить</nuxt-link>
            <button class="btn btn-success" type="submit">сохранить</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapActions} from "vuex";
    import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'

    export default {
        name: "edit",
        components: {VueTimepicker},
        data(){
          return {
              images: [],
              fileObject: {},
          }
        },
        asyncData({params, store}) {
            let form = Object.assign({},store.state.stadiums.list[params.id]);
            return {
                form,
                imgNames: Object.assign([], form.imgNames),
            }

        },
        methods: {
            ...mapActions({
                updateClient: 'stadiums/update',
                delImage: 'stadiums/deleteOneImg'
            }),
            delImg(data){
                if (confirm("вы уверены ?")) {
                     this.delImage(data)
                      .then(() => {
                          this.$uikit.notification({
                              message: 'Успешно удалено!',
                              status: 'success',
                              pos: 'top-center',
                              timeout: 2000
                          });
                          this.imgNames.splice(data.index,1);
                      })
                      .catch((error) =>{
                          console.log('Удалить не удалось: ' + error.message);
                      });
                }
            },
            uploadImage(e){
                this.images = [];
                let curFiles = e.target.files;
                this.fileObject = e.target.files;
                if (curFiles.length > 4) {
                    this.$uikit.notification({
                        message: 'Вы можете загрузить максимум 4 фото!',
                        status: 'warning',
                        pos: 'top-right',
                        timeout: 2000
                    });
                    return
                }
                for (let i = 0; i < curFiles.length; i++) {
                    this.images.push(URL.createObjectURL(curFiles[i]))
                }
            },
            handleSubmit() {
                if (this.form.open_time === '' || this.form.close_time === '') {
                    this.$uikit.notification({
                        message: 'Заполните время!',
                        status: 'warning',
                        pos: 'top-right',
                        timeout: 2000
                    });
                } else if (this.imgNames.length === 0) {
                    this.$uikit.notification({
                        message: 'Выберите фотографий!',
                        status: 'warning',
                        pos: 'top-right',
                        timeout: 2000
                    });
                } else {
                    this.update({form: this.form, files:this.images}).then(() => {
                        this.$uikit.notification({
                            message: 'Успешно обновлено!',
                            status: 'success',
                            pos: 'top-center',
                            timeout: 2000
                        });

                        this.$router.push('/dashboard/stadiums')
                    })
                }
            }
        },
        async mounted() {
            let form = this.form;

            await ymaps.ready(init);

            async function init() {
                let myMap = new ymaps.Map("map", {
                    center: [42.876366, 74.603710],
                    zoom: 11,
                    type: 'yandex#map'
                }, {
                    searchControlProvider: 'yandex#search'
                });
                let marker = null;

                myMap.events.add('click', function (e) {
                    if (marker) {
                        myMap.geoObjects.removeAll();
                        let coords = e.get('coords');
                        setPosition(myMap, coords);
                    } else {
                        let coords = e.get('coords');
                        setPosition(myMap, coords);
                    }

                    function setPosition(map, coords) {
                        marker = new ymaps.Placemark([coords[0].toPrecision(8), coords[1].toPrecision(8)], {
                            balloonContent: 'Наш адрес',
                            hintContent: 'Наш адрес',
                        }, {
                            iconLayout: 'default#image',
                        });

                        form.latitude = coords[0].toPrecision(8);
                        form.longitude = coords[1].toPrecision(8);
                        myMap.geoObjects.add(marker);
                    }
                });

                marker = new ymaps.Placemark([form.latitude, form.longitude], {
                    balloonContent: 'Наш адрес',
                    hintContent: 'Наш адрес',
                }, {
                    iconLayout: 'default#image',
                });

                myMap.geoObjects.add(marker);
            }
        }
    }

</script>

<style scoped>
  .content form {
    border-top: none;
  }

  .image_choose{
    display: inline-block;
    position: relative;
  }
  .pic {
    width: 8em;
    height: 8em;
    object-fit: cover;
  }
  .close_icon{
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 500px;
    position: absolute;
    top: 50%;
    color: white;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .pic {
    width: 12em;
    height: 9em;
    object-fit: cover;
  }

</style>
