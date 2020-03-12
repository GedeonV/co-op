<template>
	<div class="container">
		
		<div class="card">
			<div class="card-header">
				<p class="card-header-title has-text-white">Login</p>
			</div>

			<div class="card-content">
				<div class="field">
					<label class="label">Email</label>
					<div class="control">
						<input v-model="email" class="is-rounded input" v-bind:class="{'is-danger' : missingEmail }" type="text" name="email" placeholder="Email">
						<p v-show="missingEmail" class="help is-danger">Le champ doit être rempli</p>

					</div>
				</div>

				<div class="field">
					<label class="label">Mot de passe</label>
					<div class="control">
						<input v-model="password" class="is-rounded input" v-bind:class="{'is-danger' : missingPassword, 'is-danger' : wrongPassword }" type="password" name="psswd" placeholder="Mot de passe">
						<p v-if="missingPassword" class="help is-danger">Le champ doit être rempli</p>
					</div>
				</div>
				
				<div class="field">
					<div class="control">
						<button @click="signin()" class="button is-link is-orange">Envoyer</button>
						<p v-if="wrongLog" class="help is-danger">Mauvais email / mot de passe</p>
					</div>
				</div>
			</div>

			<footer class="card-footer">
				<div class="card-content">
					<div class="field">
						<div class="control">
							<router-link to="/signup">Pas inscrit ?</router-link>
						</div>	
					</div>
				</div>
			</footer>
		</div>

	</div>
</template>

<script>
	export default {
		name : 'Login',
		data(){
			return {
				email : "zinni.arthur@gmail.com",
				missingEmail : false,
				password : "1234",
				password2 : "1234",
				missingPassword : false,
				wrongLog : false,
				wrongPassword : false,
			}
		},
		mounted() {

		},
		methods :{
		signin(){
			if(this.email.length > 0){
				if (this.password.length > 0) {
						let log = {}
						log.email = this.email
						log.password = this.password
						console.log(log)
						axios.post('members/signin',log).then(response => {
							this.$store.commit('token',response.data)
							this.$router.push("/")
						}).catch(error => {
    						console.log(error.response)
    						this.wrongLog = true;
						});
				} else {
					this.missingPassword = true;
				}
			} else {
					this.missingEmail = true;
			}
		}
		},
	}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.card{
		border-radius: 10px;
		width: 500px;
		margin: auto;
		margin-top: 10px;
	}

	.control a {
		color: #ff7c2f !important;
	}

	.control a:hover {
		color: grey !important;
	}

	.card-header {
		background-color: #ff7c2f;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
</style>
