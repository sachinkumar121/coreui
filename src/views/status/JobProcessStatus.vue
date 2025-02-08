<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
                Job Process Results
          </CCardHeader>
          <CCardBody>
              <CRow>
                  <CCol col="4" class="text-right">
                      Job Name
                 </CCol>
                 <CCol col="4" class="text-left"  v-model="job_name">
                      {{this.job_name}}
                 </CCol>
            </CRow>
            <CRow>
                  <CCol col="4" class="text-right">
                      Job Status
                 </CCol>
                 <CCol col="4" class="text-left text-capitalize" v-model="job_status">
                      {{this.job_status}} 
                      <div class="spinner-border spinner-border-sm" role="status" v-if="job_status !== 'complete'">
                     </div>
                 </CCol>
            </CRow>

            
             <CRow>
                  <CCol col="4" class="text-right">
                     Result
                 </CCol>
                 <CCol col="4" class="text-left text-capitalize" v-model="job_result">
                      {{this.job_result}}
                 </CCol>
            </CRow>            

            <CRow>
                  <CCol col="4" class="text-right">
                      Records Processed
                 </CCol>
                 <CCol col="4" class="text-left" v-model="job_records_processed">
                      {{this.job_records_processed}}
                 </CCol>
            </CRow>

            <CRow>
                  <CCol col="4" class="text-right">
                      Result Details
                 </CCol>
                 <CCol col="4" class="text-left" v-html="result_details"></CCol>
            </CRow>
             <CRow>
                  <CCol col="4" class="text-right">
                      Last Updated
                 </CCol>
                 <CCol col="4" class="text-left">
                      {{this.job_updated}}
                 </CCol>
            </CRow>         
          </CCardBody>
          <CCardFooter class="text-center">
            <CButton @click='okDone' size="sm" color="info" >
              <CIcon name="cil-check-circle" /> Dashboard
            </CButton>
            &nbsp;&nbsp;&nbsp;
            <CButton @click='Goback' size="sm" color="success" >
              <CIcon name="cil-cursor" /> Back
            </CButton>
            
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import moment from 'moment-timezone'
export default {
  name: "Customers",
  data() {
      // console.log(import.meta.env)
    return { 
        job_name             : 'Fetching...',
        job_tag              : '',
        job_updated          : '',
        job_status           : '',
        job_result           : '',
        result_details       : '',
        job_records_processed: 0,
        fetch_error          : '',
        rec_id               : '',
        seq_http_errs        : 0,
        seq_http_calls       : 0,
        timezone             : 0,
        scheduled_objects    : [],
        };
  },
  created(){
      this.rec_id = this.$route.params.rec_id;
      this.timezone = this.$store.state.business_settings.business_time_zone
      this.loadData(this.rec_id);
  },

  methods: {
    schedule_poll: function(){
            if (this.seq_http_errs > 5)
            {
                return;
            }
            if (this.seq_http_calls>50)
            {
                   return;
            }
            this.seq_http_calls++;
            let v = setTimeout(function () 
                {
                    this.loadData(this.rec_id);
                }.bind(this), 
                7000); 
            this.scheduled_objects.push(v);

    },
    loadData: function (rec_id) {

         this.$schedsdk.get_job_process_status(rec_id).then((result)=>{
              
                this.seq_http_errs = 0;
                console.log("job process status....");
                console.log(result);
                this.job_name = result.data.sync_job_name
                
                if(result.data.sync_job_updated)
                {
                    //UTC In business timezone
                    this.job_updated  = 
                            moment(result.data.sync_job_updated)
                            .tz(this.timezone)
                            .format('MMM DD, YYYY h:m a');
                }
                this.job_status =  result.data.sync_job_status
                this.job_records_processed = result.data.sync_job_records_processed
                if (this.job_status=='complete')
                {
                    this.job_result = result.data.sync_job_result
                    //
                    if (result.data.sync_job_result_detail != null)
                    {
                        let res_obj = JSON.parse(result.data.sync_job_result_detail);
                        let keys = Object.keys(res_obj)
                        let printres = "<table>";
                        
                        for(let i = 0; i< keys.length; i++)
                        {
                            //
                            let label = keys[i];
                            let value = res_obj[keys[i]] 
                            label = label.replace(/_/g, " ", );
                            if (label.toLowerCase() == 'status' ||
                                label.toLowerCase() == 'message')
                            {
                                continue;
                            }
                            if (value === null)
                            {
                                continue;
                            }
                            printres += "<tr>";
                            printres += "<td class='text-right text-capitalize'>" + label + ": &nbsp;</td> ";
                            printres += "<td class= 'text-left'> &nbsp;" + value + " </td> ";
                            printres += "</tr>";
                        }
                        printres += "</table>";
                        this.result_details = printres
                    }
                    
                }
                else
                {
                    //call this function after a delay.
                    console.log("calling again....");
                    this.schedule_poll();
                }                
                
                
          }).catch(err => {
              this.fetch_error  = err;
              this.seq_http_errs++;
              this.schedule_poll();
          });
      
    },
    clearTimes()
    {
          this.scheduled_objects.forEach(element => {
               clearTimeout(element);
           });
    },
     okDone(){
            this.clearTimes();
           this.$router.push({ name: 'Dashboard' }) 
         },
    Goback(){
            this.clearTimes();
           this.$router.go(-1)
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