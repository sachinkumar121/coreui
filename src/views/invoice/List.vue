<template>
  <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
            <div class="col-md-4">
                <label class="control-label"><b>Search First Name/Invoice Number</b></label>
                <input 
                v-model="search"
                class="form-control placeholder-no-fix" 
                @keyup="getInvoiceList()"
                type="text" 
                />
            </div>
            <div class="col-md-4">
                    <input  
                        type="checkbox" class="form-check-input"
                        v-model="show_only_due_gt_0" 
                        @change="getInvoiceList()"
                        /> &nbsp;
                    <label class="control-label">
                        <b>Show only unpaid invoices </b> 
                    </label>
                    
                    <br>
                    <input  
                        type="checkbox"
                        class="form-check-input"
                        v-model="show_non_card_invoices" 
                        @change="getInvoiceList()"
                        /> &nbsp;
                      <label class="control-label">
                        <b>Show non-card invoices </b> 
                    </label>
                    
                    <br>
                    <input  
                        type="checkbox"
                        class="form-check-input"
                        v-model="show_only_invoice_with_refunds" 
                        @change="getInvoiceList()"
                        />  &nbsp;
                      <label class="control-label">
                        <b>Show only invoices with refunds: </b> 
                    </label>
                    

             </div>
            <div class="col-md-4 text-right d-flex align-items-center justify-content-end">
                    <download-csv class="csv-btn btn btn-primary float-end"
                            v-if="csv_data.length"
                            :data   = csv_data 
                            ref="csv_ref"> Download Data
                        </download-csv>
            </div>
        </div> 
    <div class="row">
        <div class="col-md-2">
            <label class="control-label"><b>Searching...</b></label>
        </div>
    </div>
    <div class="table-responsive">
     <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <th>Invoice No</th>
                  <th>Invoice Amt.</th>
                  <th>Paid Amt.</th>
                  <th>Balance Amt.</th>
                  <th>Due Date</th>
                  <th>Customer</th>
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody  v-if="list.length"> 
              <tr v-for="item in list" :key='item._id'>
                  <td>{{item.invoice_number}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.estimated_amount_total)}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.final_paid_amount)}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.estimated_amount_due)}} </td>
                  <td>{{getFormattedDate(item.due_date) }}</td>
                  <td>{{item.customer_data.first_name}} {{item.customer_data.last_name}}</td>
                  <td>
                    <button class="btn btn-primary btn-sm mb-1" @click="$router.push('/invoices/detail/'+ item.invoice_number)">View Invoice</button>
                    &nbsp; 
                    <button v-if="item.single_source_order_type != 'p' && item.single_source_order_id !== undefined && item.single_source_order_id !== ''" 
                      class="btn btn-info btn-sm mb-1" @click="$router.push('/bookings/detail/'+ item.single_source_order_id)">View Order</button>
                   
                   <button v-if="item.single_source_order_type == 'p' && item.single_source_order_id !== undefined && item.single_source_order_id !== ''" 
                      class="btn btn-info btn-sm mb-1" @click="$router.push('/invoices/detail/'+ item.invoice_number)">View Order</button>
                  
                  </td> 
                   
              </tr>
              
          </tbody>
          <tbody v-else> 
                <tr>
                  <td colspan="10" class="text-center">
                    <div class="py-5">
                      <img src="/img/no-result.svg" alt="" class="img-empty"> 
                      <p class="h5 mt-4 d-block fw-normal">
                        No Invoice Exists
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
            :ariaLabel="'Invoice results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

 </div>
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment'
import JsonCSV from 'vue-json-csv';

export default {
  name: 'List',
  components: { Pagination, "download-csv": JsonCSV },
  data (){
      return({
        search:'',
        list:[],
        csv_data:[],
        page:1,
        pageCount:1,
        show_only_due_gt_0: false,
        show_non_card_invoices: false,
        show_only_invoice_with_refunds: false,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol
      })
  },
  created(){
      this.getInvoiceList();
      this.getInvoiceCSV();
  },
  methods:{
    getInvoiceList() {
      let customer_id = ''
      if(this.$route.params.customer_id)
      {
        customer_id = this.$route.params.customer_id;
      }
      
    
      this.$schedsdk.get_invoices_list({search:this.search,
                                        page_no:this.page,
                                        customer_id:customer_id, 
                                        show_only_due_gt_0: this.show_only_due_gt_0,
                                        show_non_card_invoices: this.show_non_card_invoices,
                                        show_only_invoice_with_refunds: this.show_only_invoice_with_refunds
                                        }).then((result)=>{
        this.list = result.data
        this.pageCount = result.total_pages
      })
    },
    getInvoiceCSV() {
      this.$schedsdk.get_invoice_csv_data().then((result)=>{
        for(let i=0;i<result.data.length;i++){
          this.csv_data.push({
            invoice_no:result.data[i].invoice_number,
            paid_amount:this.roundto2digits(result.data[i].final_paid_amount),
            due_amount:this.roundto2digits(result.data[i].estimated_amount_due),
            due_date:this.getFormattedDate(result.data[i].due_date),
            customer_name:result.data[i].customer_data.first_name +' '+ result.data[i].customer_data.last_name
          })  
        }
      })
    },
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.getInvoiceList();
    },
    getFormattedDate: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY hh:mm a");//"MMM DD, YYYY hh:mm a"
    }
    ,
    roundto2digits: function (n) {
       //Round half away from zero
        var e = Number.EPSILON * n * 100;
        return Math.round((n * 100)+e) / 100;
    }
  }
    
}
</script>

<style scoped>
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: var(--background-color-primary);
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
    width: auto !important;
}
</style>