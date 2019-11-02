export default function ({ store, redirect }) {
  if (!store.getters['modules/user/isAuthenticatedUser']) {
    return redirect('/')
  }
}
