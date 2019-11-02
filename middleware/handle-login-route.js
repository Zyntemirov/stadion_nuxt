export default function ({ store, redirect }) {
  if (store.getters['modules/user/isAuthenticatedAdmin']) {
    return redirect('/dashboardAdmin')
  }
  else if(store.getters['modules/user/isAuthenticatedUser']){
    return redirect('/dashboardUser')
  }
}
