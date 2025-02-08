<template>
  <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
            <div class="col-md-4">
                <label class="control-label"><b>Search description</b></label>
                <input 
                v-model="search"
                class="form-control placeholder-no-fix" 
                @keyup="getItemList()"
                type="text" 
                />
            </div>
            <div class="col-md-3" v-if="false">
                    <label class="control-label">
                        <b>Show only unpaid invoices : </b>
                    </label>
                    <input  
                        type="checkbox"
                        class="form-check-input"
                        v-model="show_only_due_gt_0" 
                        @change="getItemList()"
                        />
             </div>
           
        </div> 
    <div>
        <h6>Purchase Orders</h6>
        <div lass="table-responsive">
     <table class="table table-bordered">
          <thead>
              <tr>
                  <th>PO Num.</th>
                  <th>PO Date.</th>
                  <th>Items</th>
                  <th>Value</th>
                  <th>Payment Status</th>
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody  v-if="list.length"> 
              <tr v-for="item in list" :key='item._id'>
                  <td>{{item.order_number}} </td>
                  <td>{{getFormattedDate(item.created_at)}} </td>
                  <td>
                      <table  v-if="item.invoice_info != null && item.invoice_info.length >0" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty.</th>
                                <th>Ext.Price.</th>
                            </tr>
                        </thead>  
                        <tbody>
                         <tr  v-for="packitem in item.invoice_info[0].compact_invoice_detail" 
                                    :key='packitem._id'>
                            <td>{{packitem.in}}</td>
                            <td>{{packitem.iq}}</td>
                            <td> {{currency_symbol}}{{packitem.ep}}</td>
                         </tr>
                        </tbody>
                      </table>
                  </td>
                  <td  v-if="item.invoice_info_summary != null && item.invoice_info_summary.length >0">
                      {{currency_symbol}}{{roundto2digits(item.invoice_info_summary[0].estimated_amount_due)}} 
                  </td>
                  <td  v-else>
                     &nbsp; 
                  </td>
                  <td>
                      {{item.payment_status == 1? "PAID": "NOT PAID"}}
                  </td>
                  <td>
                      <!-- <button class="btn btn-primary btn-sm" @click="$router.push('/invoices/detail/'+ item.invoice_info_summary[0].invnumber)">Invoice</button>
               
                    &nbsp;  -->
                    <!-- Cancel not yet supported (currently does delete)
                         <button class="btn btn-danger btn-sm" @click="cancelPO(item)">Cancel</button>
                     &nbsp; -->
                     <button class="btn btn-primary btn-sm" @click="payPo(item)">Pay</button>
               
                  </td> 
                   
              </tr>
              
          </tbody>
          <tbody v-else> 
                <tr>
                    <td colspan="10" class="text-center">
                        <div class="py-5">
                            <img src="/img/no-result.svg" alt="" class="img-empty"> 
                            <p class="h5 mt-4 d-block fw-normal">
                                No POs Found
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
            :ariaLabel="'Past orders results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

       
      <CModal :visible="show_cart">
          <CModalHeader>
        <CModalTitle>Cart</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <div class="row" >
            <div class="col-md-12">
                <div class="table-responsive">
                    <table class="table table-bordered">
                <thead>
              <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Extended Price</th> 
              </tr>
              </thead>
               
              <tbody  v-if='cart.items.length'> 
              <tr v-for="(item,index) in cart.items" :key='item._id'>
                  <td>{{item.item_name}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price)}} </td>
                  <td>{{item.item_qty}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price*item.item_qty)}} <br>
                    <a href="" @click.prevent="removeItemFromCart(index)">Remove</a></td>
              </tr>
              <tr v-for="item in cart.summary_lines" :key='item._id'>
                  <td>{{item.item_name}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price)}} </td>
                  <td>{{item.item_qty}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price*item.item_qty)}} </td>
                 </tr>
              </tbody>
              <tbody v-else> 
                <tr>
                    <td colspan="10" class="text-center">
                        <div class="py-5">
                            <img src="/img/no-result.svg" alt="" class="img-empty"> 
                            <p class="h5 mt-4 d-block fw-normal">
                                No Packages Found
                            </p>
                        </div>
                    </td>
                </tr>
              </tbody>
            </table>
                </div>
            </div>
         </div>
         <br>
        <div class="row">
             <div class="col-md-12" color="danger">
            
               
                      <label class="control-label">
                         <b>Auto purchase when credits are less than 2? </b>&nbsp; 
                     </label>
                      <input  
                        type="checkbox"
                        v-model="auto_recharge_agree"  
                        /> 
            </div>
         </div>
         <br>
         <div class="row">
             <div class="col-md-12" color="danger">
               <b> {{error_message}}</b>
            </div>
         </div>

