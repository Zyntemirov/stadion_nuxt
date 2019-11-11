<template>
  <div class="content">
    <div class="card">
      <div class="card-header text-center">
        <h4 class="m-0">История заказов {{ stadium }}</h4>
      </div>
      <div class="card-body" style="padding: 15px">
          <div class="table-responsive" v-if="historiesList.length !== 0">
            <table id="zero_config" class="table table-striped table-bordered">
              <thead>
              <tr style="text-align: center">
                <th>Имя клиента</th>
                <th>Телефон номер клиента</th>
                <th>Общий сумма</th>
                <th>Дата</th>
                <th>начальное время</th>
                <th>окончания время</th>
                <th>Статус</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(history,key) in historiesList" v-bind:key="key" style="text-align: center">
                <td style="width: 20%"> {{ history.user_name }} </td>
                <td style="width: 15%"> {{ history.user_phone }}</td>
                <td style="width: 15%"> {{ history.totalPrice }} сом</td>
                <td style="width: 15%"> {{ history.date }} </td>
                <td style="width: 15%;"> {{ history.start_time }}</td>
                <td style="width: 15%"> {{ history.end_time }}</td>
                <td v-if="history.status === 'accepted'" style="background-color: chartreuse"> Принято </td>
                <td v-else-if="history.status === 'rejected'" style="background-color: red"> Отклонено </td>
                <td v-else style="background-color: #e0a800"> Ожидание </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="table-responsive" v-else-if="check && historiesList.length === 0">
            <h5 class="m-0">Нет история заказов</h5>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
    import firebase from 'firebase/app'

    export default {
        name: "show",
        data() {
            return {
                historiesList: [],
                stadium: '',
                check: false
            }
        },
        beforeMount: function () {
            this.$nextTick(() => {
                this.readHistoriesByStadiumId();
                this.readOneStadium();
            })
        },
        methods: {
            readHistoriesByStadiumId() {
                let historiesRef = firebase.database().ref('/books').orderByChild("stadium_id").equalTo(this.$route.params.id);
                historiesRef.once('value', (snapshot) => {
                    for (let i = Object.keys(snapshot.val()).length - 1; i >= 0 ; i--){
                        this.historiesList.push(snapshot.val()[Object.keys(snapshot.val())[i]])
                    }
                });

                setTimeout(() =>{
                    this.check = true
                },500);
            },

            readOneStadium(){
                let stadiumRef = firebase.database().ref('/stadiums').orderByChild("stadiumId").equalTo(this.$route.params.id);
                stadiumRef.once('value', (snapshot) => {
                    this.stadium = snapshot.val()[this.$route.params.id].name;
                })
            }
        },
    }

</script>

<style scoped>
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

</style>
