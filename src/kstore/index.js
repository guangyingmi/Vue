import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0,
    sum: 1
  },
  mutations: {
    add(state) {
      state.counter++
    }
  },
  actions: {
    add({commit}) {
      setTimeout(()=>{
        commit('add')
      }, 2000)
    }
  },
  getters: {
    doubleCounter(state) {
      return state.counter * 2
    },
    addCounter(state) {
      return state.counter + 10
    }
  },
  modules: {
  }
})
