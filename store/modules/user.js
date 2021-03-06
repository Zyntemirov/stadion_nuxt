import firebaseApp from '~/firebase/app'
import Cookies from 'js-cookie'

export const state = () => ({
  uid: null,
  user: null,
  admin: '',
})

export const getters = {

  uid(state) {
    if (state.user && state.user.uid) return state.user.uid
    else return null
  },

  user(state) {
    return state.user
  },

  admin(state) {
    return state.admin
  },

  isAuthenticatedAdmin(state) {
    if (parseInt(state.admin) === 1 && state.user && state.user.uid){
       return true;
    }
    else return false;
  },

  isAuthenticatedUser(state) {
    if (parseInt(state.admin) !== 1 && state.user && state.user.uid){
      return true
    }
    else return false
  }
};

export const actions = {

  async login({dispatch, state}, firebaseUser) {
    let user = firebaseUser.user;
    let token = await firebaseApp.auth().currentUser.getIdToken(true)
    const userInfo = {
      name: user.name,
      admin: null,
      phone_number: user.phone_number,
      uid: user.uid
    }

    Cookies.set('access_token', token) // saving token in cookie for server rendering
    await dispatch('setUSER', userInfo)
    await dispatch('saveUID', userInfo.uid)
    await dispatch('saveADMIN', '')
    console.log('[STORE ACTIONS] - in login, response:', status)

  },

  async logout({commit, dispatch}) {
    console.log('[STORE ACTIONS] - logout')
    await firebaseApp.auth().signOut()

    Cookies.remove('access_token');
    commit('setUSER', null)
    commit('saveUID', null)
    commit('saveADMIN', null)
  },

  saveUID({commit}, uid) {
    console.log('[STORE ACTIONS] - saveUID')
    commit('saveUID', uid)
  },

  setUSER({commit}, user) {
    commit('setUSER', user)
  },

  saveADMIN({commit}, admin) {
    commit('saveADMIN', admin)
  }

}

export const mutations = {
  saveUID (state, uid) {
    console.log('[STORE MUTATIONS] - saveUID:', uid)
    state.uid = uid
  },
  setUSER (state, user) {
    console.log('[STORE MUTATIONS] - setUSER:', user)
    state.user = user;
  },
  saveADMIN (state, admin){
    state.admin = admin;
  }
}
