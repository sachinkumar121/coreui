<template>
  <div>
    <label>
      Redeem For:
      <input class="mx-2" type="radio" id="one" value="discount" v-model="discount" />
      <label for="one">Discount</label>

      <input class="mx-2" type="radio" id="two" value="services"  v-model="discount" />
      <label for="two">Services</label>
     </label>
    <CFormSwitch :checked="fixed_conversions" v-model="fixed_conversions" class="mb-3" inline label="Fixed Conversions"/>
    <CRow>
    <CContainer v-if="this.discount==='services'">
      <CRow class="justify-content-start g-2" v-for="(elem,i) in redemptionData" :key="i">
        <CCol md="3" sm="4" xs="3">
          <CFormFloating class="mb-2 p-0 border-0" size="sm">
            <CFormInput id="floatingInput" placeholder="Points" class="" v-model="elem.points" size="sm" type="number"/>
            <CFormLabel for="floatingInput" size="sm">Points</CFormLabel>
          </CFormFloating>
        </CCol>
        <br/>
        =
        <CCol md="6" xs="7" sm="6">
          <v-select :options="services_option" label="_id"
                    multiple v-model="elem.redemption_item_ids"
          >
            <template v-slot:no-options>
              Type to search ...
            </template>
            <template v-slot:option="option">
              <div class="d-center">
                {{ option.name + " (" + option.time + " mins) " + currency_symbol + "" + option.price }}
              </div>
            </template>
            <template v-slot:selected-option="option">
              <div class="selected d-center">
                {{getSelectedServiceDisplay(option)}}
              </div>
            </template>
          </v-select>
        </CCol>
      </CRow>
    </CContainer>
    <CContainer v-if="discount==='discount'">
      <CRow class="justify-content-start g-2" v-for="(elem,i) in redemptionData" :key="i">
        <CCol md="4" xs="3" sm="4">
          <CFormFloating class="mb-2 p-0 border-0" size="sm">
            <CFormInput id="floatingInput2" v-model="elem.points" placeholder="Points" size="sm" type="number"/>
            <CFormLabel for="floatingInput2" size="sm">Points</CFormLabel>
          </CFormFloating>
        </CCol>
        <br/>
        =
        <CCol md="4" xs="3" sm="4">
          <CFormFloating class="mb-2 p-0 border-0" size="sm">
            <CFormInput id="floatingInput3" v-model="elem.redemption_value" placeholder="Discount" size="sm" type="number"/>
            <CFormLabel for="floatingInput3" size="sm">Discount</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol md="3" xs="4" sm="3">
          <CFormSelect
            aria-label="Default select example"
            :options="[
    { label: 'Discount percentage', value: '1' },
    { label: 'Cash', value: '2' },
    { label: 'Services', value: '3' }
  ]" v-model="elem.redemption_type">
          </CFormSelect>
        </CCol>
      </CRow>
    </CContainer>
    </CRow>
    <div class="d-flex justify-content-between gap-1 mt-2">
      <CButton color="secondary" v-on:click="this.$router.push('/settings/loyalty')">
        Cancel
      </CButton>
      <CButton class="btn btn-success" :disabled="disabled" color="primary" v-on:click="updateLoyaltyRedemption()">
        <CSpinner aria-hidden="true" component="span" size="sm" v-if="spinner"/>
        Submit
      </CButton>
    </div>
    <CModal alignment="center" :visible="success" @close="() => { this.success = false }">
      <CModalHeader>
            <CModalTitle>Update Successful</CModalTitle>
      </CModalHeader>
      <CModalBody>
        You have updated your Loyalty settings
      </CModalBody>
    </CModal>

  </div>
</template>

<script>
  export default {
    name: "loyaltyRedemption",
    data() {
      return {
        currency_symbol: this.$store.state.business_settings.business_currency_symbol,
        services_option: [],
        success:false,
        disabled:true,
        spinner:false,
        services: [],
        discount:'discount',
        redemptionData: [{
          points: '1000',
          redemption_item_ids: [{
            item_id: "603fd6b5e93f26395cf6081c",
            item_type: "S"
          }],
          redemption_type: '3',
          redemption_value: '0',
        }],
        fixed_conversions: false,
      }
    },
    created() {
      this.getServicesList();
      this.getLoyaltyRedemption();
    },
    methods: {
      getLoyaltyRedemption(){
        this.spinner=true;
        this.$schedsdk.getLoyaltyRedemption().then((result) => {
          if (result.status === 1) {
            this.redemptionData = result.data
            this.fixed_conversions=result.fixed_conversions
            this.redemptionData.forEach((v)=>{
              v.points=v.points.toString()
              v.redemption_type = v.redemption_type.toString()
              v.redemption_value = v.redemption_value.toString()
            })
            this.disabled=false
            this.spinner=false
          }
        })

      },
      getSelectedServiceDisplay(item) {
        if(item.item_id && item.item_type==='S'){
          let name=''
          for (let i=0; i<this.services_option.length ; i++){
            if(this.services_option[i]._id.toString()===item.item_id.toString()){
              name = this.services_option[i].name
              break
            }
          }
          return name
        }
        if (item.flex_service_name) {
          return item.flex_service_name
        }
        return item.name
      },
      getServicesList() {
        this.$schedsdk.list_services({page_no: 1}).then((result) => {
          if (result.status === 1) {
            this.services_option = result.data
          }
        })
      },
      updateLoyaltyRedemption(){
        this.disabled=true;
        this.spinner=true;
       this.redemptionData.forEach((e)=>{
         let redemptionItemId=[]
         e.redemption_item_ids.forEach((elem)=>{
         if(!elem.item_id){
           let obj={_id:elem._id,item_id: elem._id,item_type: 'S'}
           redemptionItemId.push(obj)
         }
         else {
           redemptionItemId.push(elem)
         }
       })
         e.redemption_item_ids=redemptionItemId
       })
        let redemption ={data:this.redemptionData,fixed_conversions:this.fixed_conversions}
        this.$schedsdk.postLoyaltyRedemption(redemption).then(()=>{
          this.disabled=false;
          this.spinner=false;
          this.success=true;
        });
      },
    }
  }
</script>

<style scoped>

</style>
