<template>
  <div>
    <CRow>
      <CCol sm="12">
        <div class="text-right">
        </div>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Deleted?</th>
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody  v-if="list.length">
              <tr   v-for="(item, index) in list" :key="index">
                
                  <td>{{item.first_name}} {{item.last_name}}</td>
                  <td>{{item.email}} </td>
                  <td>{{item.phone}} </td>
                  <td v-if="item.type == 2"> Business Owner </td>
                  <td v-else-if="item.type == 3"> Reception/Manager </td>
                  <td v-else-if="item.type == 6"> Business Entity </td>
                  <td v-else-if="item.type == 9"> Resource </td>
                  <td v-else-if="item.type == 5"> Customer </td>
                  <td v-else> Employee </td>
                  <td v-if="item.is_deleted == 1"> Yes </td>
                  <td v-else> No </td>
                  <td>
                     <input type="button" class="btn btn-secondary btn-sm" value="Reset Password" @click="resetPassword(item._id)"/>
                     &nbsp; <input type="button" class="btn btn-danger btn-sm" value="Undelete" @click="undeleteUser(item._id, item.business_id)"/>
                  </td> 
                
              </tr>
            
          </tbody>
          <tbody v-else>
              <tr ><td colspan="10" class="text-center">
                <div class="py-5">
                  <img src="/img/no-result.svg" alt="" class="img-empty"> 
                  <p class="h5 mt-4 d-block fw-normal">
                    No records found
                  </p>
                </div>
              </td></tr>
          </tbody>
      </table>
      <Pagination class="mt-2"
          v-if="list.length"
          :size="'sm'"
          :ariaLabel="'Business Users results pages'"
          :activePage.sync="page"
          :pages="pageCount"
          @update:activePage="setPage"
      />
    </CCol>
    </CRow>
    <CModal :visible="resetPwdModal">
        <CModalHeader>
          <CModalTitle>Reset Password</CModalTitle>
      </CModalHeader>
        <CModalBody>
        <div class="row">
            <div class="col-md-4">
            New Password
            </div>
            <div class="col-md-4">
            
            <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="random_string"
                            >
            </div>
        </div>
        </CModalBody>
        <CModalFooter>
            <CButton @click="changePassword(user_id,random_string)" color="success" >Confirm</CButton>
            <CButton @click="resetPwdModal = false" color="danger">Cancel</CButton>
        </CModalFooter>
        </CModal>
     <CModal :visible="showDone">
       <CModalHeader>
            <CModalTitle>Done Reset Password</CModalTitle>
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
</template>

<script>
import Pagination from "@/common/Pagination";
export default {
  name: 'List',
  components: { Pagination },
  data (){
      return({
        list:[],
        resetPwdModal:false,
        page:1,
        pageCount:1,
        random_string:'',
        user_id:'',
        done_response: '',
        showDone: false
      })
  },
  created(){
      this.getUsersList();
      this.showDone = false;
  },
  methods:{
      getUsersList() {
        this.$schedsdk.get_business_users({business_id:this.$route.params.business_id,page_no:this.page}).then((result)=>{
          if(result.status == 1)
          {
            this.list = result.data
            this.pageCount = result.total_pages
          }
        })
    },

    setPage(pageNo){
      this.page = pageNo;
      this.getUsersList();
    },
        rndStr(len) {
    	let text = " "
    	let chars = "abcdefghijklmnopqrstuvwxyz"
    
      for( let i=0; i < len; i++ ) {
				text += chars.charAt(Math.floor(Math.random() * chars.length))
      }

			return text
		},
    resetPassword(user_id){
      this.user_id = user_id;
      this.random_string = this.rndStr(8)
      this.resetPwdModal = true;
    },
    changePassword(user_id,random_string){
      // console.log(user_id)
      // console.log(random_string.trim());
      let data = {
        user_id:user_id,
        password:random_string.trim()
      }
      this.resetPwdModal = false;
      this.$schedsdk.resetPassword(data).then((result)=>{
           this.showDone = true;
          if(result.status == 1)
          {
             this.done_response = result.message;
          }
          else
          {
            this.done_response = result.message || "Error";
          }
        })
    },
    undeleteUser(user_id,business_id)
    {
        let data = {
              _id:user_id,
              business_id: business_id
              }
        this.$schedsdk.undeleteUser(data).then((result)=>{
                this.showDone = true;
          if(result.status == 1)
          {
             this.done_response = result.message;
          }
          else
          {
            this.done_response = result.message || "Error";
          }
        });
    },
    closeShowdone()
    {
        this.showDone = false;
    }
  }
    
}
</script>
