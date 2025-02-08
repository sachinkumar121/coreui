<template>
<div>
   <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
    <CRow>
      <CCol sm="12">
          <div class="panel panel-default">
            <div class="invoice_data px-0">
                    <div class="formatted_data">
                        <b>Invoice No: {{inv_det.invoice_number}}</b>
                    </div>
                    <div class="formatted_data">
                        <b>Due date: {{getFormattedDate(inv_det.due_date)}}</b>
                    </div>
                    <div class="formatted_data" v-if="inv_det.single_source_order_id != ''">
                        <a href="javascript:void(0)" @click="$router.push('/bookings/detail/'+  inv_det.single_source_order_id)">Booking Details</a>
                    </div>
                </div>
            <div class="customer_detail">
                <span class="heading_span"> Invoice To:</span>
                <div class="formatted_data">
                    {{customer_data.first_name}} {{customer_data.last_name}}
                </div>
                <div class="formatted_data">
                    {{customer_data.phone}}
                </div>
                <div class="formatted_data">
                    {{customer_data.email}}
                </div>
            </div>
            <div class="business_detail">
                <span class="heading_span"> Invoice From: </span>
                <!-- <div class="formatted_data">
                    <img :src='business_data.small_logo_url' class="business_logo" />
                </div> -->
                <div class="formatted_data">
                    {{business_data.business_name}}
                </div>
                <div class="formatted_data">
                    {{business_data.business_phone}}
                </div>
                <div class="formatted_data">
                    {{business_data.business_email}}
                </div>
            </div>
            <!-- Table -->
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Qty</th> 
                        <th>Amount</th> 
                    </tr>
                </thead>
                <tbody> 
                  <template v-if='invoice_for_display.length'>
                    <tr v-for="(iline, index) in invoice_for_display" :key="index">
                      <td>{{ iline.item_name }}</td> 
                      <td>{{ iline.item_qty }}</td> 
                      <td>{{business_currency_symbol}} {{ iline.extended_price }}</td> 
                    </tr>   
                  </template>
                    <tr> 
                        <td colspan="2" class="totals">Total</td> 
                        <td>{{business_currency_symbol}} {{amounts.invoice_total}}</td> 
                    </tr>       
                    <tr> 
                            <td colspan="2" class="totals">Paid</td> 
                            <td>{{business_currency_symbol}} {{amounts.invoice_paid_amount}}</td> 
                    </tr>       
                    <tr> 
                            <td colspan="2" class="totals">Due</td> 
                            <td>{{business_currency_symbol}} {{amounts.invoice_amount_due}}</td> 
                    </tr>       
                </tbody>
            </table>
            
            <div>
                &nbsp; <button class="btn btn-success pull-left"> Email Invoice </button>
                &nbsp; <button class="btn btn-primary pull-right"  
                    @click="settleReleasePayments(inv_det.single_source_order_id, inv_det.invoice_number)" 
                    v-if="amounts.invoice_paid_amount>amounts.invoice_total" > 
                     Settle/Release Excess Payment of {{business_currency_symbol}}{{getExcessPayment(amounts)}}</button>
                &nbsp;
           
              <button   class="btn btn-info  pull-right"  @click="removeCancellationCharges(inv_det.single_source_order_id, inv_det.invoice_number)"> Remove Cancellation Charges </button>
                &nbsp;
              <button   class="btn btn-info  pull-right"  
                    @click="payByCardOnFile(inv_det.single_source_order_type, inv_det.single_source_order_id, inv_det.invoice_number)">
                    Pay by Card on File</button>
           
            </div>
            <br>
            <div>
                  &nbsp;
           
              <button   class="btn btn-success  pull-right"  @click="takePaymentOnDevice( inv_det.invoice_number)"> Take Payment on Device </button>
             &nbsp;
            
             <button   class="btn btn-primary  pull-right"  @click="printInvoiceOnDevice( inv_det.invoice_number)"> Print Invoice on Device </button>
          &nbsp;
           
            <button   class="btn btn-danger  pull-right"  @click="refundOnDevice( inv_det.invoice_number)"> Refund on Device </button>
        
            </div>
            <br/>
                <div class="formatted_data">
                    <b>Payment Records</b>
                </div>
            <br/>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Card Source</th>
                        <th>Operation</th> 
                        <th>Payment Date</th> 
                        <th>Transaction Number</th> 
                        <th>Amount</th> 
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-if='payments.length'>
                        <template v-for="(pline, index) in payments" :key="index">
                        <td v-if="pline.payment_txn_type == 0">Card</td> 
                        <td v-else-if="pline.payment_txn_type == 1">Cash</td> 
                        <td v-else-if="pline.payment_txn_type == 2">Check</td> 
                        <td v-else>Other</td> 
                        
                        <td>{{ pline.payment_funding_method_short.replace("PT_CARDBRAND_", "") || "" }}</td> 
                        <td>{{ pline.payment_txn_operation.replace("PT_TT_", "") }}</td> 
                        <td>{{getFormattedDateTime(pline.applied_payment_date)}}</td> 
                        <td>{{ pline.payment_txn_number }}</td> 
                        <td>{{business_currency_symbol}} {{ pline.applied_payment_value }}</td> 
                        <td>
                            <button class="btn btn-primary btn-sm" 
                                @click="paymentDetailsHandler(pline._id)">Details</button>
                                &nbsp;
                            <button v-if="pline.is_refunded==false && pline.was_replaced==false && pline.payment_txn_operation != 'PT_TT_REFUND'" class="btn btn-danger btn-sm" 
                                @click="refundPayment(pline.invoice_number, pline._id, false)">Refund</button> 
                                &nbsp;
                            <button v-if="pline.is_refunded==false && pline.was_replaced==false && 
                                    pline.payment_txn_operation != 'PT_TT_REFUND'" class="btn btn-info btn-sm" 
                                @click="refundPayment(pline.invoice_number, pline._id, true)">Manual Refund</button>
                        </td> 
                        </template>
                    </tr>  
                    <tr> 
                        <td colspan="5" class="totals">Total</td> 
                        <td>{{business_currency_symbol}} {{total_paid_amount}}</td> 
                    </tr> 
                </tbody>
            </table>
        </div>
        <div>
            <button @click="$router.go(-1);" class="btn btn-primary">Back</button>
        </div>  
      </CCol>
    </CRow>
      <CModal :visible="showPaymentDetails">
           <CModalHeader>
        <CModalTitle>Payment Details</CModalTitle>
    </CModalHeader>
    <CModalBody>
       
            <div class="row">
              <div class="col-md-4">
                 Payment ID
              </div>
              <div class="col-md-4">
                {{payment_data.id}}
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                  Processor Captured?
              </div>
              <div class="col-md-4">
                {{payment_data.captured}}
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                  Transaction State
              </div>
              <div class="col-md-4">
                {{payment_data.state}}
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                  Processor result
              </div>
              <div class="col-md-4">
                {{payment_data.result}}
              </div>
            </div>
            </CModalBody>
        <CModalFooter>
        <CButton @click="DoneDetails" color="success">Done</CButton>
      </CModalFooter>
    </CModal>
 
    <PaymentByCof
                :key="cof_key"
                v-if  = "show_take_payment_by_cof"
                :customer_id = "customer_data._id"
                :order_number = "cof_order_number"
                :order_type ="cof_order_type"
                :invoice_number ="cof_invoice_number"
                :order_manage_access_key = "cof_order_manage_access_key"
                
        ></PaymentByCof>
  </div>
  
