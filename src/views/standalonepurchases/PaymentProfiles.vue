<template>
  <div class="pt-2">
        <div class="row controls-div">
                <div class="settings-text">Filter Options</div>
                <div class="col-md-4 col-6">
                    <label class="control-label"><b>Card last 4</b></label>
                    <input 
                    v-model="last4"
                    class="form-control placeholder-no-fix" 
                    @keyup="fetchItemList()"
                    type="text" 
                    />
                </div>
                <div class="col-md-12 mt-3">
                    <label class="control-label mb-0"><b>Information:</b></label>
                    <span>These cards belong to the owner of 
                        {{this.$store.state.business_settings.business_info.business_name}} to 
                        purchase credits/items from Sky Salon</span>
                </div>
        </div> 
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
                <tr>
                    <th>Nick Name</th>
                    <th>Account</th>
                    <th>Expiry</th> 
                    <th>Is valid</th> 
                    <th>Last Used</th> 
                    <th>Action</th> 
                </tr>
          </thead>
          <tbody v-if="list.length"> 
               <tr v-for="(pline, index) in list" :key="index"> 
                        <td>{{pline.nick_name}}</td> 
                        <td>{{pline.brand}} {{pline.last4}}</td> 
                        <td>{{pline.exp_month}}/{{pline.exp_year}}</td>
                         <td>{{pline.is_valid}}</td> 
                        <td>{{getFormattedDateTime(pline.last_used_date)}}</td> 
                        <td>
                            <button class="btn btn-primary btn-sm" 
                                @click="deleteHandler(pline)">Delete</button>
                            <!-- <button class="btn btn-primary btn-sm" 
                                @click="paymentDetailsHandler(pline._id)">Details</button> -->
                        </td> 
                </tr>  
            
          </tbody>
         <tbody v-else>
            <tr>
                 <td colspan="10" class="text-center">
                     <div class="py-5">
                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                        <p class="h5 mt-4 d-block fw-normal">
                            No payment profiles exist. 
                     One can be added at purchase time by saving the card
                        </p>
                    </div>
                </td>
            </tr>
         </tbody>
      </table>
    </div>
    <Pagination class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Payment profiles results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

      <CModal :visible="showPaymentDetails">
          <CModalHeader>
        <CModalTitle>Payment Profile Details</CModalTitle>
    </CModalHeader>
    <CModalBody>
       
            <div class="row">
              <div class="col-md-4">
                 Nick name
              </div>
              <div class="col-md-4">
                {{payment_profile_data.id}}
              </div>
            </div>
             
            
    </CModalBody>
        <CModalFooter>
        <CButton @click="DoneDetails" color="success">Done</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment'
import {debounce as lodash_debounce} from 'lodash'
import  '../../assets/css/common.css';
export default {
  name: 'PaymentRecordList',
  components: { Pagination },
  data (){
      return({
        search:'',
        list:[],
      
        page:1,
        pageCount:1,
        payments: [],
        txn_ref_num: '',
        last4: '',
        invoice_number: '',
        business_currency_symbol: this.$store.state.business_settings.business_currency_symbol,
        showPaymentDetails: false,
        payment_profile_data: {id:""}
      })
  },
  created(){    
      this.fetchItemList();
      
  },
  methods:{
    doGetItemList(context){

        
         this.$schedsdk.get_standalonepurchase_cards_on_file({}).then((result)=>
            {
                if(result.status ==1)
                {
                    this.list = result.data
                }
                else
                {
                    this.list = [];
                }
               
            })
    },
   
    fetchItemList() {
        this.getItemListSvr(this)
    },

    getItemListSvr :   lodash_debounce((context)=>{
            context.doGetItemList(context)  
        }, 400),
    
     
     
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.fetchItemList();
    },
    getFormattedDate: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY hh:mm a");//"MMM DD, YYYY hh:mm a"
    },
    getFormattedDateTime: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY hh:mm a");//"MMM DD, YYYY hh:mm a"
    },
    getLimitedTxnNum: function (n)
    {
        if (n.length < 14)
        {
            return n;
        }
        return "..." + n.slice(-14);
    },
    DoneDetails: function(e)
    {
        this.showPaymentDetails = false
    },
    paymentDetailsHandler: function(id){
        this.$schedsdk.get_invoice_payment_provider_rec_details(id).then((result)=>
        {
            //console.log("get_invoice_payment_rec_details -- --- ")
            //console.log(result)
            if(result.status == 1)
            {
                  this.payment_profile_data = result.data
            }
            else
            {
                 this.payment_profile_data = {id: "Not found"}
            }
            this.showPaymentDetails = true
        })
    },
    deleteHandler(item)
    {
        let confirm_string = "Confirm delete " + item.nick_name + "?"
        if (item.is_preferred)
        {
          confirm_string += " Subscriptions may be affected without a default payment";
        } 
        let confirmed = confirm(confirm_string);
        if(confirmed)
        {
            
             this.$schedsdk.delete_standalonepurchase_cards_on_file({
                    customer_id: this.customer_id, 
                    cof_id: item._id})
                .then((result)=>{
                    if(result.status == 1)
                    {
                         this.fetchItemList();
                    }
                    else
                    {
                        console.log("Error deleting COF... ");
                    }
          
                })
        }
    },
  }
    
}
</script>
