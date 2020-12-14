import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import transaction from './modules/transaction'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    transaction
  },
  getters
})

export default store
