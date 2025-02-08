<template>
  <CContainer class="d-flex content-center min-vh-100">
    <CRow>
      <CCol>
        <div class="logo">
          <img class="logo-auth" src="/img/logo-icon-auth.png" />
          <span>SkySalon</span> 
          <br />
          <br />
        </div>
        
        
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <h1>Start Registration</h1>
                <p class="text-muted">Start a new account</p>
                <CFormInput placeholder="E-mail" autocomplete="username email" v-model="email">
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CFormInput>
                <CFormInput
                  placeholder="Set a Password"
                  type="password"
                  autocomplete="password"
                  v-model="password"
                  v-on:keyup.enter="login" >   
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked" />
                  </template>
                </CFormInput>
                <CRow>
                 
                  <CCol col="12" class="text-center">
                    <CButton color="primary" @click.prevent="login" class="px-4">Next</CButton>
                  </CCol>
                </CRow>
                 <CRow>
                  <CCol col="12" class="text-center">
                    &nbsp;<br>
                 </CCol>
                 
                </CRow>
                
                <CRow>
                <CCol col="12" class="text-center">
                    <Alerts 
                    :alertData="alertData" 
                    :show="show"
                    @alertClosed="alertClosedFn"
                    v-if="alert" />
                </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <!-- <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-sm-down-none"
            body-wrapper
          >
            <h2>Sign up</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <CButton
              color="primary"
              class="active mt-3"
            >
              Register Now!
            </CButton>
          </CCard>-->
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import Alerts from "../Alerts";

import login_helper from '../../helpers/login_helper';
export default {
  name: "PreRegister",
  components: {
    Alerts
  },
  
  data() {
    return {
      in_prefer_admin: this.$route.params.prefer_admin ||this.$route.query.prefer_admin || null,
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
        //console.log(this.$route.params.prefer_admin)
        //console.log(this.in_prefer_admin)
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
