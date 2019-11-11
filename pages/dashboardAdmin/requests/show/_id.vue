<template>
  <div class="content">
    <div class="card">
      <div class="card-header text-center">
        <h4 class="m-0">Запрос на аренду {{ stadium }}</h4>
      </div>
      <div>
        <client-only placeholder="Loading...">
          <FullCalendar
            ref="fullCalendar"
            defaultView="timeGridWeek"
            :header="{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,listWeek'
          }"
            :plugins="calendarPlugins"
            :weekends="calendarWeekends"
            :events="calendarEvents"
            @dateClick="handleDateClick"
          />
          <comments />
        </client-only>
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

    export default {
        name: "show",
        components: {
            FullCalendar // make the <FullCalendar> tag available
        },
        data() {
            return {
                stadium: '',
                calendarPlugins: [ // plugins must be defined in the JS
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                calendarWeekends: true,
                calendarEvents: [ // initial event data
                    {title: 'Event Now', start: new Date()}
                ]
            }
        },
        beforeMount: function () {
            this.$nextTick(() => {
                this.readOneStadium();
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

            readOneStadium() {
                let stadiumRef = firebase.database().ref('/stadiums').orderByChild("stadiumId").equalTo(this.$route.params.id);
                stadiumRef.once('value', (snapshot) => {
                    this.stadium = snapshot.val()[this.$route.params.id].name;
                })
            }
        },
    }

</script>

<style>
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
