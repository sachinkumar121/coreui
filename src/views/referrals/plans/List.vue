<template>
  <div>
    <CRow>
      <CCol sm="12">
        <div class="text-right">
          <button class="btn btn-success" @click="$router.push('/referrals/plans/add')"> Add New Plan </button>
        </div>
        <br>
        <div class="col-md-4">
            <div class="form-group" >
                    <label class="control-label"><b>Search</b></label>
                    <input 
                    v-model="search"
                    class="form-control placeholder-no-fix" 
                    @keyup="getPlansList()"
                    type="text" 
                    />
                </div>
            </div>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  <th>Id</th>
                  <th>Payout</th>
                  <th>Active</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody>
              <tr v-if="list.length">
                <template v-for="(item, index) in list" :key="index">
                  <td>{{item.plan_name}} </td>
                  <td>{{item.plan_id}} </td>
                  <td>{{item.payout}} </td>
                  <td v-if="item.is_active"> Yes </td>
                  <td v-else> No </td>
                  <td>
                    <button class="btn btn-primary btn-sm" @click="$router.push('/referrals/plans/detail/'+ item._id)">Detail</button>
                    <!-- <a :href="'/referrals/plans/detail/' + item._id"> Detail </a> -->
                  </td>
                </template>
              </tr>
              <tr v-else><td colspan="10" class="text-center">No Booking Exists</td></tr>
          </tbody>
      </table>
      <Pagination class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Referrals plans results pages'"
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
export default {
  name: 'List',
  components: { Pagination },
  data (){
      return({list:[],
      page:1,
      search:'',
      pageCount:1,
      timezone:this.$store.state.business_settings.business_time_zone
      })
  },
  created(){
      this.getPlansList();
  },
  methods:{
      getPlansList() {
        this.$schedsdk.get_referral_plans_list({search:this.search,page:this.page}).then((result)=>{
          if(result.status == 1){
            this.list = result.data
            this.pageCount = result.total_pages
          }
        })
    },
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.getBookingsList();
    }
  }
    
}
</script>
