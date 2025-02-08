<template>
<div class="table-invoice-body">
   <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <CRow class="gx-0">
            <CCol class="mb-2">
                <table class="w-100 table-top-invoice">
                    <tbody>
                    <tr>
                        <td>
                            <div class="d-flex">
                                <div class="business-img" v-if="business_data.large_logo_url && business_data.large_logo_url.length">
                                    <img :src="business_data.large_logo_url" alt="">
                                </div>
                                <div class="ms-2">
                                    <p class="mb-0"><b>{{business_data.business_name}}</b></p>
                                    <p class="mb-0">{{business_data.business_email}}</p>
                                    <p class="mb-0"> {{getPhoneFormat(business_data.business_phone)}}</p>
                                </div>
                            </div>
                        </td>
                        <td class="text-end">
                            <p class="mb-0">{{business_data.address_line1}} {{business_data.address_line2}},</p>
                            <p class="mb-0">{{business_data.city}}, {{business_data.state}} {{business_data.zipcode}}</p>
                            <p class="mb-0"></p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>
        <CRow class="gx-0">
            <CCol class="gray-section mb-3">
                <table class="w-100">
                    <tbody>
                        <tr>
                            <td width="75%">
                                <p class="mb-0"><b>Invoice To:</b></p>
                                <p class="mb-0">{{customer_data.first_name}} {{customer_data.last_name}}</p>
                                <p class="mb-0">{{formatAddress(customer_data)}}</p>
                                <p class="mb-0">{{getPhoneFormat(customer_data.phone)}}</p>   
                                <p class="mb-0">{{customer_data.email}}</p>
                            </td> 
                            <td width="25%" class="text-end">
                                <p class="mb-0"><b>Invoice No.: {{inv_det.invoice_number}}</b></p>
                                <p class="mb-0">Due date: {{getFormattedDate(inv_det.due_date)}}</p>
                                <p class="mb-0">Created date: {{getFormattedDate(inv_det.created_at)}}</p>
                                <p class="mb-0">PO:
                                    <a href="javascript:void(0)"  @click.prevent="openPOLink(inv_det.single_source_order_id, inv_det.single_source_order_type)">
                                    <u>
                                        {{getPODisplayString(inv_det.single_source_order_id, inv_det.single_source_order_type)}}</u>
                                    </a>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>
        <CRow class="gx-0">
            <CCol>
                <div class="table-responsive">
                <table bordered class="table table-bordered table-custom table-invoice">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody >
                        <template v-if='invoice_for_display.length'>
                            <tr v-for="(iline, index) in invoice_for_display" 
                                :key="index">
                                <template 
                                    v-if="!expand_discounts_redemptions || (!iline.itemized_breakdown||!iline.itemized_breakdown.length)"
                                    :key="expand_discounts_redemptions">
                                    <td>{{ iline.item_name }}</td> 
                                    <td>{{ iline.item_qty }}</td> 
                                    <td>{{business_currency_symbol}} {{ roundto2digits(iline.extended_price) }}</td> 
                                </template>
                                <template v-else :key="!expand_discounts_redemptions">
                                    <td>{{ iline.item_name }}<br>
                                        <table align="right">
                                        <tr v-for="(ibreakdown, indexbrd) in iline.itemized_breakdown"  :key="indexbrd">
                                            <td>{{ ibreakdown.target_name }}</td> 
                                            <td>{{business_currency_symbol}}{{ ibreakdown.amount_applied }}</td> 
                                        </tr>
                                       </table>
                                    </td> 
                                    <td>{{ iline.item_qty }}</td> 
                                    <td>{{business_currency_symbol}} {{ roundto2digits(iline.extended_price) }}</td> 
                                </template>
                                
                                 
                                   
                                
                            </tr>

                        </template>
                        <tr> 
                            <td colspan="2" class="totals pe-3">Total</td> 
                            <td class="text-end">{{business_currency_symbol}} {{roundto2digits(amounts.invoice_total)}}</td> 
                        </tr>       
                        <tr> 
                            <td colspan="2" class="totals pe-3">Paid</td> 
                            <td class="text-end">{{business_currency_symbol}} {{roundto2digits(amounts.invoice_paid_amount)}}</td> 
                        </tr>       
                        <tr> 
                            <td colspan="2" class="totals pe-3">Due</td> 
                            <td class="text-end">{{business_currency_symbol}} {{roundto2digits(amounts.invoice_amount_due)}}</td> 
                        </tr> 
                    </tbody>
                </table>
                </div>
            </CCol>
        </CRow>
        <CRow class="gx-0 print-d-none">
            <CCol sm="12" md="6" lg="6">
                <CAccordion flush class="custom-accordian mb-2 mb-lg-0">
                    <CAccordionItem>
                        <CAccordionHeader>
                        Payment Operations
                        </CAccordionHeader>
                        <CAccordionBody class="">
                        <div class="">
                            
                            <button v-if="!isCustomerUserType" 
                                    class="btn btn-success me-2 mb-2" @click="takePaymentOnDevice( inv_det.invoice_number)">
                            <Icon  v-if="!isCustomerUserType"  
                                    icon="tabler:device-tablet" :height="19"></Icon> 

                                Take Payment on Device</button>
                            <button class="btn btn-success mb-2"  
                                @click="payByCardOnFile(inv_det.single_source_order_type, inv_det.single_source_order_id, inv_det.invoice_number)"><Icon 
                                    icon="tabler:credit-card" :height="19"></Icon> 
                                    Pay by Card on File</button>
                        </div>
                        <div class="" v-if="!isCustomerUserType">
                            <button class="btn btn-dark-new me-2 mb-2" @click="removeCancellationCharges(inv_det.single_source_order_id, inv_det.invoice_number)"><Icon icon="tabler:notes-off" :height="19"></Icon> Remove Cancellation Charges</button>
                            <button class="btn btn-dark-new mb-2" @click="refundOnDevice( inv_det.invoice_number)"><Icon icon="tabler:receipt-refund" :height="19"></Icon> Refund on Device</button>
                        </div>
                        <div >
                            <button class="btn btn-primary-new"  
                    @click="settleReleasePayments(inv_det.single_source_order_id, inv_det.invoice_number)" v-if="amounts.invoice_paid_amount>amounts.invoice_total"> 
                     Settle/Release Excess Payment of {{business_currency_symbol}}{{getExcessPayment(amounts)}}</button>
                        </div> 
                        </CAccordionBody>
                    </CAccordionItem>
                </CAccordion>
            </CCol>
            <CCol md="12" lg="6">
                <div class="d-md-flex justify-content-lg-end">
                       
                    <button class="btn btn-primary-new me-2 mb-2 mb-md-0" 
                            @click="expandDiscountsRedemptions()">
                        <Icon icon="tabler:circle-plus" :height="20" ></Icon>{{expand_discounts_redemptions?"Hide":"Show"}} Disc. &amp; Redeems.</button>
                    
                    <button class="btn btn-primary-new me-2 mb-2 mb-md-0" @click="showEmailInvoice = true"><Icon icon="tabler:mail" :height="19"></Icon> Email Invoice</button>
                    <button  v-if="!isCustomerUserType"  class="btn btn-primary-new mb-2 mb-md-0" @click="printInvoiceOnDevice( inv_det.invoice_number)"><Icon icon="tabler:printer" :height="19"></Icon> Print on Payment Device</button>
                    
                </div>
            </CCol>
        </CRow>
        <CRow class="gx-0  print-d-none">
            <CCol>
                <hr />
            </CCol>
        </CRow>
        <CRow class="gx-0 mt-1" :class="{'print-d-none': !showInPrint}">
            <!-- {{showInPrint}} -->
            <CCol>
                <div class="formatted_data">
                    <b>Payment Records</b>
                </div>
                <div class="table-responsive">
                    <table bordered class="table table-bordered table-custom">
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Card Source</th>
                                <th>Operation</th> 
                                <th>Payment Date</th> 
                                <th>Transaction Number</th> 
                                <th>Amount</th> 
                                <th class="print-d-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-if='payments.length'>
                            <tr v-for="(pline, index) in payments" :key="index">
                                <td v-if="pline.payment_txn_type == 0">Card</td> 
                                <td v-else-if="pline.payment_txn_type == 1">Cash</td> 
                                <td v-else-if="pline.payment_txn_type == 2">Check</td> 
                                <td v-else>Other</td> 
                                
                                <td>{{ pline.payment_funding_method_short.replace("PT_CARDBRAND_", "") || "" }}</td> 
                                <td>{{ pline.payment_txn_operation.replace("PT_TT_", "") }}</td> 
                                <td>{{getFormattedDateTime(pline.applied_payment_date)}}</td> 
                                <td>{{ pline.payment_txn_number }}</td> 
                                <td>{{business_currency_symbol}} {{ pline.applied_payment_value }}</td> 
                                <td class="print-d-none">
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
                            </tr>  

                            <tr> 
                                <td colspan="5" class="totals pe-3">Total</td> 
                                <td>{{business_currency_symbol}} {{total_paid_amount}}</td> 
                                <td class="print-d-none"></td>  
                            </tr> 
                        </tbody>
                         <tbody v-else>
                            <tr>
                                <td colspan="7">
                                    <div class="py-5 text-center">
                                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                        <p class="h5 mt-4 d-block fw-normal">
                                            No payments found
                                        </p>
                                    </div>
                                </td>
                            </tr>
                         </tbody>
                    </table>
                </div>
                <div class="print-d-none text-theme">
                    <CCol><CFormCheck v-model="showInPrint" label="Include payment record in Print/PDF" /></CCol>
                </div>
            </CCol>
        </CRow>

        <CRow class="gx-0 mt-1">
            <CCol>
                <CCol><CFormCheck v-model="show_invoice_audit_log" label="Show Invoice Audit Log" /></CCol>
                <div v-if="show_invoice_audit_log">
                    <!-- Table will be here. -->
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Message</th>
                                <th>Operation</th>
                                <th>Event time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="invoice_audit_logs.length > 0">
                                <tr v-for="(item, index) in invoice_audit_logs" :key="index">
                                    <td>{{ item.log_message }}</td>
                                    <td>{{ item.object_operation }}</td>
                                    <td>{{ getFormattedDateTime(item.created_at) }}</td>
                                </tr>
                            </template>
                            <tr v-else><td colspan="3" class="text-center">No data found.</td></tr>
                        </tbody>
                    </table>
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
    <EmailInvoiceModal
        :user_data="customer_data"
        :invoice_data="send_email_inv_data"
        :visible="showEmailInvoice"
        @close="showEmailInvoice = false"
        @success="onEmailSentSuccess"
        @error="onEmailSentFail"
    />
  </div>
  
