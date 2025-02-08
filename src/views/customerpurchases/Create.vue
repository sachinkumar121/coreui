<template>
<div>
   
    <CRow>
      <CCol sm="12">
                <!-- A booking widget will be inserted here will be inserted here. -->
                <iframe
                  id="iframe"
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
    name: 'CreateBooking',
     data () {
         //console.log("asdasd........d")
         //console.log( this.$store.state.business_settings.api_access_account_id)
          let srcurl = this.$store.state.skysched_global_api_base_url +
                      "extpages/productsales/" +
                      this.$store.state.business_settings.api_access_account_id + 
                      "/1" + // For product sales 
                      "?show_page_header=0&show_page_footer=0"

        if(this.$store.state.business_settings.api_access_account_id == '' || 
             this.$store.state.business_settings.api_access_account_id == null)
        {
            srcurl = this.$store.state.skysched_global_api_base_url +
                      "extpages/onlinebookingnotenabled" +
                      "?show_page_header=0&show_page_footer=0"
        }
      return { 
        loaded: false,
        iframe: {
            src: srcurl, //disable page header & footer for this integrated view
            style: null,
            wrapperStyle: null, 
            iframeresizer : null
        }
      }
     },
  
   mounted(){
    this.iframe.style = {
      position: 'absolute',
      width: window.innerWidth,
      height: window.innerHeight,
    }    
    this.iframe.wrapperStyle = {
      overflow: 'hidden',
    } 
    this.loaded = true;
   
     },
    methods: {
    iframeLoaded () {
    this.iframe.iframeresizeObj= iFrameResize({log: false}, '#iframe');
    this.iframeReLoaded();
    },
    iframeReLoaded () {
    
    this.iframe.iframeresizeObj[0].iFrameResizer.sendMessage('{"auth_token": "' + this.$schedsdk.getAuthorizationString() + '"}')
    }

  } 
}
</script>