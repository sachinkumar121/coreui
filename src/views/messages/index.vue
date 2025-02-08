<template>
<div>
    
    <div class="container clearfix">
    <div class="chat">
      <div class="chat-header clearfix">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg" alt="avatar" />
        
        <div class="chat-about">
          <div class="chat-with">Chat with Vincent Porter</div>
          <div class="chat-num-messages">already 1 902 messages</div>
        </div>
        <i class="fa fa-star"></i>
      </div> <!-- end chat-header -->
      
      <div class="chat-history" v-chat-scroll="{always: true}">
        <ul class="chat-history-list" >
          <li class="clearfix" v-for="(index, msg) in messageList" :key="index">
            <div v-if="msg.sender_data._id == my_id" class="message-data align-right">
              <span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
              <span class="message-data-name" >{{msg.sender_data.first_name}}</span>
            </div>
            <div v-else class="message-data">
              <span class="message-data-name"> {{msg.receiver_data.first_name}}</span>
              <span class="message-data-time">10:12 AM, Today</span>
            </div>
            <div v-if="msg.sender_data._id == my_id" class="message other-message float-right">
              {{msg.message}}
            </div>
            <div v-else class="message my-message">
              {{msg.message}}
            </div>
          </li>
          <!-- <li class="clearfix">
            <div class="message-data align-right">
              <span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
              <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>
            </div>
            <div class="message other-message float-right">
              Hi Vincent, how are you? How is the project coming along?
            </div>
          </li>
          <li>
            <div class="message-data">
              <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
              <span class="message-data-time">10:12 AM, Today</span>
            </div>
            <div class="message my-message">
              Are we meeting today? Project has been already finished and I have results to show you.
            </div>
          </li>
          <li class="clearfix">
            <div class="message-data align-right">
              <span class="message-data-time" >10:14 AM, Today</span> &nbsp; &nbsp;
              <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>
              
            </div>
            <div class="message other-message float-right">
              Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?
            </div>
          </li>
          <li>
            <div class="message-data">
              <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
              <span class="message-data-time">10:20 AM, Today</span>
            </div>
            <div class="message my-message">
              Actually everything was fine. I'm very excited to show this to our team.
            </div>
          </li>
          <li>
            <div class="message-data">
              <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
              <span class="message-data-time">10:31 AM, Today</span>
            </div>
            <i class="fa fa-circle online"></i>
            <i class="fa fa-circle online" style="color: #AED2A6"></i>
            <i class="fa fa-circle online" style="color:#DAE9DA"></i>
          </li> -->
        </ul>
      </div> <!-- end chat-history -->
      
      <div class="chat-message clearfix">
        <textarea name="message-to-send" v-model="message_to_send" @keyup= "addMessageEnter" id="message-to-send" placeholder ="Type your message" rows="3"></textarea>
                
        <!-- <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
        <i class="fa fa-file-image-o"></i> -->
        
        <button @click ="addMessage" id="send-button">Send</button>

      </div> <!-- end chat-message -->
      
    </div> <!-- end chat -->
    
  </div> <!-- end container -->

<!-- <script id="message-template" type="text/x-handlebars-template">
  <li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time" >{{time}}, Today</span> &nbsp; &nbsp;
      <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>
    </div>
    <div class="message other-message float-right">
      {{messageOutput}}
    </div>
  </li>
</script>

<script id="message-response-template" type="text/x-handlebars-template">
  <li>
    <div class="message-data">
      <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
      <span class="message-data-time">{{time}}, Today</span>
    </div>
    <div class="message my-message">
      {{response}}
    </div>
  </li>
</script> -->

        
  </div>
</template>
<script>
export default {
    name: 'Messages',
    data(){
      return {
        my_id:"5be171540931ba3343adaea0",
        messageList:[],
        time:'',
        messageOutput:'',
        message_to_send:'',
        response:'',
            messageToSend: '',
            messageResponses: [
              'Why did the web developer leave the restaurant? Because of the table layout.',
              'How do you comfort a JavaScript bug? You console it.',
              'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
              'What is the most used language in programming? Profanity.',
              'What is the object-oriented way to become wealthy? Inheritance.',
              'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
            ],
        }
    },
  created(){
    this.getMessageList();
  },
  methods:{
      getMessageList(){
        this.$schedsdk.getMessageList().then(result=>{
          // console.log(result)
          if(result.status == 1){
            this.messageList = result.data;
          }
        })
      },
      init() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
      },
      cacheDOM() {
        console.log("cacheDOM ======================================================================");
        // this.$chatHistory = $('.chat-history');
        this.$chatHistory = document.getElementsByClassName("chat-history");
    
        // this.$button = $('button');
        this.$button = document.getElementById('send-button');
        // this.$textarea = $('#message-to-send');
        this.$textarea = document.getElementById('message-to-send');
        // this.$chatHistoryList =  this.$chatHistory.find('ul');
        this.$chatHistoryList =  document.getElementsByClassName("chat-history-list");
      },
      
      render() {
        console.log("render ==========================================================================");
        if (this.messageToSend.trim() !== '') {
          // var template = Handlebars.compile( document.getElementById("message-template").html());
          var context = { 
            messageOutput: this.messageToSend,
            time: this.getCurrentTime()
          };
          let dyn_html = `<li class="clearfix">
              <div class="message-data align-right">
                <span class="message-data-time" >${context.time}, Today</span> &nbsp; &nbsp;
                <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>
              </div>
              <div class="message other-message float-right">
                ${context.messageOutput}
              </div>
            </li>`
          // this.$chatHistoryList.append(dyn_html);
          this.$chatHistoryList.appendChild(dyn_html);
          // this.$textarea.val('');
          this.message_to_send = '';
          
          // responses
          // var templateResponse = Handlebars.compile( document.getElementById("message-response-template").html());
          // var contextResponse = { 
          //   response: this.getRandomItem(this.messageResponses),
          //   time: this.getCurrentTime()
          // };
          
          // setTimeout(function() {
          //   this.$chatHistoryList.append(templateResponse(contextResponse));
          //   this.scrollToBottom();
          // }.bind(this), 1500);
          
        }
        
      },
      addMessage() {
        console.log("addMessage ==================================================================");
        // this.messageToSend = this.$textarea.val()
        this.messageToSend = this.message_to_send.trim()
        if(this.messageToSend != '')
        {
          let msgData = {
          sender_id:this.my_id,
          receiver_id:"5d396978817d5602ccc71bbf",
          message:this.messageToSend,
        };
        this.$schedsdk.addMessage(msgData).then((result)=>{
          if(result.status == 1){
            this.messageList.push(result.data);
            this.message_to_send = ""
          }
            // this.render(); 
          });
        }
      },
      addMessageEnter(event) {
          // enter was pressed
          if (event.keyCode === 13) {
            this.addMessage();
          }
      },
      scrollToBottom() {
        var container = this.$el.querySelector(".chat-history");
        // this.$el.querySelector(".chat-history").scrollTop = container.scrollHeight
        this.$el.querySelector(".chat-history").scrollTo(0,document.querySelector(".chat-history").scrollHeight)
      },
      getCurrentTime() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      },
      getRandomItem(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
      }
  }
  
}
</script>
<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Lato:400,700);

