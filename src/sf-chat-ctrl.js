//SF-CHAT CONTROLLER
export default /*@ngInject*/ function(sfChatService, $http, $scope, $timeout) {
	
	const block = false;
	let lastSenderId = '';

	const self = this;


	this.init = sfChatService.init;
	this.closeIcon = require('./assets/close.svg');
	this.loaderIcon = require('./assets/loader.svg');
	this.chatIcon = require('./assets/chat.svg');
	this.alertSound = new Audio(require('./assets/pop.mp3'));

	this.chatReady = false;
	this.checkBlock = function(senderId){
		if (senderId !== lastSenderId){
			lastSenderId = senderId;
			return true;
		}
		return false;
	};

	this.toggleWidget = function(){
		self.widgetActive = !self.widgetActive;
	};
	$timeout(function(){
		self.widgetActive = self.active;
		sfChatService.getRoom(self.init).then(function(room){
			self.room = room;
			self.roomID = room.id;
			self.roomName = room.name;
		sfChatService.subscribeToRoom(self.init.user_id, room.id).then(function(history){
			self.messages = history;
			});
		});
	}, 0);

}
