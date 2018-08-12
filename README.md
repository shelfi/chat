# SfChat Client module


### What is this?

> Shelfi chat is a simple chat module that enables real-time communication between client side chat widget and slack. By initializing the widget you can automatically create chat rooms and subscribe users to rooms.



**Installation and usage**

> Add sfchat js file to your source

    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/shelfi/chat@v0.1.1/dist/sfchat.min.js"></script>

>Add sfchat initializer in between **<body></body>** tags. Change details for your instance ID and user+group details.
	<script>
	_sfchat.init('v1:us1:09b469f9-8a04-45a6-8a19-fc9bdb37989a', 
		{
			user_id: 'hugobarker@gmail.com', 
			user_name: 'Hugo Barker', 
			group: 'lunapark'
		}
	)
	</script>



----

### About Shelfi Chat
Shelfichat is part of Shelfi E-commerce platform. For details see [Shelfi E-commerce](http://shelfi.net)

### changelog
* 12-Aug-2018 update for better init 0.1.2
* 25-Jun-2018 release beta version 0.1.1