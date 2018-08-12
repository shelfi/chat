//https://github.com/hyperapp/hyperapp
//https://glebbahmutov.com/blog/pure-programming-with-hyper-app/

import { h, app } from "hyperapp"
import { ChatManager, TokenProvider } from '@pusher/chatkit';


if (typeof Promise === 'undefined') {
  require('es6-promise').polyfill();
}

if (typeof Object.assign === 'undefined') {
  require('es6-object-assign').polyfill();
}

import axios from 'axios';
import './app.scss';
import loaderIcon from './assets/loader.svg';
import sendIcon from './assets/send.svg';
import attachmentIcon from './assets/attachment.svg';
import chatIcon from './assets/chat.svg';
import closeIcon from './assets/close.svg';
import popSound from './assets/pop.mp3';

const pop = new Audio(popSound);
let defaultWidgetConfig = {
  message_limit: 5
}

//SFCHAT CREATE + INIT
const sfchatApp = function() {
  
  this.chatManager = {};

  this.init = function(instanceID, initData, widgetConfig){
    if (!widgetConfig) widgetConfig = defaultWidgetConfig;
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {

            const tokenProvider = new TokenProvider({
              url: 'https://shelfi.shop/api/auth'
            })

            _sfchat.chatManager = new ChatManager({
              instanceLocator: instanceID,
              userId: initData.user_id,
              tokenProvider
            })
            _sfchat.auth(initData, widgetConfig);
        }
    }
  }

  this.getRoom = (initData) => {
    return axios.post('https://shelfi.shop/api/init', {
     user_id: initData.user_id,
     user_name: initData.user_name,
     group: initData.group 
    }).then( res => {
      return res.data;
    });
    
  }

  this.auth = function(initData, widgetConfig){
    //first get room then connect
    _sfchat.getRoom(initData).then(response => {
      _sfchat.chatManager.connect().then(user => {
        setUser(user)
        user
          .subscribeToRoom({
            roomId: response.id,
            hooks: { onNewMessage: addMessage, onUserCameOnline: collectUsers },
            messageLimit: widgetConfig.message_limit
          })
          .then((res) => {
            setTimeout(() => {
              setRoom(res);
            }, 0)
            
            //console.log(res);
          })
      })
    })
  }
  
}
global._sfchat = new sfchatApp;

// ---------------------------------------------
// Application Code
// ---------------------------------------------

/* @jsx h */

const state = {
  user: {
    avatarURL:
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  },
  room: {
    currentUsers: [],
    loading: true
  },
  messages: [],
  attachment : {},
  messageText: {
    value: ''
  },
  file: {},
  uploadInProgress: {
    status: false
  },
  widgetStatus: {
    active: true
  }
}

