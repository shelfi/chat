import sfChatFormController from './sf-chat-form-ctrl.js';
import sfChatFormTemplate from './sf-chat-form.html';

export default /*@ngInject*/ function() {
	return {
		scope: {
			userdata: '=',
			room: '=',
			placeholder: '@'
		},
		link: function(scope, element, attr, ctrl){
			const uploadForm = angular.element(document.querySelector('#uploader'));
			
			element.bind('change', function(){
				scope.$apply(function(){
					scope.$ctrl.file = uploadForm[0].files[0];
					scope.$ctrl.upload();
					console.log(scope);
				});
			});

			element.bind('keydown', function(e) {
				if (!scope.$ctrl.form){return;}
				if (e.which === 13) {
					scope.$apply(function(){
						scope.$ctrl.sendMessage(scope.$ctrl.form.text);
						scope.$ctrl.form.text = '';
				});
					e.preventDefault();
				}
			});
			
		},
		controller: sfChatFormController,
		controllerAs: '$ctrl',
		bindToController: true,
		require: '^?sfChat',
		templateUrl: sfChatFormTemplate,
		restrict: 'E',
	};
}
