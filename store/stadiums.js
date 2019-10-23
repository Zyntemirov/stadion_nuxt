import {getUserFromCookie, getUserFromSession} from '@/helpers'
import {firestore} from '~/firebase/app'
import firebase from 'firebase/app'

export const state = () => ({
  list: null
});

export const getters = {
  stadiums: state => state.list
};

export const mutations = {
  SET_STADIUMS: (state, stadiums) => {
    state.list = stadiums
  }
};

export const actions = {
  initStore({commit}, user) {
    if (user){
      return firebase.database().ref('/stadiums')
        .orderByChild("userId")
        .equalTo(user.user_id)
        .once('value', (snapshot) => {
          let tempObject = {};
          snapshot.forEach((childSnapshot) => {
            tempObject[childSnapshot.val().stadiumId] = childSnapshot.val();
          });
          commit('SET_STADIUMS', tempObject)
        })
    }
  },
  async add({commit, state, dispatch}, data) {
    await firestore.collection('gbr').where('phone_number', '==', data.phone_number).get()
      .then(querySnapshot => {
        if (querySnapshot.size !== 0) {
          querySnapshot.forEach(doc => {
            firestore.collection('gbr').doc(doc.id).delete();
          })
        }
      });

    firestore.collection('stadiums')
      .add({
        ...data,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        dispatch('initStore');
      })
  },
  update({commit, state, dispatch}, {id, active}) {
    firestore.collection('stadiums')
      .doc(id)
      .update({
        active: active
      })
      .then(() => {
        dispatch('initStore')
      })
  },
  updateClient({commit, state, dispatch}, {id, form}) {
    let birthDate = firebase.firestore.Timestamp.fromDate(form.birth_date);
    firestore.collection('stadiums')
      .doc(id)
      .update({
        name: form.name,
        surname: form.surname,
        student_id: form.student_id,
        birth_date: birthDate,
        address: form.address,
        gender: form.gender,
      })
      .then(() => {
        dispatch('initStore')
      })
  }
  ,
  delete({commit, state, dispatch}, {id}) {
    firestore.collection('stadiums')
      .doc(id)
      .delete()
      .then(() => {
        dispatch('initStore')
      })
  }
};