</template>

<script>
import moment from 'moment'
import Alerts from '../Alerts'
import PaymentByCof from './PaymentByCof.vue';
export default {
    name: 'DetailInvoice',
    components: {   Alerts, PaymentByCof },
     data () {
      return { 
        inv_det:{},
        amounts:{},
        customer_data:{},
        
        business_data:{},
        invoice_for_display:[],
        payments:[],
        business_currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        total_paid_amount:0,
        showPaymentDetails: false,
        payment_data: {},
        alert:false,
        show:0,
        alertData:{
            message:'',
            type:''
        },
        show_take_payment_by_cof: false,
        cof_order_number: "",
        cof_order_type: "p",
        cof_key: "",
        cof_order_manage_access_key: "",
        cof_invoice_number: ""
      }
    },
    created(){
        this.getInvoiceDetail();
    },
    methods: {
    getInvoiceDetail(){
        this.$schedsdk.get_invoice_detail({invoice_no:this.$route.params.invoice_no}).then((result)=>{
            if(result.status == 1){
                this.inv_det = result.data.invoice_detail.invoice_data
                

                this.amounts = result.data.amounts
                this.business_data = result.data.business_data
                this.customer_data = result.data.customer_data
                this.invoice_for_display = result.data.invoice_detail.invoice_lines
                this.payments = result.data.invoice_detail.payment_record;
                for(let p=0;p<this.payments.length;p++)
                {
                    this.total_paid_amount += this.payments[p].applied_payment_value;

                    //console.log(this.payments[p].applied_payment_includes_pc_fees + " "  + this.payments[p].pc_fee_total)
                    let line_pc_fee_total = 0
                    if (this.payments[p].applied_payment_includes_pc_fees === false)
                    {
                         line_pc_fee_total = (isNaN(this.payments[p].pc_fee_total)? 0 : this.payments[p].pc_fee_total)
                    }
                    this.total_paid_amount += line_pc_fee_total
                    //change this.payments[p].applied_payment_value for display
                    this.payments[p].applied_payment_value += line_pc_fee_total;
                }
                 this.total_paid_amount = Math.round( this.total_paid_amount* 100) / 100
                
            }
        })
    },
    getExcessPayment(amounts)
    {
        //console.log(amounts)
        return Math.round( (amounts.invoice_paid_amount-amounts.invoice_total) * 100)/100
    },
    getFormattedDate: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY");//"MMM DD, YYYY"
    },
    getFormattedDateTime: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY hh:mm a");//"MMM DD, YYYY hh:mm a"
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
                  this.payment_data = result.data
            }
            else
            {
                 this.payment_data = {id: "Not found"}
            }
            this.showPaymentDetails = true
        })
    },
    refundPayment(invoice_number, payment_id, is_manual)
    {
        let confirmed = confirm("Are you sure to refund this payment: " + payment_id + "?");
        if(!confirmed)
        {
            return;
        }

        
        this.$schedsdk.manage_invoice_refund_payment(
                    {payment_id: payment_id, invoice_number: invoice_number, is_manual: is_manual})
                .then((result)=>
        {
            //console.log("get_invoice_payment_rec_details -- --- ")
            //console.log(result)
            let data = {}
            this.alert = false;
            this.show = 0;
            if(result.status == 1)
            {
                 data = {
                        message: "Success refunding payment for " + payment_id,
                        type:'success'
                    }
                this.getInvoiceDetail();
            }
            else
            {
                 data = {
                        message: "Error refunding payment for " + invoice_number,
                        type:'danger'
                    }
            }

            this.alertData = data
            this.alert = true;
            this.show=4;
        
        })
    },

    settleReleasePayments: function(source_order_id, invoice_number)
    {

        let confirmed = confirm("Settle/Release excess attempts to refund a partial amount. This may not be successful if payment is already deposited to your bank. Continue?");
        if(!confirmed)
        {
            return;
        }
        this.alertData = {
                        message: "Settling / Releasing excess payment for " + invoice_number,
                        type:'info'
                    }
        this.alert = true;
        this.show=4;
        this.$schedsdk.settleReleasePayments({source_order_id: source_order_id, invoice_number: invoice_number})
                .then((result)=>
        {
            //console.log("get_invoice_payment_rec_details -- --- ")
            //console.log(result)
            let data = {}
            this.alert = false;
            this.show = 0;
            if(result.status == 1)
            {
                 data = {
                        message: "Success Settling / Releasing excess payment for " + invoice_number,
                        type:'success'
                    }
                this.getInvoiceDetail();
            }
            else
            {
                 data = {
                        message: "Error Settling / Releasing excess payment for " + invoice_number,
                        type:'danger'
                    }
            }

            this.alertData = data
            this.alert = true;
            this.show=4;
        
        })
    },
    removeCancellationCharges: function(source_order_id, invoice_number)
    {

        let confirmed = confirm("Remove any cancellation charges applied?");
        if(!confirmed)
        {
            return;
        }
        this.alertData = {
                        message: "Removing cancellation charges for " + invoice_number,
                        type:'info'
                    }
        this.alert = true;
        this.show=4;
        this.$schedsdk.addRemoveCancellationCharges({booking_id: source_order_id, type:2, invoice_number: invoice_number})
                .then((result)=>
        {
            //console.log("get_invoice_payment_rec_details -- --- ")
            //console.log(result)
            let data = {}
            this.alert = false;
            this.show = 0;
            if(result.status == 1)
            {
                 data = {
                        message: "Success removed cancellation charges " + invoice_number,
                        type:'success'
                    }
                this.getInvoiceDetail();
            }
            else
            {
                 data = {
                        message: "Error removing cancellation charges for " + invoice_number,
                        type:'danger'
                    }
            }

            this.alertData = data
            this.alert = true;
            this.show=4;
        
        })
    },
    make_access_key(business_settings, order_num)
    {
        //console.log(business_settings.api_access_account_id + "/" + order_num)
        return business_settings.api_access_account_id + "/" + order_num
    },
    payByCardOnFile(order_type,source_order_id, invoice_number)
    {
        this.cof_order_number =source_order_id;
        this.cof_order_type = order_type===undefined?'b':order_type;
        this.cof_invoice_number = invoice_number
        this.cof_order_manage_access_key = this.make_access_key(this.$store.state.business_settings,source_order_id);
        this.cof_key = moment().utc().valueOf()
        this.show_take_payment_by_cof = true;  
      
        console.log("asdasdasd--- " , this.cof_order_number ) 
    },
    refundOnDevice : function(invoice_number)
    {
       this.alertData = {
                        message: "Ensure the app is launched on device and is in dashboard/main page. Sent message to take payment for " + invoice_number,
                       
                       type:'info'
                    }
        this.alert = true;
        this.show=8;
        this.$schedsdk.sendMsgRefundInvoiceOnDevice({invoice_number: invoice_number})
                .then((result)=>
        {
           // console.log("get_invoice_payment_rec_details -- --- ")
           // console.log(result)
            let data = {}
            
            if(result.status == 1)
            {
                  
                //this.getInvoiceDetail();
            }
            else
            {
                 this.alert = false;
                 this.show = 0;
                 data = {
                        message: "Error sending message for " + invoice_number,
                        type:'danger'
                    }
                this.alertData = data
                this.alert = true;
                this.show=9;
                let confirmed = confirm(result.message);
        
            }

           
        
        })
    
    },
    printInvoiceOnDevice : function(invoice_number)
    {
        this.alertData = {
                        message: "Ensure the app is launched on device and is in dashboard/main page. Sent message to take payment for " + invoice_number,
                       
                       type:'info'
                    }
        this.alert = true;
        this.show=8;
        this.$schedsdk.sendMsgPrintInvoiceOnDevice({invoice_number: invoice_number})
                .then((result)=>
        {
           // console.log("get_invoice_payment_rec_details -- --- ")
           // console.log(result)
            let data = {}
            
            if(result.status == 1)
            {
                  
                //this.getInvoiceDetail();
            }
            else
            {
                 this.alert = false;
                 this.show = 0;
                 data = {
                        message: "Error sending message for " + invoice_number,
                        type:'danger'
                    }
                this.alertData = data
                this.alert = true;
                this.show=9;
                let confirmed = confirm(result.message);
        
            }

           
        
        })
    

    },
    takePaymentOnDevice : function(invoice_number)
    { 
        
        this.alertData = {
                        message: "Ensure the app is launched on device and is in dashboard/main page. Sent message to take payment for " + invoice_number,
                        type:'info'
                    }
        this.alert = true;
        this.show=8;
        this.$schedsdk.sendMsgTakePaymentForInvoiceOnDevice({invoice_number: invoice_number})
                .then((result)=>
        {
           // console.log("get_invoice_payment_rec_details -- --- ")
           // console.log(result)
            let data = {}
            
            if(result.status == 1)
            {
                  
                //this.getInvoiceDetail();
            }
            else
            {
                 this.alert = false;
                 this.show = 0;
                 data = {
                        message: "Error sending message for " + invoice_number,
                        type:'danger'
                    }
                    this.alertData = data
                    this.alert = true;
                    this.show=9;
                    let confirmed = confirm(result.message);
        
            }

           
        
        })
    },
     alertClosedFn() {
        this.show = 0;
    }
  } 
}
</script>
<style scoped>
.panel-heading {
    background:#cfa648;
	color:#fff;
	padding:20px;
}
.totals {
    text-align: right;
}
.customer_detail{
    float:left;
    margin-bottom: 10px;
    margin-top: 20px;
}
.invoice_data{
    padding: 5px;
}
.business_detail{
    float:right;
    margin-bottom: 10px;
    margin-top: 20px;
}
.formatted_data {
    font-size: 17px;
}
.business_logo {
    width:50px;
    margin-left: 30%;
    border-radius: 50%
}
.heading_span{
    color:blue
}

</style>
