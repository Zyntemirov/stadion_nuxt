<template>
  <section class="container">
    <div>
      <form @submit.prevent="signUp">
        <label for="usernameTxt">Phone number:</label>
        <input id="usernameTxt" type="text" v-model="number">
        <div id="recaptcha-container"></div><br>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </section>
</template>


<script>
import { mapActions } from 'vuex'
import firebaseApp from '~/firebase/app'
import firebase from 'firebase'
export default {
  data () {
    return {
      number: '',
      appVerifier : '',
      // password: ''
    }
  },
  methods: {
    ...mapActions('modules/user', [ 'login' ]),
    async signUp () {
      try {
          if(this.number.length !== 13){
              this.$uikit.notification('Неверный номер телефона!', {
                  pos: 'top-center',
                  status: 'danger',
                  timeout: 3000
              });
          }
          else {
              firebaseApp.auth().signInWithPhoneNumber(this.number, this.appVerifier)
                  .then(async function (confirmationResult) {
                      // SMS sent. Prompt user to type the code from the message, then sign the
                      // user in with confirmationResult.confirm(code).
                      window.confirmationResult = confirmationResult;

                      // await this.login(firebaseUser.uid)
                      this.$router.push('/protected');

                      alert('SMS sent')
                  }).catch(function (error) {
                  // Error; SMS not sent
                  // ...
                  alert('Error ! SMS not sent')
              });
          }
      } catch (error) {
        console.log(error.message)
      }
    },
    initReCaptcha(){
        setTimeout(()=>{
            let vm = this;
            this.appVerifier  = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': function(response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                },
                'expired-callback': function() {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    // ...
                }
            });
        },1000)
    }
},
  created(){
      this.initReCaptcha();
  }
}
</script>

<style scoped>
  form {
    padding: 16px;
  }

  input[type=text], input[type=password] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  button {
    background-color: #4CAF50;
    color: white;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    opacity: 0.8;
  }

  .container {
    padding: 16px;
    max-width: 400px;
  }

</style>

