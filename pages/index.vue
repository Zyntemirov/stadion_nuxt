<template>
  <section class="container">
    <div>
      <form @submit.prevent="signUp">
        <label for="usernameTxt">Телефон номер:</label>
        <input id="usernameTxt" type="text" v-model="number"
               onkeypress="return event.charCode >= 48 && event.charCode <= 57"
               maxlength="13"
        >
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
                number: '+996',
                appVerifier : '',
            }
        },
        computed: {
            user() {
                return firebaseApp.auth().currentUser;
            }
        },
        middleware: ['handle-login-route'],
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
                        // 'recaptcha-container' is the ID of an element in the DOM.
                        let firebaseUser = null;
                        let provider =await new firebase.auth.PhoneAuthProvider();
                        await provider.verifyPhoneNumber(this.number, this.appVerifier)
                            .then(async function(verificationId) {
                                let verificationCode = await window.prompt('Please enter the verification ' +
                                    'code that was sent to your mobile device.');
                                return firebase.auth.PhoneAuthProvider.credential(verificationId,
                                    verificationCode);
                            })
                            .then(async function(phoneCredential) {
                                firebaseUser = await firebaseApp.auth().signInWithCredential(phoneCredential);
                            })
                            .catch((error) => {
                                console.log(error.message);
                                this.$uikit.notification.closeAll();

                                this.$uikit.notification('Неправильный код!', {
                                    pos: 'top-center',
                                    status: 'danger',
                                    timeout: 3000
                                });
                            })
                            .finally(() =>{
                                if (firebaseUser){
                                    this.login(firebaseUser).then(() =>{
                                        this.$uikit.notification.closeAll();
                                        // window.location.reload();
                                    });
                                }
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
        mounted(){
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
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    opacity: 0.8;
  }

  label{
    color: white;
  }
  .container {
    padding: 16px;
    max-width: 400px;
  }

</style>

