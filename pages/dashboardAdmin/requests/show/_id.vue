<template>
  <div class="content">
    <div class="card">
      <div class="card-header text-center">
        <h4 class="m-0 bol">Запрос на аренду {{ stadium }}</h4>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <div class="m-15" align="center">
            <strong>Принят/отклонить</strong>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-md-12" ref="modalClose">
                <div v-for="(request, key) in waitingRequests" v-bind:key="key">
                  <a :href="'#add-new-event-' + request.book_id" uk-toggle @click="showModal(true)">
                    <i class="fa fa-circle text-info m-r-10"></i>{{ request.user_phone }}
                  </a>

                  <!-- Modal Add Category -->
                  <div :id="'add-new-event-'+request.book_id" uk-modal v-if="currentModal">
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                      <button class="uk-modal-close-outside" type="button" uk-close></button>
                      <div class="uk-modal-header"><h4 align="center"><strong>Принять</strong> запрос на бронирование
                      </h4></div>

                      <form style="padding-top: 15px; padding-bottom: 15px ">
                        <div class="row">
                          <div class="col-md-6">
                            <label class="control-label">Имя клиента</label>
                            <input class="form-control form-white" :value="request.user_name" type="text"
                                   name="user-name" readonly/>
                          </div>
                          <div class="col-md-6">
                            <label class="control-label">Телефон номер</label>
                            <input class="form-control form-white" :value="request.user_phone" type="text"
                                   name="phone-number" readonly/>
                          </div>
                        </div>
                        <div class="row m-t-5 pt-2">
                          <div class="col-md-6">
                            <label class="control-label">Дата</label>
                            <input class="form-control form-white" :value="request.date" type="text"
                                   name="user-name" readonly/>
                          </div>
                          <div class="col-md-6">
                            <label class="control-label">Время</label>
                            <input class="form-control form-white"
                                   :value="'с '+ request.start_time+ ' по ' + request.end_time" type="text"
                                   name="phone-number" readonly/>
                          </div>
                        </div>
                        <div class="row m-t-5 pt-2">
                          <div class="col-md-6">
                            <label class="control-label">Общая сумма</label>
                            <input class="form-control form-white" :value="request.totalPrice + ' сом'"
                                   type="text"
                                   name="user-name" readonly/>
                          </div>
                        </div>
                      </form>

                      <div class="uk-modal-footer" align="center">
                        <button type="button" @click="AcceptRequest(request.book_id , request.receiver , request.stadium_id, key)"
                                class="btn btn-success waves-effect waves-light save-category">Принять
                        </button>
                        <button type="button"
                                @click.prevent="RejectRequest(request.book_id , request.receiver , request.stadium_id)"
                                class="btn btn-danger waves-effect">Отклонить
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-10">
          <client-only placeholder="Loading...">
            <FullCalendar
              class="m-15"
              locale="ru"
              defaultView="timeGridWeek"
              slotDuration='00:30:00'
              slotLabelInterval='00:30:00'
              minTime='06:00:00'
              max-time='24:00:00'
              defaultTimedEventDuration='01:00:00'
              eventColor='#378006'
              :slotLabelFormat="{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
              }"
              :header="{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay,listWeek'
              }"
              :plugins="calendarPlugins"
              :weekends="calendarWeekends"
              :events="acceptedRequests"
              @dateClick="handleDateClick"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import firebase from 'firebase/app'
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import timeGridPlugin from '@fullcalendar/timegrid'
    import interactionPlugin from '@fullcalendar/interaction'

    import '@fullcalendar/core/locales/ru'

    export default {
        name: "show",
        components: {
            FullCalendar // make the <FullCalendar> tag available
        },
        data() {
            return {
                stadium: '',
                acceptedRequests: [],
                waitingRequests: [],
                calendarPlugins: [ // plugins must be defined in the JS
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                calendarWeekends: true,
                calendarEvents: [ // initial event data
                    {title: 'Event Now', start: new Date()}
                ],

                currentModal: false
            }
        },
        beforeMount: function () {
            this.$nextTick(() => {
                this.readOneStadium();
                this.getAcceptedRequests();
                this.getWaitingRequests();
            })
        },
        methods: {
            handleDateClick(arg) {
                if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
                    this.calendarEvents.push({ // add new event data
                        title: 'New Event',
                        start: arg.date,
                        allDay: arg.allDay
                    })
                }
            },

            async AcceptRequest(book_id, admin_id, stadium_id, index){
                await firebase.database().ref('/books/' + book_id).update({
                    status: "accepted",
                    status_stadium_id: 'accepted'+admin_id+stadium_id
                });

                await this.$uikit.notification('Вы успешно приняли!', {
                    pos: 'top-center',
                    status: 'success',
                    timeout: 3000
                });

                this.showModal(false);

                await this.acceptedRequests.push({
                    title: this.waitingRequests[index].user_name + ' ' + this.waitingRequests[index].user_name,
                    start: this.waitingRequests[index].date + ' ' + this.waitingRequests[index].start_time,
                    end: this.waitingRequests[index].date + ' ' + this.waitingRequests[index].end_time,
                    editable: false,
                    selectAllow: false,
                });
                await this.waitingRequests.splice(index,1);
            },

            async RejectRequest(book_id, admin_id, stadium_id){
                await firebase.database().ref('/books/' + book_id).update({
                    status: "rejected",
                    status_stadium_id: 'rejected'+admin_id+stadium_id
                });

                this.$uikit.notification('Вы успешно отменили!', {
                    pos: 'top-center',
                    status: 'warning',
                    timeout: 3000
                });

                this.showModal(false);

                this.waitingRequests.splice(key,1);
            },

            readOneStadium() {
                let stadiumRef = firebase.database().ref('/stadiums').orderByChild("stadiumId").equalTo(this.$route.params.id);
                stadiumRef.once('value', (snapshot) => {
                    this.stadium = snapshot.val()[this.$route.params.id].name;
                })
            },

            getAcceptedRequests() {
                let acceptedRef = firebase.database().ref('/books').orderByChild('status_stadium_id').equalTo('accepted' + this.$store.getters['modules/user/uid'] + this.$route.params.id)
                acceptedRef.once('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        this.acceptedRequests.push({
                            title: childSnapshot.val().user_name + ' ' + childSnapshot.val().user_phone,
                            start: childSnapshot.val().date + ' ' + childSnapshot.val().start_time,
                            end: childSnapshot.val().date + ' ' + childSnapshot.val().end_time,
                            editable: false,
                            selectAllow: false,
                        });
                    })
                })
            },

            getWaitingRequests() {
                let waitingRef = firebase.database().ref('/books').orderByChild('status_stadium_id').equalTo('waiting' + this.$store.getters['modules/user/uid'] + this.$route.params.id)
                waitingRef.once('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        this.waitingRequests.push(childSnapshot.val());
                    })
                })
            },

            showModal(flag){
                this.currentModal = flag;
            },
        },
    }

</script>

<style>
  .m-15 {
    margin: 15px;
  }

  .content form {
    border-top: none;
  }

  .image_choose {
    display: inline-block;
    position: relative;
  }

  .pic {
    width: 8em;
    height: 8em;
    object-fit: cover;
  }

  .close_icon {
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

  .no-ssr-placeholder {
    color: #41b883;
  }
</style>
