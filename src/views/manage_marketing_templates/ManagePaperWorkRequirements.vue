<template>

  <div>
    <div class="col-md-12 text-right">
        <button class="btn btn-success"  @click="$router.push('/paperwork/manage_paperwork_requirements/add_edit')"> Add New Paperwork </button>
    </div>
    <br>
    <CRow>
      <CCol sm="12">
          
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                 <th>Name</th>
                  <th>Active</th>
                  <th>Required for booking</th>
                  <th>Template</th> 
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody>
              <tr v-if="list.length">
                <template v-for="(item, index) in list" :key="index">
                  <td>{{item.paperwork_name}}</td>
                  <td>{{item.is_active?"Yes":"No"}} </td>
                  <td>{{item.is_required?"Yes":"No" }}  </td>
                   <td>{{item.external_law_doc_name }}  </td>
                  <td class="action_column">
                    <button type="button" 
                         @click="editPaperwork(item)" 
                         class="btn btn-primary btn-sm" >Edit</button>
                    <button type="button" 
                         @click="deleteHandler(item)" 
                         class="btn btn-info btn-sm" >Delete</button>
                  </td> 
                </template>
              </tr>
              
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
  </div>

  
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment-timezone'
import Alerts from '../Alerts'
export default {
  name: 'BusinessPaperworkRequirements',
  components: { Pagination, Alerts },
  data (){
      return({
        search:'',
        list:[],
        page:1,
        pageCount:1,
        customer_id: '',
        hint_has_required_paperworks: this.$store.state.business_settings.hint_has_required_paperworks,
        timezone : this.$store.state.business_settings.business_time_zone,
          
        showsetupalert: false 
      })
  },
  created(){
      this.getCustomerPaperworkList();
  },
  methods:{
    doGetPaperworkList()
    {
        this.$schedsdk.get_paperwork_definitions_list({customer_id: this.customer_id}).then((result)=>{
              if(result.status == 1)
              {
                this.list = result.data
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
    deleteHandler(item)
    {
        let confirmed = confirm("Are you sure to delete this setup?");
        if(confirmed)
        {
             this.$schedsdk.delete_paperwork_definition({_id: item._id})
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
    editPaperwork: function (item) 
    {
         this.$router.push("/paperwork/manage_paperwork_requirements/add_edit/"+item._id);

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
