<template>
  <CCard>
    <CCardBody class="rounded">

        
  <CFormSwitch :checked="this.waitListSettings.wait_list_enable" inline label="Enable Waitlisting feature"
               v-model="this.waitListSettings.wait_list_enable"/>
  
  <CFormSwitch :checked="this.waitListSettings.wait_list_allow_customer_to_add" inline label="Allow customers to join Wait List during online booking"
               v-model="this.waitListSettings.wait_list_allow_customer_to_add"/>
  <CFormSwitch :checked="this.waitListSettings.wait_list_auto_manage" inline label="Allow system to Auto Manage Wait List."
               v-model="this.waitListSettings.wait_list_auto_manage"/>
  <CRow>
    <CCol lg="6" class="radius-input">
      <CInputGroup class="mb-2" >
        <label class="me-2" for="Input1">Auto Manage Method:</label>
        <select 
            class="form-control radius-6" 
            v-model="this.waitListSettings.wait_list_auto_manage_type">
            <option v-for="opt in [{_id: 1, name: 'Auto convert waitlist to booking' },{_id: 2, name: 'Notify customer of open slots and allow to book.'} ]" 
                v-bind:key="opt._id"
                :selected="opt._id == this.waitListSettings.wait_list_auto_manage_type ? true : false" :value="opt._id">
                {{opt.name}}
            </option>
        </select>  
        
      </CInputGroup>
      <CInputGroup class="mb-2" >
        <label class="me-2" for="Input1">Max hold hours for converted bookings</label>
        <CFormInput  id="Input1" min="0" type="number" class="radius-rt-rb-0 radius-lt-6 radius-lb-6"
                    v-model="this.waitListSettings.wait_list_booking_hold_hrs"/>
        <CInputGroupText>Hrs</CInputGroupText>
      </CInputGroup>
    </CCol>
  </CRow>
  <label> Daily Waitlist to Booking Conversion Job Schedule: <strong>
      {{waitListSettings.wait_list_bc_job_sched_hh_mm}}</strong>  (HH:MM)
  </label>

<!--
      <label> Time to run
      <v-select
        label="text"
        aria-label="Time_to_run"
        :options="options"
        v-model="waitListSettings.wait_list_daily_run_time"
        :reduce="text => text.value"
      >
      </v-select>
      </label>
-->
    <br/>
    <CCol class="">
    <CButton :disabled="disabled" color="primary" class="float-end btn btn-success" v-on:click="updateSettings">
    <CSpinner aria-hidden="true" component="span" size="sm" v-if="spinner"/>
  Save</CButton>
    </CCol>
      </CCardBody>
    <CModal alignment="center" :visible="success" @close="() => { this.success = false }">
      <CModalHeader>
        <CModalTitle>Update Successful</CModalTitle>
      </CModalHeader>
      <CModalBody>
        You have updated your Wait List settings
      </CModalBody>
    </CModal>
  </CCard>
<!--  Save button-->


</template>

<script>
    export default {
        name: "WaitListSettings",
      data (){
          return {
            success:false,
            disabled:false,
            spinner:false,
            run_time:0,
            waitListSettings:{
              wait_list_enable : false,
              wait_list_allow_customer_to_add : false,
              wait_list_auto_manage           : true,
              wait_list_booking_hold_hrs     : '2',
              wait_list_daily_run_time        : '0'
            },
            options: [...Array(24)].map((e, i) => {
              let suffix = i >= 12 ? "PM":"AM";
              let text = ((i + 11) % 12 + 1) +' '+suffix+"("+i+")";
              return {value:i, text:text};
            }),
          }
      },
      created() {
          this.$schedsdk.getWaitListSettings().then((result)=>{
            if(result.status===1) {
             this.$store.state.business_settings.wait_list_settings = result.data.wait_list_settings;
             this.waitListSettings.wait_list_enable=  result.data.wait_list_settings.wait_list_enable;
              this.waitListSettings.wait_list_allow_customer_to_add =result.data.wait_list_settings.wait_list_allow_customer_to_add;
              this.waitListSettings.wait_list_auto_manage = result.data.wait_list_settings.wait_list_auto_manage;
              this.waitListSettings.wait_list_booking_hold_hrs = result.data.wait_list_settings.wait_list_booking_hold_hrs.toString();
              this.waitListSettings.wait_list_daily_run_time = this.convert24to12(result.data.wait_list_settings.wait_list_daily_run_time);
              this.waitListSettings.wait_list_bc_job_sched_hh_mm = result.data.wait_list_settings.wait_list_bc_job_sched_hh_mm;
              this.waitListSettings.wait_list_auto_manage_type = result.data.wait_list_settings.wait_list_auto_manage_type;
            this.run_time=result.data.wait_list_settings.wait_list_daily_run_time
            }
          })

      },
      methods:{
          updateSettings(){
            this.disabled=true
              this.spinner=true
            if(isNaN(this.waitListSettings.wait_list_daily_run_time)){
              this.waitListSettings.wait_list_daily_run_time=this.run_time;
            }
            delete this.waitListSettings.wait_list_bc_job_sched_hh_mm;
            this.$schedsdk.updateWaitListSettings(this.waitListSettings).then(()=>{
              this.success=true;
              this.disabled=false
                this.spinner=false
              
            }).catch((error)=>{
              console.log(error)
            })
          },
        convert24to12(i){
          let suffix = i >= 12 ? "PM":"AM";
           i = ((i + 11) % 12 + 1) +' '+suffix+"("+i+")";
           return i
        }
      }
    }
</script>

<style scoped>

</style>
