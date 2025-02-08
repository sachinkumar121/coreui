<template>
  <div class="pt-2">
    <CRow>
      <CCol sm="12">
        <div class="text-right">
          <button class="btn btn-success" @click="$router.push('/coupons/add')"> Add New Coupon </button>
        </div>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Expires</th>
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody  v-if="list.length">
              <tr v-for="(item, index) in list" :key="index">
                  <td>{{item.coupon_name}} </td>
                  <td>{{item.coupon_code}} </td>
                  <td>{{item.description}} </td>
                  <td> {{item.discount_type==2?currency_symbol:""}} {{item.amount}} {{item.discount_type==1? "%" : ""}}</td>
                  <td>{{getFormattedDate(item.valid_till)}} </td>
                 
                  <td>
                    <button type="button" 
                         @click="$router.push('/coupons/detail/' + item._id)" 
                         class="btn btn-primary btn-sm" >view/Edit</button> &nbsp;
                    <button type="button" 
                         @click="deleteCoupon(item)" 
                         class="btn btn-danger btn-sm" >Delete</button>
                  </td> 
              </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="text-center">
                <div class="py-5">
                  <img src="/img/no-result.svg" alt="" class="img-empty"> 
                  <p class="h5 mt-4 d-block fw-normal">
                    No Coupons Found
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
      </table>
        <Pagination class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Coupon results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
    </CCol>
    </CRow>
  </div>
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment'
export default {
  name: 'List',
  components: { Pagination },
  data (){
      return({list:[],
      page:1,
      pageCount:1,
      currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        
      })
  },
  created(){
      this.getFullCouponsList();
  },
  methods:{
      getFormattedDate: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format("MMM DD, YYYY");//"MMM DD, YYYY hh:mm a"
    },
      getFullCouponsList() {
        this.$schedsdk.getCouponsList({page_no:this.page}).then((result)=>{
          if(result.status == 1){
            this.list = result.data
            this.pageCount = result.total_pages
          }
        })
    },
    deleteCoupon(item)
    {
        //console.log(item)
        let c = confirm("Are you sure to delete " + item.coupon_name +" ?");
        if(!c)
        {
            //console("EARLY RETURN============")
            return;
        }
        
        let that = this
        this.$schedsdk.deleteCoupon({_id:item._id}).then((result)=>{
            if(result.status ==1)
            {
              that.getFullCouponsList();   
            }
        })
    },
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.getFullCouponsList();
    }
  }
    
}
</script>
