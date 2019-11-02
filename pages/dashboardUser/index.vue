<template>
  <div class="content">
    <div class="card-body">
      <div class="row" style="margin-top: 10px">
        <div class="col-sm-12">
          <div>
            Protected page --- only authenticated users can see this
          </div>
          <div v-if="user">
            <div>
              User ID: {{ uid }}
            </div>
            <h3>Current User: {{user.name}}</h3>
            <img v-if="user.avatar" :src="user.avatar" alt="">
            <div>
              All DB Users: {{ allusers }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import firebaseApp from '~/firebase/app'

    export default {
        layout: 'dashboard',
        data() {
            return {
                allusers: []
            }
        },
        computed: {
            ...mapGetters('modules/user', [
                'uid',
                'user'
            ])
        },
        mounted: function () {
            this.$nextTick(() => {
                this.readAllUsersFromDB()
            })
        },
        methods: {
            readAllUsersFromDB() {
                var usersRef = firebaseApp.database().ref('/users')
                usersRef.once('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        this.allusers.push(childSnapshot.val())
                    })
                })
            }
        }
    }
</script>
