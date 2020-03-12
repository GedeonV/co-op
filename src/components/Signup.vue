<template>
	<div class="container">
		<div class="card">
			<div class="card-header">
				<p class="card-header-title has-text-white">Inscription</p>
			</div>

			<div class="card-content">
				<div class="field">
					<label class="label">Nom</label>
					<div class="control">
						<input v-model="fullname" class="input is-rounded" v-bind:class="{'is-danger' : missingInfo}" type="text" name="nom" placeholder="Nom">
					</div>
				</div>

				<div class="field">
					<label class="label">Email</label>
					<div class="control">
						<input v-model="email" class="input is-rounded" v-bind:class="{'is-danger' : missingInfo}" type="text" name="email" placeholder="Email">
					</div>
				</div>

				<div class="field">
					<label class="label">Mot de passe</label>
					<div class="control">
						<input v-model="password" class="input is-rounded" v-bind:class="{'is-danger' : missingInfo, 'is-danger': wrongPassword}" type="password" name="psswd" placeholder="Mot de passe">
					</div>
				</div>

				<div class="field">
					<div class="control">
						<input v-model="password2" class="is-rounded input" v-bind:class="{'is-danger' : missingInfo, 'is-danger' : wrongPassword }" type="password" name="psswd" placeholder="Mot de passe">
						<p v-if="wrongPassword" class="help is-danger">Les mots de passe ne sont pas identiques</p>
						<p v-if="passwordRequirement" class="help is-danger">Le mot de passe doit contenir minimum 4 caractères</p>
					</div>
				</div>
					
				<div class="field">
					<div class="control">
						<button @click="signup()" class="button is-link is-orange">Envoyer</button>
						<p v-if="missingInfo" class="help is-danger">Informations manquantes</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name : 'Signup',
	data() {
		return{
			fullname : "",
			email : "",
			password : "",
			password2 : "",
			wrongPassword : false,
			missingInfo : false,
			passwordRequirement : false,  
			}
	},
	methods : {
		signup(){
			let informations = {}
			informations.fullname = this.fullname
			informations.email = this.email 
			informations.password = this.password 
			console.log(informations)
			this.wrongPassword = false
			if(this.password.length > 3){
				this.passwordRequirement = false
				if(this.password == this.password2){
					this.wrongPassword = false
					axios.post('members',informations)
					.then(response => {
							console.log(response)
							this.$router.push('login')
						}
					).catch(error => {
	    				console.log(error.response)
	    				this.missingInfo = true;
					});
				} else {
					this.wrongPassword = true
				}
			} else {
				this.passwordRequirement = true
			}
		}
	}
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
