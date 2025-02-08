<template>
  <div class="pt-2">
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
      </CCol>
    </Crow>
    <CRow>
      <CCol sm="12">
        <FilterSection>
          <template v-slot:search-input>
            <div class="form-group" >
              <label class="control-label"><b>Search</b></label>
              <input 
              v-model="search"
              class="form-control placeholder-no-fix" 
              @keyup="getProductsCatList()"
              type="text" 
              />
            </div>
          </template>
          <template v-slot:actions>
            <a class="btn btn-success float-end" @click="addProductCatModal = true" > Add New Category</a>
          </template>
        </FilterSection>
        <br>
        <table class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th> 
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody v-if="list.length">
              <tr v-for="(item, index) in list" :key="index" >
                  <td>{{item.name}} </td>
                  <td>{{item.category_description}} </td>
                  <td v-if="item.status"> Active </td>
                  <td v-else> Inactive </td>
                  <td>
                    <a :href="'#'" @click.prevent="getProductCatDetail(item._id)" class="btn btn-primary btn-sm"> Edit </a>
                     &nbsp;
                    <button class="btn btn-danger btn-sm" @click="confirmDelete(item)">Delete</button>
                    
                  </td> 
              </tr>
          </tbody>
          <tbody v-else>
            <tr >
              <td colspan="4" class="text-center">
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
            :ariaLabel="'Product categories results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
    </CCol>
    </CRow>
    <add-product-cat-modal 
        :visible="addProductCatModal"
        @close="addProductCatModal = false"
        @error="onError"
        @success="onCategoryAdd"
    />
    <CModal :visible="EditProductCatModal" @close="() => { EditProductCatModal = false }">
      <CModalHeader>
        <CModalTitle>Edit Product Category</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <form class="add-product-form">
            <div class="row">
              <!-- <div class="col-md-1">
              </div> -->
              <div class="col-md-12">
                <div class="form-group" >
                    <label class="control-label"><b>Category Name</b></label>
                    <input 
                    :class={invalid:v$.edit_cat_name.$error}
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    v-model="edit_cat_name"
                    @blur="v$.edit_cat_name.$touch()" 
                    />
                    <p class="error-msg" v-if="v$.edit_cat_name.$dirty && v$.edit_cat_name.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
              <!-- <div class="col-md-1">
              </div> -->
            </div>
            <div class="row">
              <!-- <div class="col-md-1">
              </div> -->
              <div class="col-md-12">
                <div class="form-group">
                    <label class="control-label"><b>Description</b></label>
                    <input class="form-control placeholder-no-fix"
                    type="text" 
                    v-model="edit_cat_desc"
                    :class={invalid:v$.edit_cat_desc.$error}
                    @blur="v$.edit_cat_desc.$touch()" 
                    />
                    <p class="error-msg" v-if="v$.edit_cat_desc.$dirty && v$.edit_cat_desc.required.$invalid">This field must not be empty.</p> 
                </div>
              </div>
              <!-- <div class="col-md-1">
              </div> -->
            </div>
            <div class="row">
              <!-- <div class="col-md-1">
              </div> -->
              <div class="col-md-12">
                <div class="md-checkbox has-success">
                <input type="checkbox" 
                v-model="edit_status" 
                :checked = edit_status
                class="md-check form-check-input">
                <label class="ms-2"><b>Mark as active</b> </label>
              </div>
              </div>
              <!-- <div class="col-md-1">
              </div> -->
            </div>
        </form>
        </CModalBody>
        <CModalFooter>
        <CButton @click="EditProductCatModal = false" color="danger">Discard</CButton>
        <CButton @click="UpdateProductCat" color="success">Update</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Pagination from "@/common/Pagination";
import Alerts from '../Alerts';
import AddProductCatModal from '@/views/product_category/AddProductCatModal';
import FilterSection from '@/ui_components/FilterSection'

export default {
  name: 'List',
  components: { Pagination, Alerts, AddProductCatModal, FilterSection },
  setup: () => ({ v$: useVuelidate() }),
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
      addProductCatModal: false,
      EditProductCatModal: false,
      cat_name:'',
      cat_desc:'',
      status:1,
      edit_cat_name:'',
      edit_cat_desc:'',
      edit_status:1,
      cat_id:'',
      page:1,
      pageCount:1,
      })
  },
  validations:{
      cat_name:{
        required
      },
      cat_desc:{
        required
      },
      edit_cat_name:{
        required
      },
      edit_cat_desc:{
        required
      }
    },
  created(){
      this.getProductsCatList();
  },
  methods:{
        onCategoryAdd(category) {
            this.getProductsCatList();
        },
        onError(message) {
            this.show_prod_cat_modal = false;
            this.alertData = {
                message,
                type: 'danger'
            }
            this.alert = true;
            this.show = 4;
        },
      getProductsCatList() {
        this.$schedsdk.get_product_category({category_name:this.search,page_no:this.page}).then((result)=>{
          this.list = result.data
          this.pageCount = result.total_pages
        })
    },
    AddNewProductCat(){
        // e.preventDefault();
        this.v$.$touch()
        let data = {
            name: this.cat_name,  
            category_description: this.cat_desc,
            status:this.status
        }
        if(!this.v$.cat_name.$invalid && !this.v$.cat_desc.$invalid){
            this.alert = false;
            this.addProductCatModal = false;
            this.$schedsdk.add_product_category(data).then((result)=>{  
            if(result.status == 1){
              this.getProductsCatList();
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
              this.addProductCatModal = false;
            this.alertData = {
                message:ex.data.message,
                type:'danger'
            }
            this.alert = true;
            this.show=4;
            });
        }
    },
    getProductCatDetail(id){
        this.$schedsdk.get_product_category_detail({cat_id:id}).then((result)=>{
            if(result.status == 1){
                this.cat_id = result.data._id;
                this.edit_cat_name = result.data.name;
                this.edit_cat_desc = result.data.category_description;
                this.edit_status = result.data.status;
                this.EditProductCatModal = true;
            }
        })
    },
    UpdateProductCat(e){
      e.preventDefault();
        this.v$.$touch()
        let data = {
            _id:this.cat_id,
            name: this.edit_cat_name,  
            category_description: this.edit_cat_desc,
            status:this.edit_status
        }
        if(!this.v$.edit_cat_name.$invalid && !this.v$.edit_cat_desc.$invalid){
            this.alert = false;
            this.$schedsdk.edit_product_category(data).then((result)=>{  
              this.EditProductCatModal = false;
              if(result.status == 1){
                this.getProductsCatList();
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
                console.log(ex.data)
                this.EditProductCatModal = false;
              this.alertData = {
                  message:ex.data.message,
                  type:'danger'
              }
            this.alert = true;
            this.show=4;
            });
        }
    },
    setPage(pageNo){
      // console.log('pageNo')
      // console.log(pageNo)
      this.page = pageNo;
      this.getProductsCatList();
    },
    confirmDelete(item)
    {
        let confirmed = confirm("Are you sure to delete this item: " + item.name);
        if(confirmed){
             this.$schedsdk.delete_product_category({_id: item._id}).then((result)=>{
                 this.getProductsCatList();
            })
        }
    },
    alertClosedFn() {
        this.show = 0;
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
