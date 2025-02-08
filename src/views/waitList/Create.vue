<template>
  <div>
    <Alerts
      :alertData="alertData"
      :show="show"
      @alertClosed="alertClosedFn"
      v-if="alert"/>
    <h3>Add to Waitlist</h3>
    <CContainer>
    <div class="form-body">
        <div class="row">
            <div class="col-md-12">
            <label>
                The WaitList is for
                <input class="mx-2" id="one" name="child" type="radio" v-model="child" value="me"/>
                <label for="one">Myself</label>
                <input class="mx-2" id="two" name="child" type="radio" v-model="child" value="child"/>
                <label for="two">Child</label>
            </label>
        </div></div>

        <CFormCheck id="flexCheckDefault" label="Book with out email/phone" v-if="!edit" v-model="fakeInfo"/>
        <div class="row" v-if="child==='child'">
            <div class="col-md-6">
            <CFormFloating class="mb-2" >
                <CFormInput id="childName" size="sm" type="text" v-model="waitListData.child_name"/>
                <CFormLabel for="childName" size="sm">Child Name</CFormLabel>
            </CFormFloating>
          </div>
        </div>
     <div class="row">
          <div class="col-sm-6">
            <CFormFloating class="mb-2">
                <CFormInput id="FirstName" size="sm" type="text" v-model="waitListData.customer_first_name"/>
                <CFormLabel for="FirstName" size="sm">First Name</CFormLabel>
            </CFormFloating>
          </div>

          <div class = "col-sm-6">
            <CFormFloating class="mb-2">
                <CFormInput id="LastName" size="sm" type="text" v-model='waitListData.customer_last_name'/>
                <CFormLabel for="LastName" size="sm">Last Name</CFormLabel>
            </CFormFloating>
          </div>
      </div>

    <div class="row">
        <div class="col-sm-6">
        <CFormFloating class="mb-2">
            <CFormInput id="phoneNumber" size="sm" type="text" v-model="waitListData.customer_phone"/>
            <CFormLabel for="phoneNumber" size="sm">Phone Number</CFormLabel>
        </CFormFloating>
        </div>

        <div class = "col-sm-6">
        <CFormFloating class="mb-2">
            <CFormInput id="email" size="sm" type="text" v-model="waitListData.customer_email"/>
            <CFormLabel for="email" size="sm">Email</CFormLabel>
        </CFormFloating>
        </div>
    </div>

     
    <div class="row">
        <div class="col-sm-4">
            <label>Preferred Services </label>
            <v-select :options="services_option"  id="SelectServices"
                        label="name" multiple v-model="services"
                         @update:modelValue="checkForAdditionalServiceProviders"
                         @option:selecting="handleSelecting">
                <template v-slot:no-options>
                Type to search ...
                </template>
                <template v-slot:option="option">
                <div class="d-center">
                    {{ option.name + " (" + option.time + " mins) "}}
                </div>
                </template>
                <template v-slot:selected-option="option">
                <div class="selected d-center">
                    {{ getSelectedServiceDisplay(option) }}
                </div>
                </template>
            </v-select>
        </div>

        <div class = "col-sm-4">
              <label>Preferred Service Providers</label>
            <v-select :options="resources"  label="first_name"
                multiple v-model="waitListData.preferred_service_providers">
                  
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{ option.first_name }} {{option.last_name}}
                                    </div>
                                </template>
                               
                 <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                    {{ option.first_name }} {{option.last_name}}
                                    </div>
                                </template>
            </v-select>
        </div>
          <div class = "col-sm-4">
               <label>Priority</label>
                 <CFormInput label="Priority" type="number" v-model="waitListData.priority"></CFormInput>
     
    
        </div>
    </div>

     
    <div class="row">
        <div class="col-sm-4">
                      <label>Preferred Start Times</label>
                <div :key="i" v-for="(preferredTime,i) in waitListData.preferred_times">
                    <v-select :options="options" :reduce="text => text.value" label="text" v-model="preferredTime.begin_hour"/>
                    
                </div>

        </div>
        <div class="col-sm-4">
                      <label>Preferred End Times</label>
                <div :key="i" v-for="(preferredTime,i) in waitListData.preferred_times">
                    <v-select :options="options" :reduce="text => text.value" label="text"
                            v-model="preferredTime.end_hour"></v-select>
                </div>

        </div>
        <div class = "col-sm-4">
          <label>Preferred Days</label>
              <v-select :options="weekDays" label="day" 
                    :reduce="day=>day.value" multiple v-model="waitListData.preferred_days_of_week"/>
            
        </div>
    </div>      
     
      </div>
    </CContainer>
    <br>
    <CButton :disabled="spinner" color="primary" v-on:click="addWaitList()">
      <CSpinner aria-hidden="true" v-if="spinner" component="span" size="sm"></CSpinner>
      Submit</CButton>


    <CModal
        :visible="showSelectTime"
        :backdrop="true"
        @close="saveSelectTimeHandler"
    >
        <CModalBody>
            <div class="row">
                    <div class="col-md-12">

                         <label class="control-label"><b>Select options for service </b></label>
                                <v-select v-model="selected_flex_time_obj" 
                                label="time" 
                                :options="select_flex_time_options" 
                                >
                                
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{option.time + " mins " + currency_symbol + "" +   option.price + " " + option.note }}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                      {{option.time + " mins " + currency_symbol + "" +   option.price + " " + option.note }}
                                    </div>
                                </template>
                                </v-select>
                    </div>
            </div>
        </CModalBody>

        <CModalFooter>
                <CButton @click="saveSelectTimeHandler" color="success"  class="text-center">Save</CButton>
        </CModalFooter>
    </CModal>

  </div>
