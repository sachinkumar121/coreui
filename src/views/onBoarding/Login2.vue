<template>
<div class="d-flex content-center min-vh-100 container onBoarding-container">
   <div class="row">
      <div class="col">
         <div class="logo">
            <img class="logo-auth" src="/img/logo-icon-auth.png" />
            <span>SkySalon</span> 
            <br><br>
         </div>
         <div class="card-group">
            <div class="card p-4">
               <div class="card-body">
                  <form class="">
                     <h1>Login</h1>
                     <p class="text-muted">Sign In to your account</p>
                     <div role="group" class="form-group">
                        <div class="input-group">
                           <div class="input-group-prepend">
                              <span class="input-group-text">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" class="c-icon">
                                    <path d="M19.294 16.109l-3.414-2.219 1.287-2.359c0.288-0.519 0.457-1.137 0.458-1.796v-3.735c0-2.9-2.351-5.25-5.25-5.25s-5.25 2.351-5.25 5.25v0 3.735c0.001 0.658 0.17 1.277 0.468 1.815l-0.010-0.019 1.287 2.359-3.414 2.219c-1.033 0.676-1.706 1.828-1.706 3.137 0 0.002 0 0.005 0 0.007v-0 3.997h17.25v-3.997c0-0.002 0-0.005 0-0.007 0-1.309-0.673-2.461-1.692-3.128l-0.014-0.009zM19.5 21.75h-14.25v-2.497c0-0.001 0-0.003 0-0.004 0-0.785 0.404-1.477 1.015-1.877l0.009-0.005 4.578-2.976-1.952-3.578c-0.173-0.311-0.274-0.682-0.275-1.077v-3.735c0-2.071 1.679-3.75 3.75-3.75s3.75 1.679 3.75 3.75v0 3.735c-0 0.395-0.102 0.766-0.281 1.089l0.006-0.012-1.952 3.579 4.578 2.976c0.62 0.406 1.024 1.097 1.024 1.882 0 0.001 0 0.003 0 0.004v-0z"></path>
                                 </svg>
                              </span>
                           </div>
                           <input v-model="email" type="text" placeholder="E-mail" autocomplete="username email" class="form-control"><!----><!----><!----><!---->
                        </div>
                     </div>
                     <div role="group" class="form-group">
                        <div class="input-group">
                           <div class="input-group-prepend">
                              <span class="input-group-text">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" class="c-icon">
                                    <path d="M18 9.375v-2.625c0-3.314-2.686-6-6-6s-6 2.686-6 6v0 2.625h-1.875v6c0 4.342 3.533 7.875 7.875 7.875s7.875-3.533 7.875-7.875v-6zM7.5 6.75c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5v0 2.625h-9zM18.375 15.375c0 3.515-2.86 6.375-6.375 6.375s-6.375-2.86-6.375-6.375v-4.5h12.75z"></path>
                                 </svg>
                              </span>
                           </div>
                           <input v-model="password" v-on:keyup.enter="login"
                                type="password" placeholder="Password" autocomplete="password" class="form-control"><!----><!----><!----><!---->
                        </div>
                     </div>
                     <div class="row">
                        <div class="text-center col-12"><button  @click="login" type="button" class="btn px-4 btn-primary">Login</button></div>
                     </div>
                     <div class="row">
                        <div class="text-center col-12"> <br></div>
                     </div>
                     <div class="row">
                        <div class="text-center col-12">
                           <router-link to="/forgot_password" target="_self">
                              Forgot Password?
                           </router-link>
                        </div>
                     </div>
                     <div class="row">
                        <div class="text-center col-12">
                           <router-link to="/register" target="_self">
                              New User? Register here
                           </router-link>
                        </div>
                     </div>
                     <div class="row">
                        <div class="text-center col-12">
                           <Alerts 
                           :alertData="alertData" 
                           :show="showalerttime"
                           @alertClosed="alertClosedFn"
                           v-if="alert" />
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

</template>

<script>
import Alerts from "../Alerts";

import login_helper from '../../helpers/login_helper';
export default {
  name: "Login",
  components: {
    Alerts
  },
  
  data() {
    return {
      in_prefer_admin: this.$route.params.prefer_admin || null,
      email: "",
      password: "",
      alert: false,
      show: 0,
      alertData: {
        message: "",
        type: ""
      }
      // email: '',
      // password: ''
    };
  },
  created(){
      let sso_message  = this.$route.query.sso_message;
      if (sso_message !== undefined)
      {
        if (sso_message == '1')
        {
            
            this.alertData = {
                    message: "Automatic sign in failed. Please login with credentials",
                    type: "danger"
                };
          this.show = 8;
          this.alert = true;

        }
      }
      
      //
  },

  methods: {
    register(){
        this.$router.push({ name: 'Register' });
        
    },
    forgot_password(){
        this.$router.push({ name: 'ForgotPassword' });
    },  
     
    login() 
    {
        let prefer_admin = false;
        if (this.in_prefer_admin  == "1")
        {
            prefer_admin = true;
        }
        this.$schedsdk.login({ email: this.email, password: this.password,source_login:'web' , prefer_admin: prefer_admin})
            .then(async (result)=>
        {   
            if(result)
            {
                
                    await login_helper.complete_new_login(this.$schedsdk, 
                                                          this.$schedsdk.getLoggedInUserData(),
                                                          this.$store);
                    this.$router.push({ name: 'Dashboard' }) ;
            } 
            else
            {
                this.alertData = {
                    message: "Login failed. Please check and try again",
                    type: "danger"
                };
                this.alert = true;
                this.show = 8;
            }
        })
        .catch(ex => {
           console.log("ex")
           console.log(ex)
          this.alertData = {
            message: ex.response.data.message,
            type: "danger"
          };
          this.alert = true;
                this.show = 8;
        });
      
    },
    alertClosedFn() {
      this.show = 0;
    }
  }
};
</script>
