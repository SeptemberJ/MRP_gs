import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const state = {
  userInfo: null,
  filterOrderNo_MRP: '',
  filterPerson_MRP: '',
  filterCode_MRP: '',
  ifHasTF_MRP: false,
  orderMRPId: ''
}

const actions = {
  unitUserInfo ({commit, state}, Info) {
    commit('setUserInfo', Info)
  },
  updateOrderMRPId ({commit, state}, OrderMRPId) {
    commit('setOrderMRPId', OrderMRPId)
  }
}

const mutations = {
  setOrderMRPId (state, OrderMRPId) {
    state.orderMRPId = OrderMRPId
  },
  setUserInfo (state, Info) {
    state.userInfo = Info
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [vuexLocal.plugin]
})
