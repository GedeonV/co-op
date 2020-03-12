import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const vp = new VuexPersist({
	key: 'store',
	storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins : [vp.plugin],
  
  state: {
    user_token : '',
    member: false,
    //members: false
  },

  mutations: {

    members(state, data){
     state.members = data;
    },

    token(state, data){
      state.member = data.member;
      state.user_token = data.token ;
    },

    logout(state){
      state.user_token = "";
      state.member = false;
      //state.members = false;
    }
  }
})
