<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <div class="logo text-center">
        <img class="logo-auth" src="/img/logo-icon-auth.png" />
        <span>SkySalon</span> 
        <br>
       
      </div>

      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <Alerts 
              :alertData="alertData" 
              :show="show"
              @alertClosed="alertClosedFn"
              v-if="alert" />
                <div v-if="errors.length>0" class="row">
                    <li>
                          <ul v-for="(item, index) in errors" :key="index">{{item}}</ul> 
                    </li>

                </div>
              <form class="add-plan-form" @submit.prevent="register">
                <div class="form-body">
                  <div>
                      <div class="col-md-12 text-center">
                        <h1>Sign Up Status</h1>
                                                <hr>
                      </div>
                  </div>  
                  <div>
                      <div class="col-md-12 text-left">
                          <ul>
                              <li>
                                  This form is for business owner to signup their new business.
                              </li> 
                         </ul>
                         <hr>
                      </div>
                  </div>  

                
       

                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Status:</b> <span id="typeselected">{{status_text}}</span>
                        </label>
                        </div>
                    </div>
                   </div>
   


                  
                  <div class="row">
                        <div class="col-md-12 text-center">
                          <br>
                        </div>
                  </div>

                  <div class="row">
                    <div class="col-md-12 text-center">
                      <router-link to="/login" target="_self">
                        Already have an account? Login here
                      </router-link>
                    </div>
                  </div>

                </div> <!-- done body -->
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
     
    <ExternalAppFooter/>   
    </CContainer>
    
  </div>
</template>
<script>
import Alerts from "../Alerts";
import ExternalAppFooter from '@/ui_components/ExternalAppFooter';

 
export default {
  name: "PostRegister",
  components: {
    Alerts,
    ExternalAppFooter 
  },
  props:['reg_type'],
  data() {
    return {
      date_picker_config: {
            altFormat: "F j, Y",
            altInput: true,
            // noCalendar: true,
            // enableTime: true,
            // time_24hr: true
        },
      errors : [],
      status_text: '', 

      alert: false,
      show: 0,
      alertData: {
        message: "qwertyui",
        type: "success"
      }
    };
  },
  mounted(){
        
              
      }, //end function
  
  methods: {


      back_to_login() {
        this.$router.push({ name: 'Login' });
   },
   
   
    alertClosedFn() {
      this.show = 0;
      this.errors = [];
    }
  }
};
</script>
<style scoped>
.invalid {
  border: 1px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg {
  color: red;
}
</style>
