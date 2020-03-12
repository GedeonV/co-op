import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './../node_modules/bulma/css/bulma.css'
import axios from 'axios'
import Gravatar from 'vue-gravatar';

Vue.component('v-gravatar', Gravatar);

import { tools } from './tools'
Vue.mixin(tools);

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

 window.axios = axios.create({
        baseURL: 'https://tools.sopress.net/iut/coop/api/',
        params : {
          token : false
        },
        headers: {'Authorization': "fd794b8d0fee9d04504f7b7027c3810e497d2e52"}
        });

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
  	window.axios.interceptors.request.use((config) => {
  		if(this.$store.state.user_token){
  			config.url+='?token='+this.$store.state.user_token  		
  		}
  		return config
  	}, error => {
  		return console.log(error)
  	}
  	)
  }
}).$mount('#app')
