# SfChat Angularjs module

----
### What is this?

> Shelfi chat is a simple chat module enables real-time communication between client side chat module and slack. You can create channels and users. Upload and share files using slacks file system.

see [Shelfi E-commerce](http://shelfi.net)

----
### Usage
1. Write markdown text in this textarea.
2. Click 'HTML Preview' button.

----


**Installation and usage**

> Install with bower

    bower install sfchat-angularjs

> Or install with npm

    npm install sfchat-angularjs





>Add **sfChat** module to your angular app:

    angular.module('app', ['sfChat'])

---

>Add sfchat initializer in between **<body></body>** tags


    var __sfchat = {
          instance: 'v1:us1:09b469f9-8a04-45a6-8a19-fc9bdb37989a',
          baseURL: 'https://shelfi.shop',
          user_id: 'johndoe@gmail.com',
          user_name: 'John Doe',
          room: 'foo',
        };



----

### changelog
* 25-Jun-2018 release beta version 0.1.4