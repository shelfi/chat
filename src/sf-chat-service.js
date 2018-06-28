//import angular from 'angular';
import { ChatManager, TokenProvider } from '@pusher/chatkit';

export default /*@ngInject*/ function($q, $http, $rootScope) {

	const sfChatServiceInstance = this;
	sfChatServiceInstance.init = window.__sfchat;

	const tokenProvider = new TokenProvider({
		url: sfChatServiceInstance.init.baseURL + '/api/auth'
	});

	const chatkitUser = function(userID){
	const chatManager = new ChatManager({
		instanceLocator: sfChatServiceInstance.init.instance,
		userId: userID,
		tokenProvider: tokenProvider
	});
	return chatManager.connect();
	};


	sfChatServiceInstance.getRoom = function(init){
	const room = {};
	const data = {
		'user_id': init.user_id,
		'user_name': init.user_name,
		'group': init.room
	};
	return $q((resolve, reject) => {
		$http({
			method: 'POST',
			url: sfChatServiceInstance.init.baseURL + '/api/init',
			data: JSON.stringify(data)
		})
		.then(item => {
			//console.log(item.data);
			resolve(item.data);
		});
	});
	};

	sfChatServiceInstance.subscribeToRoom = function (userID, roomID){
	const roomChatHistory = [];
	const roomCurrentUsers = [];

	return $q((resolve, reject) => {
		chatkitUser(userID)
		.then(currentUser => {
			currentUser.subscribeToRoom({
			roomId: roomID,
			hooks: {
				onNewMessage: message => {
					//console.log(`Received new message: ${message.text}`);
					if (message){
						roomChatHistory.push(message);

						
						if (message.text === 'DELETED'){

							//remove delete message from history when a message si deleted
							const msgIndex = roomChatHistory.indexOf(message);
							roomChatHistory.splice(msgIndex, 1);

							//remove the old message from clientside collection
							roomChatHistory.forEach(function(val, i){
								if (val.id === message.id){
									roomChatHistory.splice(i, 1);
								}
							});
						}
						resolve(roomChatHistory);
						$rootScope.$broadcast('chat:update', message);
					} else {
						reject('oops, something went wrong....');
					}
					
					},
					onUserStartedTyping: type => {
						console.log('typing');
					},
					onUserCameOnline: user => {
						console.log(`User ${user.name} came online`);
						console.log(roomCurrentUsers);
						if (roomCurrentUsers.length > 0){
							angular.forEach(roomCurrentUsers, function (v) {
								if (v !== user) {
									roomCurrentUsers.push(user);
								}
							});
						} else {
							roomCurrentUsers.push(user);
						}
						$rootScope.$broadcast('chat:users', roomCurrentUsers);
					}
				}
			}).then(res => {
				$rootScope.$broadcast('chat:ready', res);
			});
		})
		.catch(error => {
			console.error('error:', error);
		});
	});
	};

	sfChatServiceInstance.getUsers = function(){
	return $q((resolve, reject) => {
	});
	};

	sfChatServiceInstance.sendMessage = function(userID, text, roomID, roomName){    	
	return $q((resolve, reject) => {
		chatkitUser(userID)
			.then(currentUser => {
				currentUser.sendMessage({
					text: text,
					roomId: roomID,
				});
				const message = {
					text: text,
					attachment: {},
					roomId: roomID,
					roomName: roomName,
					userName: currentUser.name
				};

				//console.log(currentUser);

				$http({
					method: 'POST',
					url: sfChatServiceInstance.init.baseURL + '/api/post-to-slack',
					data: JSON.stringify(message)
				})
				.then(item => {
					resolve(item);
					//console.log(item);
				});
			});

	});
	};

	return sfChatServiceInstance;	
}
