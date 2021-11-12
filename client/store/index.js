export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
  getUserInfo(state) {
    return state.auth.user;
  }
};