const actions = {
  //return user state
  setUser: function(user){
    return {user};
  },
  //return room state
  setRoom: room => ({ messages, user }) => {
    room.currentUsers = []
    room.loading = false
    return {room};
  },
  //set the latest state for message form input
  setMessage: text => ({ messageText }) => {
    messageText.value = text;
    if (!text) {
      return ' ';
    }
    return messageText.value;
  },
  //set upload progress state
  setUploadStatus: update => ({ uploadInProgress }) => {
    uploadInProgress.status = update;
    return uploadInProgress.status;
  },
  //get attachment thumbnail and other meta info from microlink
  getMicroData: ( message, element ) => {
    if (!message.attachment) return
    axios.get('https://api.microlink.io?url=' + message.attachment.link)
            .then(function(res){
              message.attachment_metadata = res.data.data
              updateMessage(message);
        }).catch(err => {
          console.log(err);
        });
    
  },
  //add message item to messages collection (state)
  addMessage: (message) => ({messages, user}) => {
    messages.push(message);

    if (message.text === 'DELETED'){

      //remove delete message from history when a message is deleted
      const msgIndex = messages.indexOf(message);
      messages.splice(msgIndex, 1);

      //remove the old message from clientside collection
      messages.forEach(function(val, i){
        if (val.id === message.id){
          messages.splice(i, 1);
        }
      });
      return messages;
    }
    
    //unfurl url
    const url_regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    if ( message.text.match(url_regex) ){

      //console.log(message.text.match(url_regex)[0]);
      axios.get('https://api.microlink.io?url=' + message.text.match(url_regex)[0])
              .then(function(res){
                message.unfurl = res.data.data
                //console.log(res.data.data)
                updateMessage(message);
        }).catch(err => {
            console.log(err);
        });
    }

    getMicroData(message)

    //check if message is block
    setTimeout(() => {
      checkBlock(message)
      //return messages
    }, 500)

    //play sound when message sender is not current user and a new message added
    if (message.senderId !== user.id && messages.length > defaultWidgetConfig.message_limit){
      pop.play();
    }

    return messages
    //return { messages: [message, ...messages] }
  },
  updateMessage: (message) => ({ messages }) => {
    const index = messages.indexOf(message);
    messages.splice(index, 1, message);
    return messages;
  },
  submitMessage: (e) => ({ user, room }) => {
    const value = e.target.value ? e.target.value : e.target.elements[0].value
    if (!value){ return }
    user
      .sendMessage({
        text: value,
        roomId: room.id
      });

      axios.post('https://shelfi.shop/api/post-to-slack', {
        text: value,
        attachment: {},
        roomId: room.id,
        roomName: room.name,
        userName: user.name
      })
        .then(res => {
          //console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
  },
  collectUsers: user => ({ room }) => {
    
    if (room.currentUsers.length > 0){
      room.currentUsers.map((v) => {
        if (v !== user) {
          room.currentUsers.push(user);
        }
      });
    } else {
      room.currentUsers.push(user);
    }
    return room.currentUsers;
  },
  checkBlock: ( message ) => ( { user, messages } ) => {
    

    //messages = messages.reverse()
    const index = messages.indexOf(message);
    let prevMessage = messages[index - 1]; 
    if ( index === 0 ) {
      prevMessage = messages[index + 1]; 
      if (message.senderId !== prevMessage.senderId){
        message.block = true
      }
    } else if (message.senderId !== prevMessage.senderId){
      message.block = true
    }
    
    return messages
  },
  uploadClipboard: (e) => ( { file } ) => {
    //console.log(e);
    console.log(e.clipboardData)
    console.log(e.clipboardData.items)
    if (event.clipboardData.files.length){
      file = event.clipboardData.files;
      //console.log(file);
      upload(file);
      return { file };
    }
  },
  upload: (files) => ({ user, room }) => {
    
    setUploadStatus(true);

    let fileList = [];
    let fd = new FormData()

    for( var i = 0; i < files.length; i++ ){
      fileList.push(files[i])
    }

    fileList.forEach( item => {
      fd.append('item', item);
      fd.append('data', 'string');
      fd.append('userId', user.id);
      fd.append('roomName', room.name);
    })

    axios.post('https://shelfi.shop/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data'}})
      .then(function(){
        fileList = null;
        setUploadStatus(false);
        console.log('upload successful');
      })
      .catch(function(err){
        console.log(err);
        console.log('upload failed!!!');
      });
  },
  toggleWidget: (e) => ({ widgetStatus }) => {
    widgetStatus.active = !widgetStatus.active
    return widgetStatus;
  },
}


//init hyperapp
//wire actions to a variable in order to recall them without actions prefix ("actions.addMessage", "actions.setUser" etc)
//https://github.com/hyperapp/hyperapp#interoperability
const { addMessage, updateMessage, setUser, setRoom, setMessage, submitMessage, collectUsers, setUploadStatus, getMicroData, checkBlock, uploadClipboard, upload, toggleWidget} = app(
  state,
  actions,
  view,
  document.body
)




// ---------------------------------------------
// View Code
// ---------------------------------------------


const ChatHeader = ({ user, room, message, status }) => (
  <sf-chat-header>
    <p>{room.name}{room.currentUsers.length > 0 && <small> ({room.currentUsers.length} online)</small>}</p>
    { status.active && <img class="sf-chat-header__close" src={closeIcon} alt="Close" onclick={e => { e.preventDefault(); toggleWidget(e) } } /> }
  </sf-chat-header>
)

