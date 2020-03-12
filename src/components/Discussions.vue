<template>
	<div>
		<div class="columns">
			<div class="column is-3">
				<div class="banner"></div>
				<ul>
					<li v-for="item in this.channels">
						<div v-if="$route.params.id == item.id" class="active">
							<router-link :to="{
								name: 'discussion', 
								params: { id: item.id }}">
								<p>{{item.label}} <span class="time">{{item.created_at}}</span></p>
								<p>Sujet: {{item.topic}}</p>
								
							</router-link>
							<a @click="deleteChannel(item.id)">
								<span class="icon has-text-danger">
			  						<i class="fas fa-trash-alt"></i>
								</span>
							</a>
							<a @click="showModalChannel(item.id, item.label, item.topic)">
								<span class="icon has-text-success">
			  						<i class="fas fa-edit"></i>
								</span>
							</a>
						</div>

						<div v-else>
							<router-link :to="{
								name: 'discussion', 
								params: { id: item.id }}">
								<p>{{item.label}} <span class="time">{{item.created_at}}</span></p>
								<p>Sujet: {{item.topic}}</p>
								
							</router-link>
							<a @click="deleteChannel(item.id)">
								<span class="icon has-text-danger">
			  						<i class="fas fa-trash-alt"></i>
								</span>
							</a>
							<a @click="showModalChannel(item.id, item.label, item.topic)">
								<span class="icon has-text-success">
			  						<i class="fas fa-edit"></i>
								</span>
							</a>
						</div>
					</li>
				</ul>
			</div>

			<div class="column is-9">
				<div class="banner-2"></div>
				<div v-if="currentChannel== null">
					<div class="card">
						<div class="card-header">
							<p class="card-header-title has-text-white">Créer une discussions</p>
						</div>
						<div class="card-content">
							<div class="field">
								<label class="label">Nom</label>
								<div class="control">
									<input v-model="chan_name" class="input is-rounded" type="text" name="chan_name" placeholder="Nom de la discussions">
								</div>
							</div>

							<div class="field">
								<label class="label">Sujet</label>
								<div class="control">
									<input v-model="topic" class="input is-rounded" type="text" name="topic" placeholder="Sujet de la discussions">
								</div>
							</div>

							<div class="field">
								<div class="control">
									<button @click="submit()" class="button is-link is-orange">Envoyer</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="current" v-if="currentChannel">
					<p v-if="this.messages.length == 0">Aucun messages trouvés</p>
					<ul v-else>
						<li v-for="msg in this.messages">
							<router-link :to="{
										name: 'member',
										params: { id: msg.member_id}
							}">
							<v-gravatar :email="getMemberEmail(msg.member_id)"/>
							{{getMemberName(msg.member_id)}}
							</router-link>
							<span>:</span>
							{{msg.message}}
							<a v-if="$store.state.member.id == msg.member_id" @click="deleteMsg(msg.id)">
								<span class="icon has-text-danger">
			  						<i class="fas fa-trash-alt"></i>
								</span>
							</a>
							<a v-if="$store.state.member.id == msg.member_id" @click="showModalMsg(msg.id, msg.message)">
								<span class="icon has-text-success">
			  						<i class="fas fa-edit"></i>
								</span>
							</a>
							<hr>
						</li>
					</ul>
				</div>
			</div>
			<div v-if="currentChannel" class="field inputText">
				<div class="control">
					<input @keyup.13="sendMessage()" v-model="message" type="text" name="message" placeholder="Envoyer un message">
				</div>
			</div>
		</div>

		
		<div class="modal" v-bind:class="{'is-active' : isActiveMsg }">
			  <div class="modal-background"></div>
			  <div class="modal-content">
			  	<h1 class="title has-text-white">Changements :</h1>
			  	<div class="field">
					<div class="control">
						<input @keyup.13="changeMessage()" class="input is-medium" v-model="messageED" type="text" placeholder="Message a édité">
					</div>
			  	</div>
			  </div>
			  <button class="modal-close is-large" @click="closeModal" aria-label="close"></button>
		</div>

		<div class="modal" v-bind:class="{'is-active' : isActiveChannel }">
			  <div class="modal-background"></div>
			  <div class="modal-content">
			  	<h1 class="title has-text-white">Changements :</h1>
			  	<div class="field">
					<div class="control">
						<input class="input is-medium" v-model="channelTitleED" type="text" placeholder="Nom">
					</div>
			  	</div>
			  	<div class="field">
					<div class="control">
						<input @keyup.13="changeChannel()" class="input is-medium" v-model="channelDescED" type="text" placeholder="Sujet">
					</div>
			  	</div>
			  </div>
			  <button class="modal-close is-large" @click="closeModal" aria-label="close"></button>
		</div>
	</div>
</template>