</CModalBody>
        <CModalFooter>
            <CButton @click="continueToOneOffPurchase()" color="success" >Continue to Payment</CButton>
            <CButton @click="show_cart = false" color="danger">Cancel</CButton>
        </CModalFooter>
        </CModal>
        <CModal :visible="showDone">
            <CModalHeader>
        <CModalTitle>Done</CModalTitle>
    </CModalHeader>
    <CModalBody>
            <div class="row">
                <div class="col-md-8">
                    {{done_response}}
                </div>
            
            </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeShowdone" color="info">Ok</CButton>
            </CModalFooter>
        </CModal>
    </div>
 </div>
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment'
export default {
  name: 'PastOrders',
  components: { Pagination },
  computed: {
      
  },  
  data (){
      return({
        search:'',
        list:[],
        packages: [],
        csv_data:[],
        cart:  {items : [], summary_lines: []},
        page:1,
        pageCount:1,
        show_cart: false,
        auto_recharge_agree: false,
        closeShowdone: false,
        error_message: "",
        showDone: false,
        done_response : "",
        show_only_due_gt_0: false,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol
      })
  },
  created(){
      this.getItemList();
      
  },

  methods:{
    getItemList() {
      let customer_id = ''
      if(this.$route.params.customer_id)
      {
        customer_id = this.$route.params.customer_id;
      }
      
    
    
      this.$schedsdk.get_purchase_orders({
                search:this.search,
                page_no:this.page,
                customer_id:customer_id, 
                 }).then((result)=>
      {
            this.list = result.data
            this.packages = this.list.packages
            this.pageCount = result.total_pages
      })

 
    },
     
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.getItemList();
    },
    calculateCartSummary: function ()
    {
        this.cart.summary_lines = [];

        let total = 0.0;
        this.cart.items.forEach(item => {
                //console.log(pay)
                
                total += (item.applied_unit_price * item.item_qty)

                
            });
        let invoice_line= {};
        invoice_line.applied_unit_price = total;
        invoice_line.applied_per_unit_store_discount = 0.0;
        invoice_line.applied_per_unit_store_surcharge = 0.0;
        invoice_line.item_code = "TOTAL";
        invoice_line.item_name = "Total";
        invoice_line.item_qty = 1;
        invoice_line.item_type = 'A'; //'SVC' , 'PROD'
        invoice_line.purchased_package_id =  null;
        
        this.cart.summary_lines.push(invoice_line)

    },
    removeItemFromCart: function (index)
    {
        
         if (index>-1)
         {
            this.cart.items.splice(index, 1)
         }
         this.calculateCartSummary();
    },
    addPackageItemToCart: function (item)
    {
        
        let invoice_line= {};
        invoice_line.applied_unit_price = item.package_purchase_price;
        invoice_line.applied_per_unit_store_discount = 0.0;
        invoice_line.applied_per_unit_store_surcharge = 0.0;
        invoice_line.item_code = item.package_code;
        invoice_line.item_name = item.package_name;
        invoice_line.item_qty = 1;
        invoice_line.item_type = 'PKG'; //'SVC' , 'PROD'
        invoice_line.package_id = item._id || null;
        
        this.cart.items.push(invoice_line)
        this.calculateCartSummary();
    },
    continueToOneOffPurchase()
    {
        
         this.$schedsdk.make_standalonepurchase_cart({
                cart: this.cart, 
                 }).then((result)=>
      {
           if(result.status == 0)
           {
               this.error_message = "Error: " + result.message
           }
           else
           {
               console.log(result)
               this.show_cart = false;
           }
      })
      
    },
    purchaseItem: function (item) 
    {
       this.addPackageItemToCart(item);
       this.show_cart = true;
    },
    getFormattedDate: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY hh:mm a");//"MMM DD, YYYY hh:mm a"
    },
    roundto2digits: function (n) {
       //Round half away from zero
        var e = Number.EPSILON * n * 100;
        return Math.round((n * 100)+e) / 100;
    },
    cancelPO: function (item) {
        let c = confirm("Cancel PO: " + item._id + " ? ");
        if (!c)
        {
            return;
        }
        this.$schedsdk.cancel_purchase_orders({
                purchase_order_id:item._id
                 }).then((result)=>
      {
            this.getItemList()
      })

    },
    payPo: function(item)
    {
        console.log(item.manage_booking_key)
        let url =  this.$store.state.skysched_global_api_base_url +
                      "extpages/online_booking_payment/" +
                      item.manage_booking_key +
                      "?show_page_header=0&show_page_footer=0"
        this.$router.push({ name: 'Pay Purchase Order' ,
                            params: {po_access_url: encodeURI(url)} 
                                  }) ;
          
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
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
</style>