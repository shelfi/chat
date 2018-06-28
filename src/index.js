/**
 * @license Shelfi Chat 0.1.4
 * (c) 2018 Shelfi E-commerce https://shelfi.net
 * License: MIT
 */

import sfChat from './sf-chat-directive';
import sfChatForm from './sf-chat-form-directive';
import sfChatMessage from './sf-chat-message-directive';
import sfChatService from './sf-chat-service';
import './sf-chat.scss';

angular.module('sfChat', [])
	.directive('sfChat', sfChat)
	.directive('sfChatMessage', sfChatMessage)
	.directive('sfChatForm', sfChatForm)
	.service('sfChatService', sfChatService);
