<template>
	<div>
		<div v-if="!currentMember">
			<section class="section">
					<ul>
						<li v-for="member in allMembers">
						<div class="card allMembers">
							<div class="card-header">
								<p class="card-header-title has-text-white">
									{{member.fullname}}
    							</p>
								<div class="spacer"></div>
							</div>
							<router-link :to="{
										name: 'member',
										params: { id: member.id } }">
									<div class="card-content">
										<v-gravatar :email="member.email"/>
										{{member.email}}
										<p>
											<i class="far fa-clock"></i>
											<span class="has-text-grey"> Créer le 
											{{member.created_at}}</span>
										</p>
									</div>
							</router-link>
						</div>
						</li>	
					</ul>
			</section>
		</div>


		<div class="Member" v-if="currentMember">
			<div class="columns">
				<div class="column is-4 is-offset-1">
					<div class="card">
						<div class="card-content">
							<v-gravatar :email="currentMember.email"/>
							<h1 class="title">{{currentMember.fullname}}</h1>
							<h2 class="subtitle">Créer le : {{currentMember.created_at}}</h2>
							<h2 class="subtitle">Email : {{currentMember.email}}</h2>
							<button v-if="this.$store.state.member.id == currentMember.id" @click="deleteMember()" class="button is-danger is-outlined">Supprimer</button>
						</div>
					</div>
				</div>

				<div class="column is-6">
					<h1 class="title">Derniers messages :</h1>
					<div class="card">
						<div class="card-content">
						<p v-if="this.lastMessage.length == 0">Aucun messages trouvés</p>
							<ul>
								<li v-for="msg in this.lastMessage">
									<router-link :to="{
										name: 'discussion', 
										params: { id: msg.channel_id }
									}">
									<div class="columns">
										<p class="column is-2">{{msg.modified_at}}</p>
										<article class="message column is-10 is-warning">
										  <div class="message-body">
											<span>{{msg.message}}</span>
										  </div>
										</article>
									</div>
									</router-link>
								</li>
							</ul>
						</div>
					</div>
					<hr>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{

		methods: {
			compare(a, b) {
				// Use toUpperCase() to ignore character casing
				const dateA = a.modified_at
				const dateB = b.modified_at
				let comparison = 0;
				if (dateA > dateB) {
					comparison = 1;
				} else if (dateA < dateB) {
					comparison = -1;
				}
				return comparison;
			},

			showProfile(id){
				let count = 0
				//this.getMembers(id);
				this.currentMember = this.getMembers(id)
				axios.get('channels').then(response => {
					let channels = response.data
					for (let i=0; i<channels.length; i++){
						axios.get('channels/'+channels[i].id+'/posts').then(response => {
							let msg = response.data
							for (let j=0; j<msg.length; j++){
								//console.log(msg[j].member_id)
								if (msg[j].member_id == this.currentMember.id && count < 10 ) {
									this.lastMessage.push(msg[j])
									count += 1 
									this.lastMessage.sort(this.compare);
									this.lastMessage.reverse();
								}
							}
						})
					}
				})
			},
			loadMembers(){
				//this.allMembers = this.$store.state.members
				axios.get('members').then(response => {
					this.allMembers = response.data
          		})
				this.currentMember = false
				this.lastMessage = []
			},
			onRouteChange(){
				if(this.$route.params.id){
					this.showProfile(this.$route.params.id);
				} else {
					this.loadMembers();
				}
			},
			deleteMember(){
				axios.delete('members/'+this.currentMember.id)
				.then(response => alert(response.data.message))
				this.$router.push('/members')
				this.loadMembers()
			}
		},

		data(){
			return {
				allMembers : null,
				currentMember : false,
				lastMessage : [],
			}
		},

		watch:{
		    $route (to, from){
		    	this.onRouteChange();
		    }
		}, 	

		mounted(){
			if(this.$route.params.id){
				this.showProfile(this.$route.params.id);
			} else {
				this.loadMembers();
			}
			
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	section.section ul {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	section.section ul li {
		flex: auto;
	}

	.allMembers img{
		border-radius: 50%;
		border: 6px solid #ff7c2f;
		position: absolute;
		top: -45px;
		left: 0px;
		z-index: 1
	}

	.Member img{
		border-radius: 50%;
		width: 120px;
		border: 4px solid lightgrey ;
	}
	.allMembers a{
		text-decoration: none;
		text-decoration-style: none;
		color: black;
	}
	.allMembers{
		margin: auto;
		margin-bottom: 5em;
		width: 400px;
		border-radius: 5px;
		position: relative;
	}

	.Member .is-4 .card {
		height: 700px;
		border-radius: 5px;
		margin-top: 10px;
	}

	.Member .is-6 .card {
		max-height: 565px;
		border-radius: 5px;
		overflow: auto;
	}

	::-webkit-scrollbar {
  		width: 10px;
	}

	::-webkit-scrollbar-track {
	  background: #f1f1f1;
	}

	::-webkit-scrollbar-thumb {
	  background: #ff8d4f;
	  border-radius: 5px;
	}

	::-webkit-scrollbar-thumb:hover {
	  background: #ff7c2f;
	}


	.allMembers span{
		background-color: rgb(211, 211, 211,20%);
		padding: 2px;
		border-radius: 5px;	
	}

	.allMembers .card-content {
		padding-bottom: 4em;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		text-align: right;
	}

	.allMembers .card-content:hover {
		transition: 1s;
		background-color: lightgrey;
	}

	div.spacer {
		height: 3em;
	}

	.allMembers .card-header {
		background-color: #ff7c2f;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	.allMembers .card-header-title {
		display: block;
		text-align: right;
		font-size : 18px;
	}

	.Member .is-6 .title{
		text-align: left;
		background-color: white;
		box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
    	color: #4a4a4a;
   		max-width: 100%;
    	position: relative;
    	border-radius: 5px;
    	padding: 1.2em;
    	margin-top: 10px;
	}

	article.message {
		margin-bottom: 1.5em;
		border-left: 4px solid  #ff8d4f;
		text-align: left;
	}

	article.message:hover {
		transition: 0.5s;
		background-color: rgb(211, 211, 211,20%) ;
	}

	p.is-2 {
		color: #ff7c2f
	}

	p.is-2:hover {
		color: black;
	}

	.message {
		
	}

	.message-body {
		border-left-width: 0px;
	}
</style>
