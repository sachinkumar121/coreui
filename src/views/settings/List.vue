<template>
  <div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
          <br>
          <div class="col-md-4">
            <div class="form-group" >
                    <label class="control-label"><b>Search</b></label>
                    <input 
                    v-model="search"
                    class="form-control placeholder-no-fix" 
                    @keyup="getSettingsList()"
                    type="text" 
                    />
                </div>
            </div>

        <br>
            
            <div class="col-md-12" v-if="booking_url=='not enabled'">
                 <div class="form-group" >
                    <label class="control-label"><b>Online Booking URL: </b> &nbsp; Not yet enabled. Enable below by clicking 'edit' on "Online Web Booking Settings"</label>
                </div>
                 <div class="form-group" >
                    <label class="control-label"><b>Products/Package sales URL: </b> &nbsp; Not yet enabled. Needs online booking to be enabled.</label>
                </div>
            </div>
              <div class="col-md-12" v-else>
                <div class="form-group" >
                    <label class="control-label"><b>Online Booking URL: </b> &nbsp; 
                    <a :href=booking_url target="_blank" class="link-urls">{{this.booking_url}}</a> </label> &nbsp; 
                    <label v-if="booking_url_info!=''">(<a :href=booking_url_info target="_blank">use instructions</a>)</label> 
                </div>
                 <div class="form-group" >
                    <label class="control-label"><b>Products/Package sales URL: </b> &nbsp; 
                    <a :href=product_url target="_blank" class="link-urls">{{this.product_url}}</a> </label> &nbsp; 
                    <label v-if="booking_url_info!=''">(<a :href=booking_url_info target="_blank">use instructions</a>)</label> 
                </div>
            </div>
            
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th> 
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody v-if="list.length">
              <tr v-for="item in listofsettings"   :key="item.name">
                  <td>{{item.name}} </td>
                  <td>{{item.description}} </td>
                  <td>{{item.category}} </td>
                  <td v-if="item.type == 0"> 
                    <a href="javascript:void(0)" @click.prevent="$router.push(tag_to_route[item.tag])" class="btn btn-primary btn-sm">Edit</a>
                  </td>
                  <td v-else-if="item.type == 1"> 
                     <CFormSwitch v-model="allow_online_booking"
                         :value="allow_online_booking"
                        @change="changeAction($event.target.value)"/>
                    </td>
                  <td v-else-if="item.type == 2"> 
                    Icon 
                  </td>
              </tr>
          
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">
                <div class="py-5">
                    <img src="/img/no-result.svg" alt="" class="img-empty"> 
                    <p class="h5 mt-4 d-block fw-normal">
                        No Item found
                    </p>
                </div>
              </td>
            </tr>
          </tbody>
      </table>
    </CCol>
    </CRow>
    </div>
</template>

<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts'
import settings_json from "../../../settings";
import tag_to_route from "../../../tag_to_route";
import login_helper from '../../helpers/login_helper';
export default {
  name: 'List',
   components: { Alerts },
   setup: () => ({ v$: useVuelidate() }),
  data (){
      return({
          search:'',
          list:settings_json,
          tag_to_route:tag_to_route,
          allow_online_booking:true,
          alert:false,
          show:0,
          booking_url: 'not setup',
          product_url: 'not setup',
          booking_url_info: '',
          alertData:{
              message:'',
              type:''
          },
      })
  },
    computed: 
    {
        //Get only those that actually have been implemented
        listofsettings () 
            {
                const hfn = this.hasPage;
                return this.list.filter(function (el) {
                        return (hfn(el.tag));
                    });
            }
  },
  created(){
    
    login_helper.get_and_save_business_settings(this.$schedsdk ,this.$store).then((tax_data)=>{
        //Got new business settings
        this.checkwebsitebookings(tax_data)
    }).catch((ex)=>{
        login_helper.checkSessionExpiryAndRedirectToLogin(ex,  this.$schedsdk, this.$router)
    });
  },
  methods:{
    hasPage(tag) {
      return Object.keys(this.tag_to_route).includes(tag);
    },
    changeAction(value){
      this.alert = false;
      let toSaveValue = 1
      let message = "enable"
      if(value == "true"){
        toSaveValue = 0
        message = "disable"
      }
      // console.log("Change event to ",toSaveValue)
      this.$schedsdk.update_online_booking_settings({allow_website_bookings:toSaveValue}).then((result)=>{
        if(result.status == 1){
          this.alertData = {
              message:result.message,
              type:'success'
          }
          login_helper.get_and_save_business_settings(this.$schedsdk ,this.$store).then((tax_data)=>{
                //Got new business settings
                this.checkwebsitebookings(tax_data);
            });
        }
        else{
          this.alertData = {
              message:result.message,
              type:'danger'
          }
        }
        this.alert = true;
        this.show=4;
      }).catch(ex=>{
        this.alertData = {
            message:ex.data.message,
            type:'danger'
        }
        this.alert = true;
        this.show=4;
      });
    },
    checkwebsitebookings(data){
      // this.allow_online_booking = true
       // console.log(data);
        if(data && data.status == 1)
        {
          let buss =  data.business_setting;
          this.allow_online_booking = buss.allow_website_bookings
          if (this.allow_online_booking )
          {
            this.booking_url = buss.booking_url; //buss.api_access_account_id;
            this.booking_url_info = buss.booking_url_info || "";
            this.product_url = buss.products_url;
          }
          else
          {
            this.booking_url = "not enabled";
            this.booking_url_info ="";
          }
           
        }
    },
    getSettingsList(){
        // console.log("search")
        // console.log(this.search)
        this.search = this.search.trim();
        let set = settings_json;
        var search = this.search;
        var condition = new RegExp('.*' + search + '.*', 'i');
        var result = set.filter(function (el) {
            return (condition.test(el.name) || condition.test(el.description));
        });
        this.list = result;
    },
      alertClosedFn() {
        this.show = 0;
        }
  }
    
}
</script>
<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 23px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>

