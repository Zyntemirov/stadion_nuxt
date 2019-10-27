import {getUserFromCookie, getUserFromSession} from '@/helpers'
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
  initStore({commit, rootGetters}) {
    let user = rootGetters['modules/user/user'];
    if (user) {
      return firebase.database().ref('/stadiums')
        .orderByChild("userId")
        .equalTo(user.uid)
        .once('value', (snapshot) => {
          let tempObject = {};
          snapshot.forEach((childSnapshot) => {
            tempObject[childSnapshot.val().stadiumId] = childSnapshot.val();
          });
          commit('SET_STADIUMS', tempObject)
        })
    }
  },
  async add({commit, state, dispatch, rootGetters}, data) {
    let stadiumId = await firebase.database().ref('stadiums/').push().key;
    let filterBy = "", check = 0;

    await Promise.all(Object.keys(data.files).map(async key => {
      let storageRef = await firebase.storage().ref().child('stadium/' + stadiumId + '/' + data.files[key].name);

      await storageRef.put(data.files[key])
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
          console.log(url);
        })
        .catch(console.error);
    }));

    Object.keys(data.form.infrastructure).forEach(function (key) {
      if (data.form.infrastructure[key] === true) {
        filterBy += key;
      }
    });

    data.form['filterByInfrastructure'] = filterBy;
    data.form['userId'] = rootGetters['modules/user/uid'];
    data.form['stadiumId'] = stadiumId;
    data.form['price'] = parseInt(data.form['price']);

    firebase.database().ref('stadiums/' + stadiumId).set(data.form).then(() => {
      dispatch('initStore');
    });
  },
  update({commit, state, dispatch}, id) {
    firebase.database('stadiums/' + id)
      .update(form)
      .then(() => {
        dispatch('initStore')
      })
  },
  delete({commit, state, dispatch}, {id}) {
    firebase.database().ref('stadiums/' + id).remove()
      .then(() => {
        console.log('successfully removed')
        dispatch('initStore');
      })
      .catch((error) => {
        console.log('Удалить не удалось: ' + error.message);
      });
  },
  async deleteOneImg({commit, state, dispatch}, data) {
    let stadium = Object.assign({},state.list[data.id]);
    let images = [];
    await stadium.imgNames.forEach(img =>{
      if (data.name !== img){
        images.push(img);
      }
    });

    stadium['imgNames'] = images;

    firebase.database().ref('stadiums/' + data.id + '/imgNames/' + data.index)
      .remove()
      .then(function () {
        console.log('successfully removed one image');
      }).catch(function (error) {
      console.log('Удалить не удалось: ' + error.message);
    });
  }
};
