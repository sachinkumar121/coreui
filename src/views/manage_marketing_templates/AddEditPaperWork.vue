<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-user-form" @submit.prevent="UpdateUser">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-12">
                      <div class="form-group" >
                          <label class="control-label"><b>Paperwork Name</b></label>
                          <input 
                           
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="data_obj.paperwork_name" 
                          />
                       </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                      <div class="form-group" >
                          <label class="control-label"><b>Paperwork Description</b></label>
                          <input 
                           
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="data_obj.description" 
                          />
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group" >
                          <label class="control-label"><b>Is active</b></label> &nbsp;
                          <CFormSwitch v-model="data_obj.is_active"
                            :value="data_obj.is_active"/>
                        </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group" >
                        <CFormSwitch v-model="data_obj.is_required"
                            :value="data_obj.is_required" />
                        &nbsp;
                        <label class="control-label mb-0"><b>Is required for booking</b></label> &nbsp;
                    </div>
                  </div>
                </div>
                
             
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group"> 
                          <label class="control-label"><b>Select document template used for signing</b></label>
                            <v-select
                             
                             v-model="selected_document_template_id" 
                                    label="document_name" 
                                :options="document_template_list"
                                :reduce="document => document._id">
                            <template v-slot:no-options>
                                Type to search...
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.document_name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                {{ option.document_name }}
                                </div>
                            </template>
                            </v-select>
                      </div>
                  </div>
                    
              </div>
 
              <div class="row">
                  <div class="col-md-12">
                      <button class="btn btn-success float-end">Update</button>
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { required, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
export default {
    name: 'EditProduct',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        selected_document_template_id: null,
        document_template_list: [],
        user_type_options:[
            {type:2,name:"Business Owner"},
            {type:3,name:"Receptionist"},
            {type:4,name:"Provider"}
        ],
        employment_type_options:[
            {type:1,name:"Employed"},
            {type:2,name:"Independent"}
        ],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        _id:'',
        data_obj: {}
      })
    },
    validations:{
      first_name:{
        required
      },
      last_name:{
        required
      },
      email:{
        required,
        email
      },
      phone:{
          required
      }
    },
    created(){
        this._id = this.$route.params.paperwork_id?this.$route.params.paperwork_id:''
         this.$schedsdk.get_legal_agreements_waivers().then((result => {
             if(result && result.status == 1)
             {
                    this.document_template_list = result.data;

             }
             this.getUserDetail();
         }))
        
    },
    methods:{
    getUserDetail(){
        if (this._id == '')
        {
            return;
        }
        this.$schedsdk.get_paperwork_definition(this._id).then((result)=>{
            if(result.status == 1)
            {
                this.data_obj = result.data 
                let selectedid = 
                     this.document_template_list.find((obj)=>{if (obj._id == result.data.external_law_id) return obj._id})
                if(selectedid && selectedid._id)
                {
                    this.selected_document_template_id = selectedid._id;
                }
               // this.type = this.user_type_options.find((obj)=>{if (obj.type == result.data.type) return obj})
               // this.employment_type = this.employment_type_options.find((obj)=>{if (obj.type == result.data.employment_type) return obj})
            }
        })
    },
    
    
    UpdateUser(e){
        e.preventDefault();
        this.v$.$touch()
        if (!this.selected_document_template_id || 
                this.selected_document_template_id == '' || 
                this.selected_document_template_id.length<3)
        {
               this.alertData = {
                    message:"Please select document template to be used for signing",
                    type:'danger'
                }
                this.alert = true;
                this.show=5;
                return;
        }
        else
        {
            if (this.selected_document_template_id != this.data_obj.external_law_id)
            {
                let selectedid = this.selected_document_template_id
                let docName =   this.document_template_list.find((obj)=>{if (obj._id == selectedid) return obj})
                this.data_obj.external_law_doc_name = docName.document_name
            }
            this.data_obj.external_law_id = this.selected_document_template_id
        }
        if (!this.data_obj.paperwork_name || 
                this.data_obj.paperwork_name == '' || 
                this.data_obj.paperwork_name.length<2)
        {
               this.alertData = {
                    message:"Please select name for the paperwork",
                    type:'danger'
                }
                this.alert = true;
                this.show=5;
                return;
        }
        let sdkfn = null;
        let mythis = this;
        if (!this.data_obj._id || 
                this.data_obj._id == '' || 
                this.data_obj._id.length<2)
        {
             //adding
            sdkfn =  mythis.$schedsdk.add_paperwork_definition(this.data_obj)
        }
        else
        {
            //edit
            sdkfn =  mythis.$schedsdk.edit_paperwork_definition(this.data_obj)
        }
 
        sdkfn.then((result)=>{  
                    if(result.status == 1){
                        //this.$router.push('/users');
                           this.$router.go(-1)
                    }
                    else{
                        this.alertData = {
                            message:result.message,
                            type:'danger'
                        }
                        this.alert = true;
                        this.show=4;
                    }
            }).catch(ex=>{
                console.log(ex);
                this.alertData = {
                    message:ex,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });
        
    },
    alertClosedFn() {
        this.show = 0;
    }
    }
}
</script>
<style scoped>
.invalid{
  border: 1Px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg{
  color: red;
}
</style>