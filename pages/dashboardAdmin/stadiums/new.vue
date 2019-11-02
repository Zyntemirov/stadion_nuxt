<template>
  <div class="content">
    <div class="card">
      <div class="card-header text-center">
        <h4 class="m-0">Добавить новый стадион</h4>
      </div>
      <div class="card-body">
        <div id="map" style="width: 100%; height: 400px"></div>

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
                       id="stadium_ceiling">
                <label class="custom-control-label" for="stadium_ceiling">Крыша</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.dressing_room"
                       id="stadium_dressing_room">
                <label class="custom-control-label" for="stadium_dressing_room">Раздевалки</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.lighting"
                       id="stadium_lighting">
                <label class="custom-control-label" for="stadium_lighting">Освещение</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.shower"
                       id="stadium_shower">
                <label class="custom-control-label" for="stadium_shower">Душ</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.tribune"
                       id="stadium_tribune">
                <label class="custom-control-label" for="stadium_tribune">Трибуна</label>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" v-model="form.infrastructure.parking"
                       id="stadium_parking">
                <label class="custom-control-label" for="stadium_parking">Парковка</label>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Фото</label>
            <div class="col-sm-9">
              <div>
                <input type="file" @change="uploadImage" multiple
                       accept="image/*" required>
              </div>
              <img v-for="img in images" v-bind:key="img" :src="img" class="pic">
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 text-right control-label col-form-label">Описание</label>
            <div class="col-sm-9">
                  <textarea class="form-control" v-model="form.description" placeholder="Напишите....." rows="5"
                            id="stadium_description" required></textarea>
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
        name: "new",
        components: {VueTimepicker},
        data() {
            return {
                form: {
                    name: '',
                    price: '',
                    address: '',
                    description: '',
                    open_time: '08:00',
                    close_time: '23:00',
                    imgNames: [],
                    filterByInfrastructure: '',
                    infrastructure: {
                        ceiling: false,
                        dressing_room: true,
                        lighting: true,
                        parking: false,
                        shower: false,
                        tribune: false,
                    },
                    latitude: '',
                    longitude: '',
                    type: 'Мини',
                    userId: '',
                    stadiumId: ''
                },
                images: [],
                submitted: '',
                fileObject: {}
            }
        },
        methods: {
            ...mapActions({
                addStadium: 'stadiums/add',
            }),
            uploadImage(e) {
                this.images = [];
                this.form.imgNames = [];
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
                    this.form.imgNames.push(curFiles[i].name);
                    this.images.push(URL.createObjectURL(curFiles[i]))
                }
            },
            async handleSubmit(e) {
                this.submitted = true;

                if (this.form.longitude === '') {
                    this.$uikit.notification({
                        message: 'Измените адрес на карте!',
                        status: 'warning',
                        pos: 'top-right',
                        timeout: 2000
                    });
                } else if (this.form.open_time === '' || this.form.close_time === '') {
                    this.$uikit.notification({
                        message: 'Заполните время!',
                        status: 'warning',
                        pos: 'top-right',
                        timeout: 2000
                    });
                } else if (this.form.imgNames.length === 0) {
                    this.$uikit.notification({
                        message: 'Выберите фотографий!',
                        status: 'warning',
                        pos: 'top-right',
                        timeout: 2000
                    });
                } else {
                    this.$uikit.notification({
                        message: 'Подождите!',
                        status: 'success',
                        pos: 'top-center',
                        timeout: 7000
                    });
                    this.addStadium({form: this.form, files: this.fileObject}).then(() => {
                        this.$uikit.notification({
                            message: 'Успешно добавлено!',
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
                            // iconImageClipRect: [[34,0], [62, 46]],
                            // iconImageHref: '{{ asset('public/img/marker-new.png') }}',
                            // iconImageSize: [40, 43],
                            // iconImageOffset: [-20, -50],
                        });

                        form.latitude = coords[0].toPrecision(8);
                        form.longitude = coords[1].toPrecision(8);
                        myMap.geoObjects.add(marker);
                    }
                });

                marker = new ymaps.Placemark([42.856751, 74.588584], {
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

  .pic {
    width: 12em;
    height: 9em;
    object-fit: cover;
  }
</style>
