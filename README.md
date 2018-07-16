# SfChat Client module


### What is this?

> Shelfi chat is a simple chat module that enables real-time communication between client side chat widget and slack. By initializing the widget you can automatically create chat rooms and subscribe users to rooms.



**Installation and usage**

> Add sfchat js file to your source

    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/shelfi/chat@v0.1.1/dist/sfchat.min.js"></script>

>Add sfchat initializer in between **<body></body>** tags. Change details except "baseURL" for your widget and instance.


        var __sfchat = {
          instance: 'v1:us1:09b469f9-8a04-45a6-8a19-fc9bdb37989a',
          baseURL: 'https://shelfi.shop',
          user_id: 'ayseokan@gmail.com',
          user_name: 'Ayse Okan',
          group: 'lunapark',
          message_limit: 10
        };



----

### About Shelfi Chat
Shelfichat is part of Shelfi E-commerce platform. For details see [Shelfi E-commerce](http://shelfi.net)

### changelog
* 25-Jun-2018 release beta version 0.1.1