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
import login_helper from '../../helpers/login_helper';
export default {
    name: 'StartWizard',
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
       let wizard_name = "new_business";
       let thisRef = this;
       login_helper.get_and_save_business_settings(this.$schedsdk ,this.$store).then((tax_data)=>{
            
            //this.$router.push({ name: 'Dashboard' }) 
            //console.log("Asdasd")
            //console.log(thisRef.$store.state.business_settings.business_setup_wizard_date_completed)
            //console.log(thisRef.$store.state.business_settings.business_setup_wizard_skipped)
            if(thisRef.$store.state.business_settings.business_setup_wizard_date_completed == true ||
                thisRef.$store.state.business_settings.business_setup_wizard_skipped == true)
            {
                this.$router.push({ name: 'Dashboard' }) 
                return;
            }
            this.$schedsdk.get_short_ak_for_token(null).then(async (result)=>{
              
                this.seq_http_errs = 0;
                // console.log("get_short_ak_for_token  show_start_wizard status....");
                // console.log(result);
                if (result.status == 1)
                {
                    this.iframe.src = this.$store.state.skysched_global_api_base_url + 
                                    "v1/ext/single_sign_on_unauth/show_start_wizard/"+ 
                                    result.data + "?wizard_name=" + wizard_name + "&show_header=1";
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
       }).catch(exp=>{
            //console.log("get_and_save_business_settings: except")
            //console.log(exp)
            login_helper.checkSessionExpiryAndRedirectToLogin(exp,  thisRef.$schedsdk, thisRef.$router)
        });

   
     },
    methods: {
    iframeLoaded () {
      this.iframe.iframeresizeObj= iFrameResize({log: false, checkOrigin:false}, '#iframe');
//    this.iframe.iframeresizeObj[0].iFrameResizer.sendMessage('{"auth_token": "' + this.$schedsdk.getAuthorizationString() + '"}')
    }
  } 
}
</script>