</template>

<script>
  import moment from "moment-timezone";
  import flatPickr from "vue-flatpickr-component";
  import Alerts from '../Alerts'
  import 'flatpickr/dist/flatpickr.css';

  export default {
    name: 'CreateWaitList',
    components: {
      flatPickr, Alerts
    },
    data() {
      return {
        alert: false,
        show: 0,
        alertData: {
          message: '',
          type: ''
        },
        spinner:false,
        waitListData: {},
        resources: [],
        priority: '99',
        serviceProviders: [],
        services: [],
        child: 'me',
        fakeInfo: false,
        edit: false,
        
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        services_option: [],
        service_provider2: null,
        need_2nd_service_provider: false,    
        service_id_for_flex_dialog: -1,
        select_flex_time_options: [],
        showSelectTime : false,
        hint_flex_service_change : false,
        selected_flex_time_obj: null,

        options: [...Array(24)].map((e, i) => {
          return {value: i, text: this.convert24to12(i)};
        }),
        weekDays: [ {value: 0, day: 'Sunday'}, {value: 1, day: 'Monday'},
          {value: 2, day: 'Tuesday'}, {value: 3, day: 'Wednesday'}, {value: 4, day: 'Thursday'},
          {value: 5, day: 'Friday'}, {value: 6, day: 'Saturday'}],
        date_picker_config: {
          altFormat: "F j, Y",
          altInput: true,
        },
      }
    },
    watch: {
      fakeInfo: function (value) {
        if (value === true) {
          this.waitListData.customer_phone = '000-888-777'
          this.waitListData.customer_email = 'test22@noone.com'
        } else {
          this.waitListData.customer_phone = ''
          this.waitListData.customer_email = ''
        }
      }
    },
    mounted() {
      this.getServicesList();
      this.getProvidersList();
    },
    methods: {
      alertClosedFn() {
        this.show = 0;
      },
      async getServicesList() {
        await this.$schedsdk.list_services({page_no: 1}).then((result) => {
          if (result.status === 1) {
            this.services_option = result.data
            let services = [];
            let me =this
            this.services.map((obj)=>
            {
                me.services_option.map((service)=>
                {
                    if(service._id.toString() == obj._id.toString())
                    {
                        services.push(obj);
                    }
                })
            })
            this.services = services;
                
          }
        })
      },

      saveSelectTimeHandler()
      {
            //console.log("Saved clivked")
            //this.services[index]
            for(let i =0; i< this.services.length ; i++)
            {
                let svci =this.services[i];
                if(svci._id.toString() ==  this.service_id_for_flex_dialog)
                {   this.services[i].user_selected_flex_time = JSON.parse(JSON.stringify(this.selected_flex_time_obj))
                    this.services[i].flex_service_name = svci.name + " " + this.services[i].user_selected_flex_time.time + " mins"
                    this.hint_flex_service_change = true;
                 console.log("FOIDNDDJDDJDJD ", this.services[i])
                 
                    break;
                }
            }
            //console.log("Asdasd---a-sd-sad");
            //console.log(this.services);
            this.service_id_for_flex_dialog = ""
            this.showSelectTime = false
      },  
      getSelectedServiceDisplay(item)
            {
                console.log("OSOSOSOSO GET SVC Asdasdas--- ",item)
                if(item.flex_service_name)
                {
                    return item.flex_service_name
                }
                return item.name
            },    
     handleSelecting(e){
        if (e.enable_flexible_time && e.selectable_times.length)
        {
             
            this.service_id_for_flex_dialog = e._id.toString()
            this.select_flex_time_options = e.selectable_times
            this.showSelectTime = true;  
        }
              
       },   
       isSvcMultiProvider(svci)
        {
                if(svci.requires_multi_providers !== undefined && 
                    svci.requires_multi_providers == true && 
                    svci.multi_providers_count > 1)
                    {
                        return true;
                    }
                    return false
        },
        checkForAdditionalServiceProviders()
        {
                for(let i=0;i<this.services.length;i++)
                {
                    let svci  = this.services[i]
                    if (this.isSvcMultiProvider(svci))
                    {
                            this.need_2nd_service_provider = true;
                            return;
                    }
                }  
                this.need_2nd_service_provider = false; 
      },       
      async getProvidersList() {
        await this.$schedsdk.get_users_list({}).then((result) => {
          let resources = [];
          for (let i = 0; i < result.data.length; i++) {
            resources.push({
              "_id": result.data[i]._id,
              "first_name": result.data[i].first_name,
              "last_name" : result.data[i].last_name,
            })
          }
          this.resources = resources;
        })
      },
      convert24to12(i) {
        let suffix = i >= 12 ? "PM" : "AM";
        i = ((i + 11) % 12 + 1) + ' ' + suffix;
        return i
      },
      addWaitList() {
        this.spinner=true
        let waitList = JSON.parse(JSON.stringify(this.waitListData))
        if(waitList.priority == "" ||waitList.priority == null  )
        {
            waitList.priority  = "99"
        }
         
        waitList.priority = parseInt(waitList.priority)
        waitList.preferred_services = this.services;
        if (this.edit) 
        {
          //waitList.wait_listed_date = moment(waitList.wait_listed_date).unix()
          //waitList.wait_list_expiry_date = moment(waitList.wait_list_expiry_date).unix()
       
          this.$schedsdk.editWaitList(waitList).then((result) => {
            if (result.status === 1) {
              this.spinner=false;
              this.alertData = {
                message: result.message,
                type: 'success'
              }
              this.alert = true;
              this.show = 4;
              document.getElementById('app').scrollIntoView();
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000)
            }
          })
        } 
        else 
        {
        
        this.$schedsdk.addWaitList(waitList).then((result) => 
        {
            this.spinner=false
            if (result.status === 1) 
            {
              this.alertData = {
                message: result.message,
                type: 'success'
              }
              this.alert = true;
              this.show = 4;
              document.getElementById('app').scrollIntoView();
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000)
            }
            else
            {
                this.alertData = {
                message: result.message,
                type: 'danger'
              }
              this.alert = true;
              this.show = 8;
              document.getElementById('app').scrollIntoView();
            }
          })
        }
      },
      getDateFormatted(timestamp) {
        if (timestamp.toString().length === 13) {
          timestamp = timestamp / 1000
        }
        return moment.unix(timestamp).toDate();
      },

    },
    created() {
      if (this.$route.params.edit_id) {
        this.$schedsdk.getOneWaitList(this.$route.params.edit_id).then((r) => {
          this.waitListData = r.data.items[0]
          this.waitListData.priority = this.waitListData.priority?.toString()
          //this.waitListData.wait_list_expiry_date = this.getDateFormatted(this.waitListData.wait_list_expiry_date)
          //this.waitListData.wait_listed_date = this.getDateFormatted(this.waitListData.wait_listed_date)
          if (this.waitListData.child_name) {
            this.child = 'child'
          }
          this.services = this.waitListData.preferred_services
          this.edit = true
       
        })
      } else {
        this.waitListData.preferred_times = [{begin_hour: null, end_hour: null}]
        console.log(this.waitListData)
      }
    }
  }
</script>
