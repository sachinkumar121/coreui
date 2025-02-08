<template>
  <div>
       {{this.ping_back_result}}
  </div>
</template>
<script>
import login_helper from '../../helpers/login_helper';
export default {
  name: "SSOPingBack",
  data() {
    return { 
        ping_back_result     : 'Fetching authorization token...',
        };
  },
  created(){
      let access_key  = this.$route.query.access_key;
      this.loadData(access_key);
      //
  },

  methods: {
     loadData: function (access_key) {

         this.$schedsdk.get_sso_token_for_ak(access_key).then(async (result)=>{
              
                this.seq_http_errs = 0;
                console.log("get_sso_token_for_ak status....");
                console.log(result);
                this.job_name = result.data.sync_job_name
                
                if(result.status == 1)
                {
                    //We have a token, apply it to sched sdk
                    let res = await this.$schedsdk.apply_identity_token(result, 
                                                                        {client_id : "auto_login_dummy",
                                                                         client_secret: "dummy" });
                    if (res != 1)
                    {
                        this.ping_back_result = "Error token obtained was in error"
                        this.$router.replace("/login?sso_message=1");
                        return;
                    }
                    await login_helper.complete_new_login(this.$schedsdk, 
                                                          this.$schedsdk.getLoggedInUserData(),
                                                          this.$store);
                    //Check if we have state data
                    //Manage redirection based on sso_state_data
                    let redirect_route = 'Dashboard';
                    let params = null;
                    if (result.sso_state_data !== undefined && 
                        result.sso_state_data != null)
                    {
                        let sso_state_data = result.sso_state_data.toLowerCase();
                        
                        switch(sso_state_data)
                        {
                            case 'settings':
                                    redirect_route = 'Settings';
                                    
                                    break;
                            case 'simple_customer_messages':
                                    redirect_route = 'CustomersMessagesPlain';
                                    params = {customer_id: sso_state_data.param1};
                                    break;
                            default:
                                    redirect_route = 'Dashboard';
                                    break;
                        }
                    }
                    //Redirect to selected route.
                    this.ping_back_result = "Success. Redirecting to " + redirect_route;
                    let vue_redir = { name: redirect_route };

                    if (params !== null)
                    {
                        vue_redir.params = params;
                    }
                    console.log("adasd- --  ------ ------ ");
                    console.log(JSON.stringify(vue_redir))
                    
                    this.$router.replace(vue_redir);
                }
                else
                {
                    this.ping_back_result = "Error getting token for request"
                }
          }).catch((err) => {
               this.ping_back_result = "Error getting token for request (not found)"
               this.$router.replace("/login?sso_message=1");
          });
      
    },
    clearTimes()
    {
          
    },
     okDone(){
            this.clearTimes();
           this.$router.push({ name: 'Dashboard' }) 
         },
  },//End methods
  mounted () {
    document.addEventListener("backbutton", this.clearTimes, false);
  },
  beforeUnmount () {
    document.removeEventListener("backbutton", this.clearTimes);
  }
};
</script>