const MessageList = ({ user, messages, room }) => (
  <div class="sf-chat__body" 
  onupdate={e => { e.scrollTop = e.scrollHeight; }} 
  oncreate={e => { e.scrollTop = e.scrollHeight; }} 
  ondragover={e => { e.preventDefault(); e.stopPropagation(); }} 
  ondrop={e => { e.preventDefault(); console.log(e); upload(e.dataTransfer.files); }}>
    {room.loading && 
    <div class="sf-chat__loading">
      <small class="sf-chat__loading-text">loading...</small>
      <img class="sf-chat__loading-img" src={loaderIcon} />
    </div>
    }
    {messages.map(message => (
      <sf-chat-message key={message.id} class={message.sender.id === user.id && "active-user"} onupdate={ element =>  message.block && element.setAttribute('block', '')} oncreate={ element =>  message.block && element.setAttribute('block', '')}>
        {message.sender.avatarURL && 
        <div class="sf-chat__user-avatar">
          <img src={message.sender.avatarURL || user.avatarURL} />
        </div>
        }
        <div class="sf-chat__message-wrap">
          { message.block && 
          <div class="sf-chat__username">
              <small>{message.sender.name}</small>
          </div>
          }
          {(message.attachment && message.attachment_metadata ) &&
          <div class="sf-chat__attachment">
            <a href={ message.attachment_metadata.url } target="_blank"><img class="sf-chat__attachment-preview" src={ message.attachment_metadata.image.url } /></a>
          </div>
          }
          <div class="sf-chat__message-text">
              <p>{message.text}</p>
              {message.unfurl &&
              <div class="sf-chat__message-unfurl">
                <span class="sf-chat__message-unfurl-title">{message.unfurl.title}</span>
                <a href={message.unfurl.url} target="_blank"><img class="sf-chat__message-unfurl-img" src={message.unfurl.image.url} /></a>
                <a class="sf-chat__message-unfurl-url" target="_blank" href={message.unfurl.url}>{message.unfurl.url}</a>
              </div>
              }
          </div>
        </div>
      </sf-chat-message>
    ))}
  </div>
)

const MessageInput = ({ user, room, message }) => (
  <div class="sf-chat__form-input">
  <form
    onpaste={e => {
      e.preventDefault() 
      uploadClipboard(e)
    }}
    oninput={e => { 
      e.preventDefault()
      setMessage(e.target.value)
    }} 
    onsubmit={e => {
      e.preventDefault()
      submitMessage(e)
      e.target.elements[0].value = ''
    }}
    onkeydown={e => {
      if (e.key === 'Enter' && e.shiftKey === false) {
        e.preventDefault()
        submitMessage(e)
        e.target.value = ''
      }
    }}
  >
    
    <textarea placeholder="Reply here.." />
      {message.value.length > 0 && 
        <button>
        <img class="sf-chat__form-send-icon" src={sendIcon} />
        </button>
      }
  </form>
  </div>
)


const FileUpload = ({ file, user, room, message, uploadInProgress }) => (
  <div class="sf-chat__form-uploader">
  {uploadInProgress.status && <img class="sf-chat__form-loader-icon" src={loaderIcon} />}
  {!uploadInProgress.status &&
    <form
      onchange={e => {
      e.preventDefault()
      file = document.getElementById('uploader').files;
      upload(file);
    }}
    >
    {!message.value.length > 0 &&
    <label for="uploader">
      {!uploadInProgress.status && <img class="sf-chat__form-attachment-icon" src={attachmentIcon} />}
    </label>
    }
    <input type="text" id="roomname" name="roomName" value="{room.name}" />
    <input type="text"  id="username" name="userName" value="{user.id}" />
    <input id="uploader" name="uploader" type="file" multiple="multiple" class="hide" />

    </form>
    }
  </div>
)

const ChatLauncher = ({ status }) => (
  <div class={"sf-chat-launcher bottom left" + (status.active ? ' active' : ' hidden')} onclick={e => {
    e.preventDefault() 
    toggleWidget(e)
  }}
  >
    { status.active && <img class="sf-chat-launcher__close" src={closeIcon} alt="Close" /> }
    { !status.active && <img class="sf-chat-launcher__chat"  src={chatIcon} alt="Launch" /> }
  </div>
)

function view(state, actions) {
  return <div class="sf-chat__wrapper">
        {state.widgetStatus.active && 
        <sf-chat class="bottom left">
        <div class="sf-chat__header">
          <ChatHeader user={state.user} room={state.room} message={state.messageText} status={state.widgetStatus}/>
        </div>
        <div class="sf-chat__container">
          <MessageList user={state.user} messages={state.messages} room={state.room} attachment={state.attachment} />
        </div>
        <div class="sf-chat__footer">
          <MessageInput user={state.user} room={state.room} message={state.messageText} />
          <FileUpload file={state.file} user={state.user} room={state.room} message={state.messageText} uploadInProgress={state.uploadInProgress} />
        </div>
        <div class="sf-chat__credits">
          <small>Powered by <a target="_blank" href="http://shelfi.net">ShelfiChat</a></small>
        </div>
      </sf-chat>
        }
      <ChatLauncher status={state.widgetStatus}></ChatLauncher>
      </div>
}