</template>

<script>
import moment from 'moment'
import Alerts from '../Alerts'
import PaymentByCof from './PaymentByCof.vue'
import EmailInvoiceModal from './EmailInvoiceModal.vue'
import utils_lib from '../../helpers/utils_lib';
import payterm_helper from '../../helpers/payterm_helper';
import { Icon } from '@/common/Icon';
import { USR_TYPE } from '@silverskysoft/skysched-schemas'
import {Payterm} from '@silverskysoft/capacitorpayterm';

export default {
    name: 'DetailInvoice',
    components: { Alerts, PaymentByCof, Icon, EmailInvoiceModal },
     data() {
      return { 
        inv_det:{},
        amounts:{},
        customer_data:{},
        business_data:{},
        invoice_for_display:[],
        payments:[],
        business_currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        country_code: this.$store.state.business_settings.business_info.country_code,
          
        total_paid_amount:0,
        showPaymentDetails: false,
        payment_data: {},
        alert:false,
        showInPrint: false,
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
        cof_invoice_number: "",
        showEmailInvoice: false,
        send_email_inv_data: {},
        show_invoice_audit_log: false,
        invoice_audit_logs: [],
        user_type: this.$store.state.user_data.type,
        expand_discounts_redemptions: false
      }
    },
    created(){
        this.getInvoiceDetail();
    },
    computed: {
        user_name() {
            return this.$store.state.user_data.first_name + ' ' + this.$store.state.user_data.last_name;
        },
        isCustomerUserType(){
            return this.user_type == USR_TYPE.UT_CUSTOMER
        }
    },
    watch: {
        async show_invoice_audit_log(val) {
            if (val) {
                await this.getInvoiceAuditLogs();
            }
        }
    },
    methods: {
        expandDiscountsRedemptions()
        {
            this.expand_discounts_redemptions = !this.expand_discounts_redemptions
        },
        async getInvoiceAuditLogs() {
            try {
                const audit_logs_res = await this.$schedsdk.get_invoices_audit_logs({
                    _id: this.inv_det._id
                });
                this.invoice_audit_logs = audit_logs_res.data;
            } catch (error) {
                console.log(error);
            }
        },
        onEmailSentSuccess(message) {
            console.log(message)
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
        roundto2digits: function (n) {
       //Round half away from zero
        var e = Number.EPSILON * n * 100;
        return (Math.round((n * 100)+e) / 100).toLocaleString("en", {useGrouping: false, minimumFractionDigits: 2});

 
    },
        getPhoneFormat(ph)
        {
           let v =  utils_lib.clean_phone(ph, this.country_code)
           //console.log("Asdasd", v,  this.country_code, this.$store.state.business_settings.business_info)
           if(v == null)
           {
            return ph;
           }
           return v;
        },
        openPOLink(order_id, order_type)
        {
            if(!order_id)
            {
                return;
            }
            if(order_type == 'p')
            {
               //TODO
               this.$router.push('/purchase_order/detail/'+ order_id)
            }
            else
            {
                this.$router.push('/bookings/detail/'+ order_id)
            }
        },
        getPODisplayString(order_id, order_type)
        {
            if(!order_id)
            {
                return "";
            }
            //
            let v = "Booking: "
            if(order_type == 'p')
            {
                v = "Purchase: ";
            }
            v += order_id.slice(-6) 
            return v;
        },
        formatAddress(customer_data) {
            let address = {
                "address1" : customer_data.address1, 
                "address2" : customer_data.address2, 
                "city" : customer_data.city, 
                "state" : customer_data.state, 
                "postcode" : customer_data.postcode, 
                "country" : customer_data.country
            }
            let addressArray = Object.values(address).filter(a => a);
            return addressArray.length ? addressArray.join(', ') : null
        },
        getInvoiceDetail() {
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
                    this.send_email_inv_data = {
                        invoice_id: this.inv_det._id,
                        invoice_number: this.inv_det.invoice_number,
                        purchase_order_id: this.inv_det.single_source_order_id,
                        purchase_order_type: this.inv_det.single_source_order_type
                    }
                    console.log("Adasd- ", this.send_email_inv_data)
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
        takePaymentV2(invoice_number)
        {
            let cart = payterm_helper.getPaytermCart();
            Payterm.echo({invoice_number: invoice_number})
        },
        alertClosedFn() {
            this.show = 0;
        }
    } 
}
</script>
<style scoped lang="scss">
    .accordion-item {
        background-color: transparent;
    }
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
    // 
    .mx-n-15 {
        margin-right: -12px;
        margin-left: -15px;
    }
    .print-img {
        display: none;
    }
    .business-img {
        background-color: #c3c3c3;
        width: 60px;
        min-height: 50px;
        max-height: 56px;
        display: flex;
        padding: 0 5px;
         -webkit-print-color-adjust: exact; 
             flex-flow: inherit;
        align-items: center;
        img {
            width: 100%;
        }
    }
    .gray-section {
        border-radius: 5px;
        background-color: var(--background-gray-section);
        -webkit-print-color-adjust: exact; 
        padding: 10px;
        td {
            vertical-align: top;
        }
    }
    .table-invoice{
        th, td {
            &:nth-child(2) {
                text-align: center;
            }
            &:nth-child(3) {
                text-align: right;
            }
        }
    }
    .btn {
        &.btn-sm {
            padding: 0.34rem 0.5rem 0.2rem 0.5rem;
        }
    }
    
    @media print {
       .sidebar-outer + .section-right, .section-right ,
       .sidebar-outer.sidebar-collapse + .section-right  {
            padding-left: 0;
        }
        .gray-section {
            border-radius: 5px;
            background-color: #EBEBEB !important;
            -webkit-print-color-adjust: exact; 
        }
       
        .print-img {
            display: block;
            width: 200px;
        }
        .mb-3, .mb-2 {
            margin-bottom:5px !important;
        }
        .table-custom {
            padding: 0.2rem 0.4rem;
            td, th {
                font-size: 13px;
                padding: 0.2rem 0.4rem;
            }
        }
        table {
            td, th {
                color: #000;
            }
            p {
                font-size: 13px;
            }
        }
    }
    @media (max-width: 480px) {
        .table-invoice-body {
            table:not(.table-custom) {
                td, tr {
                    display: block;
                    text-align: left !important;
                }
                td {
                    margin-bottom: 8px;
                }
            }
        }
        .gray-section {
            td {
                width: 100%;
            }
        }
        
    }
</style>