<script>
	export default{
		methods :{

			submit(){
				let data = {}
				data.label = this.chan_name
				data.topic = this.topic 
				axios
				.post('channels',data)
				.then(response => console.log(response.data))
			},
			loadChannel(){
				axios.get('channels/'+this.$route.params.id).then(response => {
					this.currentChannel = response.data;
					this.loadMsg();
					this.loadChannels();
				})
			},
			loadChannels(){
				axios
				.get('channels')
				.then(response => {
					this.channels = response.data;
				});
			},
			loadMsg(){
				if(this.currentChannel){
					axios
					.get('channels/'+this.currentChannel.id+'/posts')
					.then(response => {
						console.log("Messages loaded");
						this.messages = response.data.reverse();
					});
				}
			},
			sendMessage(){
				let msgData = {};
				msgData.message = this.message
				axios.post('channels/'+this.currentChannel.id+'/posts', msgData)
				.then(response => {
					console.log("Messages sended");
					this.loadMsg()
					this.message = ""		
				});
			},
			deleteMsg(id){
				axios.delete('channels/'+this.currentChannel.id+'/posts/'+id)
				.then(response => {
					console.log(response.data)
					this.loadMsg()
				})
			},
			deleteChannel(id){
				axios.delete('channels/'+id)
				.then(response => {
					console.log(response.data)
					this.loadChannels()
				})
			},

			changeMessage(){
				let msgEdit = {}
				msgEdit.message = this.messageED
				axios.put('channels/'+this.currentChannel.id+'/posts/'+this.temporyMsgID, msgEdit)
				.then(response => {
					console.log(response.data)
					this.loadMsg()
				})
				this.closeModal()
			},

			changeChannel(){
				let channelEdit = {}
				channelEdit.label = this.channelTitleED
				channelEdit.topic = this.channelDescED
				axios.put('channels/'+this.temporyChannelID, channelEdit)
				.then(response => {
					console.log(response.data)
					this.loadChannels()
				})
				this.closeModal()
			},
			showModalMsg(id, msg){
				this.isActiveMsg = true
				this.temporyMsgID = id 
				this.messageED = msg
			},
			showModalChannel(id, title, desc){
				this.isActiveChannel = true
				this.temporyChannelID = id
				this.channelTitleED = title
				this.channelDescED = desc
			},
			closeModal(){
				this.isActiveMsg = false
				this.isActiveChannel = false
				this.temporyMsgID = ''
			},

			onRouteChange(){
				if(this.$route.params.id){
					this.loadChannel();
				} else {
					this.loadChannels();
				}
			}
		}, 
		data(){
			return {
				isActiveMsg : false,
				isActiveChannel : false, 
				currentChannel : null,
				channels : null,
				messages : [],
				topic : '',
				chan_name: '',
				message: '',
				messageED : '',
				channelTitleED: '',
				channelDescED: '',
				temporyMsgID : '',
				temporyChannelID : '',
//				token: this.$store.state.user_token
			}
		},
		watch:{
		    $route (to, from){
		    	this.onRouteChange();
		    }
		}, 		
		mounted(){
			if(this.$route.params.id){
				this.loadChannel();
			} else {
				this.loadChannels();
			}
			this.$bus.$on('reloadChannel', this.loadChannel);
			setInterval(this.loadChannel, 1000)
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	
	.card{
		border-radius: 10px;
		width: 500px;
		margin: auto;
	}

	.card-header {
		background-color: #ff7c2f;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	
	div.inputText{
		position: absolute;
		bottom: 1em;
		left: 25%;
	}
	div.inputText input{
			padding: 10px;
			border: 2px solid #ff7c2f;
			border-radius: 15px;
			width: 450px;
			margin-left: 100%;
			font-weight: 500;
	}

	div.inputText input:focus{
		outline: none;
	}

	li p {
		color: white;
	}

	div.columns {
     margin-left: 0rem; 
     margin-right: 0rem; 
     margin-top: 0rem;
     position: relative;
    }

	div.banner{
		height: 6em;
		background-color: #ff7c2f;
		box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
		margin-bottom: 10px
	}

	div.banner-2{
		width: 100%;
		height: 6em;
		background-color: rgb(211, 211, 211,20%);
		box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
		margin-bottom: 10px
	}

	.fas {
		cursor: pointer
	}
	img{
		border-radius: 50%;
		width: 64px;
		vertical-align: middle;
	}

	.columns {
		margin-bottom: 0px !important;
	}

	.column:first-of-type {
		background-color: #ff7c3f ;
		height: 870px; 
		max-height: 870px;
		padding: 0px;
	}

	.column:nth-of-type(2) {
		background-color: rgb(211, 211, 211,10%);
		max-height: 870px;
		padding: 0px;
	}

	.column .current{
		max-height: 750px;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.column .current ul {
		position: relative;
		text-align: left;
		padding: 10px;
		padding-left: 15px;
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


	.is-3 li {
		text-align: left;
		padding: 10px;
		border-bottom: 1px solid white;
	}
	
	.is-3 li:hover {
		background-color: #ff8d4f;
	}

	.is-3 ul {

	}

	span.time{
		font-size: 12px;
		color: rgb(211, 211, 211,100%);
		padding-left: 60%
	}

	.modal-close {
		position: relative;
		top: -25%;
		right: -25%;
	}

	li .active {
		background-color: rgb(211, 211, 211,30%);
		padding: 5px;
		border-radius: 10px;
	}
</style>
