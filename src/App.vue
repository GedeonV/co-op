<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar">
        <div class="navbar-brand">
            <a class="navbar-item">
              <img src="./assets/logo.png" width="64" height="100">
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div class="navbar-menu">
            <div class="navbar-start">
              <router-link class="navbar-item" to="/">Accueil</router-link>
              <router-link class="navbar-item" v-if="this.$store.state.member" to="/members">Membres</router-link>
              <router-link class="navbar-item" v-if="this.$store.state.member" to="/discussions">Discussions</router-link>
            </div>
            <div class="navbar-end">
              <div class="navbar-item">
                <router-link class="button is-orange" v-if="!this.$store.state.member" to="/login">Connexion</router-link> 
                <a class="button is-orange" v-if="this.$store.state.member" type="button" @click="logout()" href="#">Déconnexion</a>
              </div>
            </div>
          </div>
      </nav>
    </div>
    <router-view/>
  </div>

</template>

<style>

html{
  background-color: hsl(0, 0%, 95%) !important;     
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


#nav {
  position: sticky;
  top: 0px;
  border-bottom: 1px solid #ff8d4f;
  z-index: 1000000;
}

.navbar-item img {
  max-height: none !important;
}

.navbar-item:hover {
 color: #ff7c2f !important;
}

.router-link-exact-active {
  color: #ff7c2f !important;
}

.is-orange {
  background-color: #ff7c2f !important;
  border-color:transparent !important;
  color:#fff !important;
  font-weight: 600;
}

.is-orange:hover {
  background-color: #ff7c4f !important;
  border-color:transparent !important;
  color:#fff !important;
  font-weight: 600;
}

</style>

<script type="text/javascript">
  export default{
    methods :{
      logout(){
        this.$store.commit('logout')
        this.$router.push('login')
      }
    },

    mounted(){
      axios.get('members').then(response => {
          this.$store.commit('members',response.data);
        })

        if(this.$store.state.member == false){
          this.$router.push('login')
        }

        let header = document.createElement('script')
        header.setAttribute('src', 'https://use.fontawesome.com/releases/v5.3.1/js/all.js')
        document.head.appendChild(header)
      },

    computed : {
      tokenSet(){
        return (this.$store.state.user_token !== '') ? this.$store.state.user_token : ""
      }
    },
  }
</script>

<!-- fd794b8d0fee9d04504f7b7027c3810e497d2e52 -->