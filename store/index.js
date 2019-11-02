import {getUserFromCookie, getUserFromSession} from '@/helpers'
import firebase from 'firebase/app'

export const actions = {

  async nuxtServerInit ({ dispatch }, { req }) {
    const user = getUserFromCookie(req)
    let databaseUser = null;
    if (user) {

      //checked user phone in database
      await firebase.database().ref('users').orderByChild('phone_number').once('value', function(snapshot) {
        snapshot.forEach(item => {
          if (item.val().phone_number.includes(user.phone_number)){
                databaseUser = item.val();
          }
        });
      });

      //if user didn't stored , we need to store
      if (databaseUser === null){
          await firebase.database().ref('users').child(user.user_id).set({
            name : 'User',
            phone_number : [user.phone_number],
            userId : user.user_id,
            admin : "",
            tokens : "",
            webToken : ""
          }).then(() =>{
            console.log('successfully stored to database');
            databaseUser['name'] = "User";
            databaseUser['admin'] = "";
          }).catch(err => {
            console.log(err);
          })
      }

      await dispatch('modules/user/saveADMIN', databaseUser.admin)
      await dispatch('modules/user/setUSER', { name: databaseUser.name, admin: databaseUser.admin, phone_number: user.phone_number, uid: user.user_id})
    }

    return Promise.all([
      dispatch('stadiums/initStore'),
    ])
  }
}
