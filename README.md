# SfChat Client module


### What is this?

Shelfi chat is a simple chat module that enables real-time communication between client side chat widget and slack. By initializing the widget you can automatically create chat rooms and subscribe users to rooms.



**Installation and usage**

Add sfchat js file to your source

    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/shelfi/chat@v0.9/dist/sfchat.min.js"></script>

Add sfchat initializer tag in a **<script>** tag (preferably after header). Change details for your instance ID and user details.

    _sfchat.init('YOUR_WIDGET_ID', 
	    {
		    user_id: 'USER_ID', 
		    user_name: 'USER_NAME', 
		    user_custom_data: {
				email: 'john@shelfi.net'
				age: '24',
				hobby: 'biking'
		    },
		    //you can enter a slack channel id or name in order to push messages to certain slack channel (optional)
		    //or enter a room_id if you would like to load a chat history from previous sessions(optional)
		    slack_channel_id: 'CD35GJQ7M',
		    slack_channel_name: 'support-channel',
		    room_id: '123456'
	    },
	    {
	    	//widget configuration comes here(optional)
	    }
    )


Note: Init data is optional. You can init a widget without any user data ie: _sfchat.init('YOUR_WIDGET_ID'). In this case the a visitor chat widget session would be an anonymous one until she sends data using the default user info form.


Also you can use the second init json object to configure your widget. Normally the configuration is initialized during init phase (you can modify these values via your admin panels widget configuation section). You can override these settings at client level using the second json object, as in example:

    _sfchat.init('YOUR_WIDGET_ID', 
	    {
		    //init here
	    },
	    {
	    	"message_limit" : 50, 							//message item count on chat screen
	    	"active" : true,								//chat is loaded automatically if active
	    	"open" : true,									//chat dialog is open at page load
	    	"uploader" : true,								//turn on/off file upload feature
	    	"locale" : "en-us",								//change locale for date-time items
	    	"active_on_mobile" : true,						//load on mobile device
	    	"server_url": 'https://v1.shelfi.shop', 		//default API url
	    	"color_primary" : "#26a69a",
	    	"color_accent" : "#00b0ff",
	    	"color_primary_contrast" : "#fff",
	    	"color_accent_contrast" : "#fff",
	    	"color_bg" : "#f0f0f0",
	    	"color_text" : "#101010",
	    	"color_text_light" : "#cacaca",
	    	"color_border" : "#e0e0e0",
	    	"loading_text" : "Loading...",
	    	"header_title" : "Hi there",
	    	"header_subhead" : "Ask us anything now",
	    	"greeting_online_text" : "Hi there, send us a message",
	    	"greeting_offline_text" : "We are not available right now, we will get back to via e-mail",
	    	"display_name" : "Support",
	    	"launcher" : "mini",
	    	"launcher_position" : "left",
	    	"launcher_text" : "Ask us anything",
	    	"hide_workspace_icon" : false,
	    	"hide_avatars" : false,
	    	"hide_credits" : false,
	    	"user_form_active" : true,
	    	"user_form_required" : false,
	    	"user_form_show_on_launch" : true,
	    	"user_form_name_placeholder" : "Name",
	    	"user_form_email_placeholder" : "Email",
	    	"user_form_message" : "Add your name and e-mail to get notified when we reply.",
	    	"user_form_approval" : "Thanks for your information, we will contact you as soon as possible",
	    	"user_form_btn_text" : "DONE",
	    	"chat_form_placeholder" : "Reply here.."
	    }
    )

----
You can use the following methods
	_sfchat.init('WIDGET_ID')
	_sfchat.open()
	_sfchat.close()
	_sfchat.toggle()
	_sfchat.destroy()


----
Additionally you can use the following events

* sfchat.ready
* sfchat.open 
* sfchat.close
* sfchat.message_read
* sfchat.message_sent 
* sfchat.user_offline
* sfchat.user_online
* sfchat.upload_complete

---

**Example:**

	document.addEventListener('sfchat.ready', function (e) {
	//do something with event
	}, false);

---

### About Shelfi Chat
Shelfichat is part of Shelfi E-commerce platform. For details see [Shelfi E-commerce](http://shelfi.net)

### changelog
* 26-Nov-2018 add fix for copy paste text issue 0.9.2
* 21-Nov-2018 Major Update including various features for version 0.9.0
* 15-Aug-2018 various improvements 0.2.2
* 12-Aug-2018 update for better init 0.1.2
* 25-Jun-2018 initial release for beta version 0.1.1