<template>
  <div class="pt-2">
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <FilterSection>
          <template v-slot:search-input>
            <div class="form-group">
              <label class="control-label"><b>Search</b></label>
              <input 
              v-model="search"
              class="form-control placeholder-no-fix" 
              @keyup="getReferralsList()"
              type="text" 
              />
            </div>
          </template>
          <template v-slot:actions>
            <button class="btn btn-success float-end" @click="$router.push('/referrals/register/add')"> Add New Referral</button>
          </template>
        </FilterSection>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  <th>Email</th>
                  <th>Approved</th>
                  <th>Match</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody>
              <tr v-if="list.length">
                <template v-for="(item, index) in list" :key="index">
                  <td>{{item.end_user_name}} </td>
                  <td>{{item.end_user_email}} </td>
                  <td v-if="item.is_approved"> Yes </td>
                  <td v-else> No </td>
                  <td v-if="item.is_exact_match"> Yes </td>
                  <td v-else> No </td>
                  <td>
                    <button class="btn btn-primary btn-sm" @click="$router.push('/referrals/register/detail/'+ item._id)">Detail</button>
                    <!-- <a :href="'/referrals/register/detail/' + item._id"> Detail </a> -->
                   <a  href="javascript:void(0)" @click.prevent = "calculateVest(item._id,20)" v-if="user_type == 1"> vest_20 </a> 
                   <a  href="javascript:void(0)" @click.prevent = "calculateVest(item._id,100)" v-if="user_type == 1"> vest_100 </a> 
                  </td>
                </template>
              </tr>
              <tr v-else>
                <td colspan="10" class="text-center">
                  <div class="py-5">
                    <img src="/img/no-result.svg" alt="" class="img-empty"> 
                    <p class="h5 mt-4 d-block fw-normal">
                      No Booking Exists
                    </p>
                  </div>
                </td>
              </tr>
          </tbody>
      </table>
        <Pagination class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'referrals register results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
    </CCol>
    </CRow>
  </div>
</template>

<script>
import FilterSection from '@/ui_components/FilterSection'
import Pagination from "@/common/Pagination";
import Alerts from '../../Alerts'
export default {
  name: 'List',
  components: { Pagination,Alerts, FilterSection },
  data (){
      return({
      alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
      list:[],
      search:'',
      user_type:this.$store.state.user_data.type,
      page:1,
      pageCount:1,
      timezone:this.$store.state.business_settings.business_time_zone
      })
  },
  created(){
      this.getReferralsList();
  },
  methods:{
      alertClosedFn() {
          this.show = 0;
      },
      getReferralsList() {
        this.$schedsdk.get_referral_register_list({search:this.search,page:this.page}).then((result)=>{
          this.list = result.data
          this.pageCount = result.total_pages
        })
    },
    setPage(pageNo){
      this.page = pageNo;
      this.getBookingsList();
    },
    calculateVest(ref_id,new_per){
    this.$schedsdk.calculate_vestReferral({ref_id:ref_id,new_per:new_per}).then((result)=>{
		if(result.status == 1){
      this.alertData = {
          message:result.message,
          type:'success'
        }
        this.alert = true;
        this.show=4;
		}
		else{
		this.alertData = {
				message:result.message,
				type:'danger'
			}
			this.alert = true;
			this.show=4;
		}
    }).catch((ex)=>{
		this.alertData = {
			message:ex.response.data.message || "Something went wrong",
			type:'danger'
		}
		this.alert = true;
		this.show=4;
    });
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