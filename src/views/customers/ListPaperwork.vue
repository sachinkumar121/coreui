<template>
  <div>
    <Alerts 
      :alertData="alertData" 
      :show="show"
      @alertClosed="alertClosedFn"
      v-if="alert" 
    />
    <CRow>
      <CCol sm="12">
          
        <table class="table table-bordered">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                 <th>Name</th>
                  <th>Setup Date</th>
                  <th>Expiry Date</th>
                  <th>Is Obsolete</th>
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody>
            <template v-if="list.length">
              <tr v-for="(item, index) in list" :key="index">
                <td>{{item.paperwork_name}}</td>
                <td>{{getFormattedDate(item.setup_date)}} </td>
                <td>{{getFormattedDate(item.expiry_date) }}  </td>
                <td>{{item.cpwk_is_obsolete==true?"Yes":"No"}}</td>
                <td class="action_column">
                  <button type="button" v-if="item.external_law_id != null && 
                        item.external_law_id.length > 2 && item.setup_date == null" 
                        @click="openSignNowNewWindow(item._id,  customer_id)" 
                        class="btn btn-success btn-sm">Sign Now</button>
                  <div v-if="item.setup_date != null && item.setup_date > 0">
                    <button type="button" @click="openSignNowNewWindow(item.paperwork_id, customer_id)" class="btn btn-success btn-sm">ReSign</button>
                    <button type="button" @click="openViewAgreementNewWindow(item)" class="btn btn-primary btn-sm">View</button>
                    <button type="button" @click="deleteSignedDocHandler(item)" class="btn btn-info btn-sm">Delete</button>
                 
                    <button v-if="item.externally_requested_sign_id" 
                        type="button" @click="downloadAgreement(item)" 
                        class="btn btn-primary btn-sm" 
                        :disabled="item.disable_action_button">Download PDF</button>
                    <button v-if="item.externally_requested_sign_id" 
                        type="button" @click="ReGenerateAgreementPDF(item)" 
                        class="btn btn-secondary btn-sm" 
                        :disabled="item.disable_action_button">{{ 
                          item.disable_action_button ? "PDF generation in progress" : "Recreate PDF" }}</button>
                    
                  </div>

                  <button class="btn btn-primary btn-sm" 
                      type="button" @click="openEmailModal(item)">Send for Sign</button>              

                  <button type="button" v-if="item.external_law_id == null || item.external_law_id.length <= 2" 
                        @click="showAlertForNotSetup(item.external_law_id, customer_id)" 
                        class="btn btn-success btn-sm">Info</button>
                  <button
                      class="btn btn-primary btn-sm" type="button" 
                      @click="$router.push(`/customers/list_paperwork/logs/${customer_id}/${item.paperwork_id}/${item.externally_requested_sign_id?item.externally_requested_sign_id:''}`)">View Logs</button>              
                   
                </td> 
              </tr>
            </template>
              <!-- <tr v-else><td colspan="10" class="text-center">No Customer Exists</td></tr> -->
          </tbody>
      </table>
        
    </CCol>
    </CRow>
    <CModal :visible="showsetupalert">
        <CModalHeader>
        <CModalTitle>Setup Document template for sign</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <div class="row">
            <p class="error-msg" v-if="showsetupalert">
                This paperwork does not have a document template to collect a signature. <br>
                Please use the app to setup a document template for this paperwork.<br>
                <ul>
                    <li>In the app, go to <strong>Settings</strong> -> <strong>Paperwork / Waiver Agreement Setup</strong></li>
                    <li>In the list of paperworks, <strong>Edit</strong> -> ensure you select <strong>Document template for sign</strong> options</li>
                </ul>                    
            </p>
        </div>
        </CModalBody>
        <CModalFooter>
        <CButton @click="showsetupalert = false" color="success">OK</CButton>
      </CModalFooter>
    </CModal>
    <EmailPaperworkSignModal
      :user_data="customer_data"
      :paperwork_data="selected_paperwork"
      :visible="showEmailPaperworkModal"
      @close="showEmailPaperworkModal = false"
      @success="onEmailSentSuccess"
      @error="onEmailSentFail"
    />
  </div>

  
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment-timezone'
import Alerts from '../Alerts'
import utils_lib from '../../helpers/utils_lib';
import EmailPaperworkSignModal from './EmailPaperworkSignModal.vue'

