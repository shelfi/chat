//SF-CHAT-FORM CONTROLLER
export default /*@ngInject*/ function(sfChatService, $http, $scope, $timeout) {

	const self = this;

	this.file = null;
	this.uploadInProgress = false;
	this.attachmentIcon = require('./assets/attachment.svg');
	this.loaderIcon = require('./assets/loader.svg');
	this.sendIcon = require('./assets/send.svg');
	//console.log(self);

	this.sendMessage = function(text){
		if (!text){return;}
		sfChatService.sendMessage(self.userdata.user_id, text, self.room.id, self.userdata.room).then(function(data){
			console.log(data);
			self.form.text = '';
		});	
	};

	this.upload = function(){
		self.uploadInProgress = true;
		const fd = new FormData();
		fd.append('file', self.file);
		fd.append('filetype', 'file');
		fd.append('data', 'string');
		fd.append('userId', self.userdata.user_id);
		fd.append('roomName', self.userdata.room);
		$http.post(sfChatService.init.baseURL + '/api/upload', fd, { transformRequest: angular.identity, headers: { 'Content-Type': undefined }, responseType: 'arraybuffer' } )
		.then(res => {
			self.file = null;
			$timeout(function(){
				self.uploadInProgress = false;
			}, 10000);
		})
		.catch(err => {
			console.log(err);
		});
	};


	this.getClipboard = function(item, event){
		if (event.clipboardData.files.length){
			self.file = event.clipboardData.files[0];
			self.upload();
		}
	};


}
