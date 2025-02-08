<template>
<div>
   
    <CRow>
      <CCol sm="12">
                <!-- A booking widget will be inserted here will be inserted here. -->
                <iframe
                  id="iframe"
                  :src="iframe.src"
                  style="min-width: 100%; height:1080px;border: none;"
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
    name: 'MessengerIntegration',
     data () {
      return ({ 
        loaded: false,
        iframe: {
            src: "",
            style: null,
            wrapperStyle: null, 
            iframeresizer : null
        }
      })
      
     },
        computed: {
  
    },
   mounted(){
       this.$schedsdk.get_short_ak_for_token(null).then(async (result)=>{
              
            this.seq_http_errs = 0;
            // console.log("get_short_ak_for_token status....");
            // console.log(result);
            let customer_id =this.$route.params.customer_id;
            if (result.status == 1)
            {
                this.iframe.src = this.$store.state.skysched_global_api_base_url + 
                                "v1/ext/single_sign_on_unauth/show_customer_messenger_widget/"+ 
                                result.data + "?customer_id=" + customer_id;
                this.iframe.style = {
                position: 'absolute',
                width: window.innerWidth,
                height: window.innerHeight,
                }    
                this.iframe.wrapperStyle = {
                overflow: 'hidden',
                } 
                this.loaded = true;
                
            }
            
       })
   
     },
    methods: {
    iframeLoaded () {
      this.iframe.iframeresizeObj= iFrameResize({log: false, checkOrigin:false}, '#iframe');
//    this.iframe.iframeresizeObj[0].iFrameResizer.sendMessage('{"auth_token": "' + this.$schedsdk.getAuthorizationString() + '"}')
    }
  } 
}
</script>