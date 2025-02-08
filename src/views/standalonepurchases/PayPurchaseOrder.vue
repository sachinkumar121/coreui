<template>
<div>
   
    <CRow>
      <CCol sm="12">
                <!-- A booking widget will be inserted here will be inserted here. -->
                <iframe
                  id="iframe"
                   v-if="loaded"
                  :src="iframe.src"
                  style="min-width: 100%; border: none;"
                  @load="iframeLoaded"
                 
                />
    
      </CCol>
    </CRow>
  </div>
</template>

<script>
import iFrameResize from 'iframe-resizer/js/iframeResizer'
function sendMessage(msg) {
  'use strict';
  //var msgId = '[iFrameSizerTest]:';

  //document.getElementsByTagName('iframe')[0].contentWindow.postMessage( msgId + msg, '*' );

  //console.log('Sending '+msg);
  document.getElementsByTagName('iframe')[0].iFrameResizer.sendMessage(msg);
}
export default {
    name: 'PayPurchaseOrder',
    po_access_url: '',
     data () {
      return { 
        loaded: false,
        iframe: {
            src: "" ,
            style: null,
            wrapperStyle: null, 
            iframeresizer : null
        }
      }
     },
  
   mounted(){
     
                this.po_access_url = this.$route.params.po_access_url || ""
                this.iframe.src = decodeURI(this.po_access_url)
                 "http://192.168.1.101:3001/extpages/online_booking_payment/SKYSAK5YS2627RWX/" + 
                 "60edff5d6b1c4f2380723d0f?minimal_invoice=1" 
    
                this.iframe.style = {
                position: 'absolute',
                width: window.innerWidth,
                height: window.innerHeight,
                }    
                this.iframe.wrapperStyle = {
                overflow: 'hidden',
                } 
                this.loaded = true;
               // this.iframeReLoaded();
     },
    methods: {
    iframeLoaded () {
     let mythis = this;   
    this.iframe.iframeresizeObj= iFrameResize({log: false,
     onMessage: function(message){ 
          
          
            //var messageData = JSON.parse(message);
            if (message && message.message)
            {
                let messageData = message.message
                //Note: !! Messages are not to be trusted other than for some UI work!
                //
                if ( messageData)
                {
                    //console.log(messageData);
                    if (messageData.payment_status === true)
                    {
                        //mythis.$router.go(-1)
                         mythis.$router.push({name: 'Past Orders'})
                    }
                   
                }
                else
                {
                    console.log('no message handling function');
                }
                
            }
        }
    }, '#iframe');
    this.iframeReLoaded();
  
    },
    iframeReLoaded () {
    console.log("Sending message....")
    this.iframe.iframeresizeObj[0].iFrameResizer.sendMessage('{"auth_token": "' + this.$schedsdk.getAuthorizationString() + '"}')
    }

  } 
}
</script>