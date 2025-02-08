<template>
<div class="pt-2">
    <FilterSection>
        <template v-slot:search-input>
            <label class="control-label"><b>Search Name</b></label>
            <input 
            v-model="search_email_phone"
            class="form-control placeholder-no-fix" 
            @keyup="getDataList()"
            type="text" 
            />
        </template>
        <template v-slot:actions>
            <button class="btn btn-success float-end" @click="addEditTeam(null)"> Add New Team </button>
        </template>
    </FilterSection>
    <!-- <div class="row">
        <div class="col-md-12 pt-2">
            <label class="control-label"><b>Searching...</b></label>
        </div>
    </div> -->
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
                      <thead>
              <tr>
                  <th>Team</th>
                  <th>Members</th>
                  
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody  v-if="list.length" >
              <tr v-for="item in list" :key="item._id">
                  <td>{{item.name}}<br>
                       {{item.description}}<br> 
                  </td>
                  <td><ul v-if="item.user_id_list.length>0">
                        <li v-for="userrec in item.user_id_list" :key="userrec._id">
                            {{userrec.first_name}} {{userrec.last_name}}
                        </li>
                      </ul>
                  </td>
                   
                  <td class="action_column">
                    <button type="button" 
                         @click="addEditTeam(item)" 
                         class="btn btn-primary btn-sm" >Edit</button>
                   
                    <button type="button" 
                         @click="deleteUser(item)" 
                         class="btn btn-danger btn-sm" >Delete</button>
                    
                  </td> 
              </tr>
          </tbody>
          <tbody  v-else>
            <tr>
                <td colspan="10" class="text-center">
                    <div class="py-5">
                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                        <p class="h5 mt-4 d-block fw-normal">
                            No Records found
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
            :ariaLabel="'Department teams results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />


    <CModal alignment="center" :backdrop="true" :keyboard="true" :visible="AddEditDeptTeam" @close="AddEditDeptTeam = false">
        <CModalHeader>
            <CModalTitle>Add/Edit department/team</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <form class="add-product-form" v-if="operation_completed==true">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="control-label"><b>Team Name</b></label>
                                <input 
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    v-model="teamAddEditObj.name"
                                />
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="control-label"><b>Short Name</b></label>
                                <input 
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            v-model="teamAddEditObj.short_name"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="control-label"><b>Description</b></label>
                                <input 
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            v-model="teamAddEditObj.description"
                            />
                        </div>
                    </div>
                     
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="control-label"><b>Services Limited to (leave empty to accept any service)</b></label>
                                <v-select multiple v-model="teamAddEditObj.allowed_service_list" 
                                label="name" :options="services_option"
                                >
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{ option.name}}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                    {{ getSelectedServiceDisplay(option) }}
                                    </div>
                                </template>
                                </v-select>
                        </div>
                    </div>
                </div> <!-- End services -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="control-label"><b>Select Team/Department members</b></label>
                                <v-select v-model="teamAddEditObj.user_id_list" 
                                multiple
                                :options="provider_option"
                                label="first_name">
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{ option.first_name }} {{option.last_name}}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                    {{ option.first_name }} {{option.last_name}}
                                    </div>
                                </template>
                                </v-select>
                        </div>
                     
                    </div>
                
                </div>
                
                <div class="row">
                    <div class="col-md-12">
                        <input  
                                    type="checkbox" class="form-check-input"
                                    v-model="teamAddEditObj.status" 
                            />  &nbsp;
                        <label class="control-label">
                                <b>Is Enabled </b> &nbsp;&nbsp;
                        </label>
                    </div>
                </div>
            </form>
        </CModalBody>
        <CModalFooter>
            <CButton @click="AddEditDeptTeam = false" color="danger">Discard</CButton>
            <CButton @click="AddUpdateDeptTeam" color="success">Update</CButton>
        </CModalFooter>
    </CModal>
</div>


</template>

<script>
import FilterSection from '@/ui_components/FilterSection'
import Pagination from "@/common/Pagination";
import PhoneNumber from 'awesome-phonenumber'
import {debounce as lodash_debounce} from 'lodash'
import  '../../assets/css/common.css';
export default {
  name: 'List',
  components: { Pagination, FilterSection },
  data (){
      return({
          AddEditDeptTeam: false,

        search_email_phone:'',
        list:[],
        page:1,
        pageCount:1,
        country_code : "US",
        hint_has_required_paperworks: this.$store.state.business_settings.hint_has_required_paperworks,
        done_response: '',
        showDone: false,
        operation_completed: false,
        teamAddEditObj: {},
        services_option: [],
        provider_option: [],

      })
  },
  created(){
      this.country_code = "US", //this.$store.state.business_settings.business_time_zone
      this.getDataList();
  },
  methods:{
     getDataList() {
        this.debGetList(this);

    },
    debGetList:  lodash_debounce((context)=>{

               
            context.$schedsdk.get_departments_list({
                                          count_per_page: 25, 
                                          name:context.search_email_phone,
                                          page_no:context.page, 
                                          }).then((result)=>{
            context.list = result.data
            context.pageCount = result.total_pages
        })
        }, 400),

    setPage(pageNo){
      this.page = pageNo;
      this.getDataList();
    },
      getSelectedServiceDisplay(item)
            {
                if(item.flex_service_name)
                {
                    return item.flex_service_name
                }
                return item.name
            },
    addEditTeam(item)
    {
        let networkInprogress = false;
        if(this.services_option.length ==0)
        {
            this.getServicesList()
            networkInprogress = true;
        }
        if(this.provider_option.length ==0)
        {
            this.getProvidersList()
            networkInprogress = true;
        }
        if (item == null)
        {
            this.teamAddEditObj = {status:true};
        }
        else
        {
            this.teamAddEditObj = JSON.parse(JSON.stringify(item))
        }
        this.AddEditDeptTeam = true;
        if(networkInprogress == false)
        {
            this.operation_completed = true
        }
    },
    AddUpdateDeptTeam()
    {
        //console.log(this.teamAddEditObj);
        let me = this;
        this.$schedsdk.add_edit_department(this.teamAddEditObj).then((result)=>{
                    if(result.status == 1){
                            me.getDataList()
                    }
                this.AddEditDeptTeam = false;    
        }).catch(ex =>{
            console.log("Errpr... ");
            console.log(ex);
            this.AddEditDeptTeam = false;   
        })
    },
    getServicesList() {
                this.$schedsdk.list_services({page_no:1}).then((result)=>{
                    if(result.status == 1){
                        this.services_option = result.data
                    }
                    this.operation_completed = true
                })
            },
    getProvidersList() {
                this.$schedsdk.get_users_list({}).then((result)=>{
                    if(result.status == 1){
                        this.provider_option = result.data
                    }
                    this.operation_completed = true
                     
                })
            },    
    deleteUser(item)
    {
         
        let cr = confirm("Are you sure to delete " + item.name + "?")
        if (cr)
        {
           this.$schedsdk.delete_department({_id: item._id}).then((result) =>{
           this.showDone = true;
          if(result.status == 1)
          {
             this.done_response = result.message;
             this.getDataList();
          }
          else
          {
            this.done_response = result.message || "Error";
          }
        }).catch(err => {
            this.showDone = true;
            console.log (err)
            this.done_response = (err.data && err.data.message)? err.data.message : "Error";
        })
             
        }
    },
  }
    
}
</script>
<style scoped>
    .action_column button {
        margin: 3px
    }
</style>
