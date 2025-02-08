<template>
  <div>
    <CRow>
      <CCol sm="12">
        <form id="filter_form">
          <CRow>
            <CCol sm="3">
            </CCol>
            <CCol sm="3">
              <label class="control-label"><b>From</b></label>
              <CFormInput
                type="date"
                v-model="from"
              />
              <!-- <input readonly="true" class="form-control datepicker" placeholder="Bookings From" ng-required="true" ng-model="SelectedReportDate" type="text" id="query_from1" name="query_from" required="required" data-ng-animate="2"> -->
            </CCol>
            <CCol sm="3">
              <label class="control-label"><b>To</b></label>
              <CFormInput
                type="date"
                v-model="to"
              />
              <!-- <input readonly="true" class="form-control datepicker" placeholder="Bookings From" ng-required="true" ng-model="SelectedReportDate" type="text" id="query_from1" name="query_from" required="required" data-ng-animate="2"> -->
            </CCol>
            <CCol sm="3">
            </CCol>
          </CRow>
          <br>
          <CRow>
            <CCol sm="5">
            </CCol>
              <CCol sm="1">
                    <button id="filter" @click="getList" class="btn btn-primary btn-danger btn-sm" type="button" title="Filter" >Filter</button>
              </CCol>
              <CCol sm="1">
                    <button id = "clear" class="btn btn-primary btn-primary btn-sm clear_form" type="button" title="Reset">Reset</button>
              </CCol>
              <CCol sm="5">
            </CCol>
          </CRow>
        </form>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Service</th>
                  <th>Count</th>
                  <th>Total Amount</th>
              </tr>
          </thead>
          <tbody v-if="list.length">
              <tr v-for="(item, index) in list">
                  <td>{{item.item_name}}</td>
                  <td>{{item.count}}</td> 
                  <td>{{item.total_amount}}</td> 
              </tr>
          </tbody>
          <tbody v-else>
            <tr >
                <td colspan="10" class="text-center">
                  <div class="py-5">
                    <img src="/img/no-result.svg" alt="" class="img-empty"> 
                    <p class="h5 mt-4 d-block fw-normal">
                      No Record Exists
                    </p>
                  </div>
                </td>
              </tr>
          </tbody>
      </table>
    </CCol>
    </CRow>
  </div>
</template>

<script>
import moment from 'moment-timezone'
export default {
  name: 'TopSelling',
  data (){
      return({
        list:[],
        page:1,
      pageCount:1,
       from:moment().format("YYYY-MM-DD"),
       to:moment().format("YYYY-MM-DD")
      })
  },
  created(){
      this.getList()
  },
  methods:{
      getList() {
        this.from = moment.tz(this.from + ' ' + "00:01", this.$store.state.business_settings.business_time_zone).valueOf()
        this.to = moment.tz(this.to + ' ' + "23:59", this.$store.state.business_settings.business_time_zone).valueOf()
        let data = {
          start_time_report:this.from,
          end_time_report:this.to,
          business_id:this.$store.state.user_data.business_id,
          }
        this.$schedsdk.top_item_report(data).then((result)=>{  
          this.list = result.data.report;
          this.pageCount = result.total_pages
        })
    }
  }
    
}
</script>
