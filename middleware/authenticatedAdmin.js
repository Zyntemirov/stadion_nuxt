export default function ({ store, redirect }) {
  if (!store.getters['modules/user/isAuthenticatedAdmin']) {
    return redirect('/')
  }
}