$green: #86BB71;
$blue: #94C2ED;
$orange: #E38968;
$gray: #92959E;

*, *:before, *:after {
  box-sizing: border-box;
}

body {
  background: #C5DDEB;
  font: 14px/20px "Lato", Arial, sans-serif;
  padding: 40px 0;
  color: white;
}

.container {
  margin: 0 auto;
  width: auto;
  background: #444753;
  border-radius: 5px;
}

.people-list {
  width:260px;
  float: left;
  
  .search {
    padding: 20px;
  }
  
  input {
    border-radius: 3px;
    border: none;
    padding: 14px;
    color: white;
    background: #6A6C75;
    width: 90%;
    font-size: 14px;
  }
  
  .fa-search {
    position: relative;
    left: -25px;
  }
  
  ul {
    padding: 20px;
    height: 770px;
    list-style-type: none;
 li {
      padding-bottom: 20px;
    }
  }
  
  img {
    float: left;
  }
  
  .about {
    float: left;
    margin-top: 8px;
  }
  
  .about {
    padding-left: 8px;
  }
  
  .status {
    color: $gray;
  }
  
}

.chat {
  width: auto;
  // float:left;
  background: #F2F5F8;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  
  color: #434651;
  
  .chat-header {
    padding: 20px;
    border-bottom: 2px solid white;
    
    img {
      float: left;
    }
    
    .chat-about {
      float: left;
      padding-left: 10px;
      margin-top: 6px;
    }
    
    .chat-with {
      font-weight: bold;
      font-size: 16px;
    }
    
    .chat-num-messages {
      color: $gray;
    }
    
    .fa-star {
      float: right;
      color: #D8DADF;
      font-size: 20px;
      margin-top: 12px;
    }
  }
  ul {
    list-style-type: none;
  }
  .chat-history {
    padding: 30px 30px 20px;
    border-bottom: 2px solid white;
    overflow-y: scroll;
    height: 575px;
    
    .message-data {
      margin-bottom: 15px;
    }
    
    .message-data-time {
      color: lighten($gray, 8%);
      padding-left: 6px;
    }
    
    .message {      
      color: white;
      padding: 18px 20px;
      line-height: 26px;
      font-size: 16px;
      border-radius: 7px;
      margin-bottom: 30px;
      width: 90%;
      position: relative;
      
      :after {
        bottom: 100%;
        left: 7%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-bottom-color: $green;
        border-width: 10px;
        margin-left: -10px;
      }
    }
    
    .my-message {
      background: $green;
    }
    
    .other-message {
      background: $blue;
      
      after {
        border-bottom-color: $blue;
        left: 93%;
      }
    }
    
  }
  
  .chat-message {
    padding: 30px;
    
    textarea {
      width: 100%;
      border: none;
      padding: 10px 20px;
      font: 14px/22px "Lato", Arial, sans-serif;
      margin-bottom: 10px;
      border-radius: 5px;
      resize: none;
      
    }
    
    .fa-file-o, .fa-file-image-o {
      font-size: 16px;
      color: gray;
      cursor: pointer;
      
    }
    
    button {
      float: right;
      color: $blue;
      font-size: 16px;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      font-weight: bold;
      background: #F2F5F8;
      
      &:hover {
        color: darken($blue, 7%);
      }
    }
  }
}

.online, .offline, .me {
    margin-right: 3px;
    font-size: 10px;
  }
  
.online {
  color: $green;
}
  
.offline {
  color: $orange;
}

.me {
  color: $blue;
}

.align-left {
  text-align: left;
}

.align-right {
  text-align: right;
}

.float-right {
  float: right;
}

.clearfix:after {
	visibility: hidden;
	display: block;
	font-size: 0;
	content: " ";
	clear: both;
	height: 0;
}


</style>
