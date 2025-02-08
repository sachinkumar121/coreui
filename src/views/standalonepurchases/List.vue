<template>
  <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text" data-v-06c6e52f="">Filter Options</div>
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
             <div class="col-md-12 mt-3">
                <label class="control-label mb-0"><b>Information:</b></label>
                    <span>Buy these items to use along with your subscription to this app. 
                        These are sold by {{getAppName()}} to {{this.$store.state.business_settings.business_info.business_name}}</span>
             </div>
           
        </div> 
    <div >
        <h6>Bundles</h6>
        <div class="table-responsive">
     <table class="table table-bordered">
          <thead>
              <tr>
                  <th>Bundle Name</th>
                  <th>Items</th>
                  <th>Price</th>
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody  v-if='packages.length'> 
              <tr v-for="item in packages" :key='item._id'>
                  <td>{{item.package_name}} <br>
                    <span v-if="item.package_description!=null && item.package_description.length>2">
                        Description: <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover=" {
                        header: 'Description',
                        trigger: 'click',  
                        content: item.package_description,
                        }"/>
                    </span>
                 </td>
                  <td>
                      <table class="table table-bordered mb-0">
                        <thead>
                            <tr>
                                <th width="50%">Item</th>
                                <th width="50%">Qty.</th>
                            </tr>
                        </thead>   
                        <tbody>
                             <tr v-for="packitem in item.package_items" :key='packitem._id'>
                            <td>{{packitem.copied_item_name}}</td>
                            <td>{{packitem.qty_allowed_in_package}}</td>
                         </tr>
                        </tbody>
                      </table>
                  </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.package_purchase_price)}} </td>
                  
                  <td>
                    <button class="btn btn-primary btn-sm" 
                        @click="purchaseItem(item)">Purchase</button>
                    &nbsp; 
                  </td> 
                   
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
      <Pagination class="mt-2"
            v-if="packages.length"
            :size="'sm'"
            :ariaLabel="'Packages results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

       
      <CModal :visible="show_cart">
          <CModalHeader>
        <CModalTitle>Cart</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <div class="row">
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
             <div class="col-md-6 col-xl-3" color="danger">
                      <label class="control-label">
                         <b>Select a card to pay with: </b>&nbsp; 
                     </label>
                     
            </div>
            <div class="col-md-6" color="danger" v-if="cards_on_file_list.length">
                      
                       <select 
                              class="form-control" 
                              v-model="selected_card_id">
                              <option v-for="opt in cards_on_file_list" 
                              v-bind:key="opt._id"
                              :selected="opt._id == selected_card_id ? true : false" :value="opt._id">
                               {{opt.nick_name + " " + opt.last4}}</option>
                        </select>
            </div>
            <div class="col-md-6"   v-else>
                No saved cards. You can save a card at checkout
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
            <CButton @click="show_cart = false" color="danger">Cancel</CButton>
            <CButton :disabled = "checkout_btn_disabled" @click="continueToCheckout()" color="success" >{{checkout_text}}</CButton>
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
  name: 'List',
  components: { Pagination },
  data (){
      return({
        search:'',
        checkout_text: 'Checkout',
        list:[],
        cards_on_file_list :[],
        selected_card_id: '',
        packages: [],
        csv_data:[],
        cart:  {items : [], summary_lines: [], needs_auto_purchase_agreement: false},
        page:1,
        pageCount:1,
        show_cart: false,
        auto_recharge_agree: false,
        closeShowdone: false,
        error_message: "",
        showDone: false,
        done_response : "",
        show_only_due_gt_0: false,
        checkout_btn_disabled: false,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol
      })
  },
  created(){
      this.getItemList();
      this.getCardsOnFile();
  },
  methods:{
    getCardsOnFile()
    {
            this.$schedsdk.get_standalonepurchase_cards_on_file({}).then((result)=>
            {
                if(result.status ==1)
                {
                    this.cards_on_file_list = result.data
                }
                
               
            })
    },
    getItemList() {
      let customer_id = ''
      if(this.$route.params.customer_id)
      {
        customer_id = this.$route.params.customer_id;
      }
      
    
    
      this.$schedsdk.get_standalonepurchase_list({
                search:this.search,
                page_no:this.page,
                customer_id:customer_id, 
                 }).then((result)=>
      {
            this.list = result.data
            this.packages = this.list.packages
            this.pageCount = result.total_pages
      })


      this.$schedsdk.get_purchase_orders({
                 
                 }).then((result)=>
      {
            console.log("DONE GET pos ")
      })
    },
     
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.getItemList();
    },
    getAppName()
    {
        return import.meta.env.VITE_NAME
    },
    calculateCartSummary: function ()
    {
        this.cart.summary_lines = [];

        let total = 0.0;
        let needs_apa = false; //auto purch
        this.cart.items.forEach(item => {
                //console.log(pay)
                //console.log(item)
                total += (item.applied_unit_price * item.item_qty)
                if(item.item_needs_auto_purch_agreement)
                {
                    needs_apa = true
                }
                
            });
        let invoice_line= {};
        invoice_line.applied_unit_price = total;
        invoice_line.applied_per_unit_store_discount = 0.0;
        invoice_line.applied_per_unit_store_surcharge = 0.0;
        invoice_line.item_code = "TOTAL";
        invoice_line.item_name = "Estimated Total";
        invoice_line.item_qty = 1;
        invoice_line.item_type = 'A'; //'SVC' , 'PROD'
        invoice_line.purchased_package_id =  null;
        
        this.cart.summary_lines.push(invoice_line)
        this.cart.needs_apa = needs_apa;
        //console.log("needs apassssss");
        //console.log(this.cart.needs_apa)
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
        invoice_line.item_id = item._id || null;
        invoice_line.item_needs_auto_purch_agreement = item.must_sell_as_recurring_package
        this.cart.items.push(invoice_line)
        this.calculateCartSummary();
    },
    continueToCheckout()
    {
        this.error_message =""
        this.cart.auto_recharge_agree = this.auto_recharge_agree != false? true : false
        if (this.cart.needs_apa == true && this.cart.auto_recharge_agree == false)
        {
            this.error_message = "Error: One or more items need you to agree to auto purchase" 
            return;
        }
         this.checkout_text = "Processing..."
         this.checkout_btn_disabled = true
         this.cart.card_on_file_id_to_use = this.selected_card_id
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
               console.log( encodeURI(result.data.po_access_link))
               this.$router.push({name: 'Pay Purchase Order', 
                                  params: {
                                    po_access_url: encodeURI(result.data.po_access_link+"?show_page_header=0&show_page_footer=0")} 
                                  });
       
           }
           
      }).finally(() => {this.checkout_text = "Checkout",  this.checkout_btn_disabled = false})
      
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