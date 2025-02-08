<template>
  <div>
    <CRow>
      <CCol sm="12">
        <div class="text-right">
        </div>
        <br>
        <div class="col-md-4">
            <div class="form-group" >
                    <label class="control-label">
                    <b>Filter by Business</b>
                    </label>
                    <v-select 
                      label="business_name"
                      v-model="selected_business" 
                      @update:modelValue="getLogsList"
                      @search="onSearch"
                      :options="options"
                      @option:selecting="page = 1"
                      @option:deselecting="page = 1"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                        No results found for <em>{{ search }}</em
                        >.
                        </template>
                        <em v-else style="opacity: 0.5">Start typing to search</em>
                      </template>
                      <template v-slot:option="option">
                      <div class="d-center">
                        {{ option.business_name }}
                        </div>
                      </template>
                      <template v-slot:selected-option="option">
                        <div style="display: flex; align-items: baseline">
                          <div class="selected d-center">{{ option.business_name}}</div>
                        </div>
                      </template>
                    </v-select> 
                </div>
            </div>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                 <th>Date</th>
                 <th>Business Name</th>
                  <th>Description</th>
                  <th>Device Identifier</th>
              </tr>
          </thead>
          <tbody v-if="list.length">
              <tr v-for="(item, index) in list" :key="index">
                  <td>{{ getFormattedDate(item.created_at) }}</td>
                  <td>{{item.business_data.business_name}}</td>
                  <td>{{item.log_message}} </td>
                  <td>{{item.device_identifier}} </td>
              </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="text-center">
                <div class="py-5">
                  <img src="/img/no-result.svg" alt="" class="img-empty"> 
                  <p class="h5 mt-4 d-block fw-normal">
                    No Logs Exists
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
      </table>
        <Pagination class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'App logs results pages'"
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
import {debounce as lodash_debounce} from 'lodash'
import moment from 'moment'
export default {
  name: 'List',
  components: { Pagination },
  data (){
      return({
        options:[],
        selected_business:{},
        list:[],
        page:1,
        pageCount:1,
      })
  },
  created(){
      
       if (this.$route.params.business_id != undefined)
        {
            this.selected_business._id = this.$route.params.business_id
        }
               

      this.getLogsList();
  },
  methods:{
    onSearch(search, loading) {
		  loading(true);
		  this.search(loading, search, this);
		},
		search: lodash_debounce((loading, search, vm) => {
        vm.$schedsdk.getBusinessList(search).then(res => {
              if(res.status == 1)
                  vm.options = res.data;
              else
              vm.options = [];
        loading(false);
		  });
		}, 300),
    getLogsList() {
      let data = {};
      data.page_no = this.page;
      if(this.selected_business._id){
        data.business_id = this.selected_business._id;
      }
      this.$schedsdk.get_app_logs(data).then((result)=>{
        if(result.status == 1)
        {
          this.list = result.data
          this.pageCount = result.total_pages
        }
        
      })
    },
    getFormattedDate: function (dt_unix) {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).fromNow();
    },
    setPage(pageNo){
      this.page = pageNo;
      this.getLogsList();
    }
  }
    
}
</script>