export default {
  name: 'CustomerPaperWorkList',
  components: { Pagination, Alerts, EmailPaperworkSignModal },
  data (){
      return({
        search:'',
        list:[],
        page:1,
        pageCount:1,
        customer_id: '',
        hint_has_required_paperworks: this.$store.state.business_settings.hint_has_required_paperworks,
        timezone : this.$store.state.business_settings.business_time_zone,
          
        showsetupalert: false,
        intervalId: null,
        pdf_generation_requests: [],
        get_counter_url : 0,
        alert: false,
        show: 0,
        alertData: {
          message: '',
          type: ''
        },
        showEmailPaperworkModal: false,
        customer_data: {},
        selected_paperwork: {},
      })
  },
  created(){
    this.getCustomerPaperworkList();
    
  },
  unmounted() {
    window.removeEventListener('resize', this.getDimensions);
    clearInterval(this.intervalId);
  },
  methods:{
    openEmailModal(item) {
      this.showEmailPaperworkModal = true
      this.selected_paperwork = item;
    },
    onEmailSentSuccess(message) {
      this.alertData = {
          message: message,
          type:'success'
      }
      this.alert = true;
      this.show = 4;
    },
    onEmailSentFail(message) {
      this.alertData = {
          message: message,
          type:'danger'
      }
      this.alert = true;
      this.show = 4;
    },
    alertClosedFn() {
      this.show = 0;
    },
    schedulePollForCustomerPaperwork() {
      this.intervalId = setInterval(() => {
        this.getCustomerPaperworkList();
      }, 7000);
      this.get_counter_url =0
    },
    disableActionButton(item) {
     // console.log(item.signing_request_law)
      return item.signing_request_law && 
          item.signing_request_law.job_id && 
          item.signing_request_law.job_timestamp && 
          !utils_lib.isMoreThanMinutesOld(item.signing_request_law.job_timestamp, 10) || false;
    },
    doGetPaperworkList()
    {
        this.$schedsdk.get_customer_paperwork_list({customer_id: this.customer_id, get_obsolete_customer_papers: true}).then((result)=>{
              if(result.status == 1)
              {
                this.list = result.data;
                this.customer_data = result.customer;
                this.list = this.list.map((item) => {
                  item.disable_action_button = this.disableActionButton(item);
                  return item;
                });
                if (this.pdf_generation_requests.length) 
                {
                  this.list.filter(l => {
                    return this.pdf_generation_requests.includes(l._id) && l.disable_action_button == false;
                  }).forEach((item) => {
                    this.downloadAgreement(item);
                    this.pdf_generation_requests.splice(this.pdf_generation_requests.indexOf(item._id), 1);
                  });
                  this.schedulePollForCustomerPaperwork();
                }
                else
                {
                  clearInterval(this.intervalId);
                }
            }
            this.get_counter_url++
            if (this.get_counter_url >10)
            {
              clearInterval(this.intervalId);
            }
          
        })
    } ,
     getCustomerPaperworkList() {
        
        if(this.$route.params.customer_id)
        {
            this.customer_id = this.$route.params.customer_id;
        }
        this.doGetPaperworkList();
       
    },
    setPage(pageNo){
      this.page = pageNo;
      this.getCustomerPaperworkList();
    },
    
    getFormattedDate: function (dt_unix) 
    {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix)
                            .tz(this.timezone)
                            .format('MMM DD YYYY')
    },
    deleteSignedDocHandler(item)
    {
        let confirmed = confirm("Are you sure to delete this signed document?");
        if(confirmed)
        {
            console.log("delete.... "  + item.paperwork_name)
             this.$schedsdk.delete_customer_paperwork({customer_id: this.customer_id, _id: item._id})
                .then((result)=>{
                    if(result.status == 1)
                    {
                        setTimeout(function () 
                        {
                                this.doGetPaperworkList(this.rec_id);
                        }.bind(this), 
                        500); 
                    }
                    else{
                        console.log("Error deleting paperwork... ");
                    }
          
                })
        }
    },
    openSignNowNewWindow: function (id, cid) 
    {
        let base = "extpages/show_agreement/" + this.$store.state.business_settings.api_access_account_id
         window.open(this.$store.state.skysched_global_api_base_url + 
                    base + "/" +
                    id + 
                    "?external_customer_ref=" + cid, '_blank');

    },
    downloadAgreement: function (item) 
    {
      let url = `${this.$store.state.skysched_global_api_base_url}r/fileaccess/${this.$store.state.business_settings.api_access_account_id}/${item.signing_request_law.full_pdf_file_id}/download`;
      window.open(url);
    },

    ReGenerateAgreementPDF: async function (item) {
      let confirmed = confirm("Regnerate PDF from signature data?");
      if(confirmed)
      {
        this.pdf_generation_requests.push(item._id);
        item.disable_action_button = true;
        await this.$schedsdk.generate_agreement_pdf({sign_id: item.externally_requested_sign_id});
        this.schedulePollForCustomerPaperwork();
      }
    },
    openViewAgreementNewWindow: function (item) 
    {
      let base = `extpages/view_signed_agreement/${this.$store.state.business_settings.api_access_account_id}`;
      let url = this.$store.state.skysched_global_api_base_url + base + "/" + item.paperwork_id +  "/" + item.externally_requested_sign_id + "?view_only=1&external_customer_ref=" + this.customer_id;
      window.open(url, '_blank');
    },
    showAlertForNotSetup: function (item) 
    {
        
        this.showsetupalert = true;
        
    }

    
  }
    
}
</script>
<style scoped>
    .action_column button {
        margin: 3px
    }
</style>
