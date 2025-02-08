<template>
<div class="bonus-setting">
    <CFormSwitch :checked="this.bonusData.enable_bonus" inline label="Enable Bonus"
                 v-model="this.bonusData.enable_bonus"/>
    <CFormSwitch :checked="this.bonusData.enable_flat_bonus" inline label="Enable Flat Bonus"
                 v-model="this.bonusData.enable_flat_bonus"/>
    <CFormSwitch :checked="this.bonusData.enable_tiered_bonus" inline label="Enable Tiered Structure"
                 v-model="this.bonusData.enable_tiered_bonus"/>
                 <br>
  <label> Gross Sales Calculation Period
  <CFormSelect
        :options="options"
    aria-label="Gross Sales Calculation Period"
    v-model="this.bonusData.gross_sales_calculation_period"
  >
  </CFormSelect>
  </label>
    <div class=" row g-3 justify-content-between" v-if="this.bonusData.enable_flat_bonus && this.bonusData.enable_bonus">
      <CCol md="5">
        <CInputGroup class="mb-3 ">
          <CFormLabel class="me-2" for="Input1">Flat Bonus(Product)</CFormLabel>
          <CFormInput class="border-0" id="Input1" min="0" type="number"
                      v-model="this.bonusData.flat_bonus_percent_product"/>
          <CInputGroupText>%</CInputGroupText>
        </CInputGroup>
      </CCol>
      <CCol md="5">
        <CInputGroup class="mb-3 ">
          <CFormLabel class="me-2" for="Input2">Flat Bonus(Services)</CFormLabel>
          <CFormInput class="border-0" id="Input2" min="0" type="number"
                      v-model="this.bonusData.flat_bonus_percent_service"/>
          <CInputGroupText>%</CInputGroupText>
        </CInputGroup>
      </CCol>
      <CCol md="4">
        <CInputGroup class="mb-3">
          <CFormLabel class="me-2" for="Input3">Minimum sale for flat</CFormLabel>
          <CFormInput class="border-0" id="Input3" min="0" type="number"
                      v-model="this.bonusData.minimum_sale_flat "/>
          <CInputGroupText>$</CInputGroupText>
        </CInputGroup>
      </CCol>
    </div>
    <div v-if="this.bonusData.enable_tiered_bonus && this.bonusData.enable_bonus">
<!--  Tiered Bonus for Products-->
  <div>
        <h3 class="mb-3" style="border-bottom: solid black; text-align: center;">Tiered Bonus for Products</h3>
  <div class="justify-content-end"> Bonus</div>
        <CRow :key="i" class="justify-content-between" v-for="(products,i) in this.bonusData.gross_sales_slab_products">
      <CCol md="3" sm="4" xs="4">
        <CInputGroup class="mb-3">
          <CInputGroupText>$</CInputGroupText>
              <CFormInput class="border-0" min="0" type="number" v-model="products.gross_sale_from"/>
        </CInputGroup>
      </CCol>
      <CCol md="2" sm="4" xs="2">
        <CInputGroupText class="border-0">
        <b>to</b>
        </CInputGroupText>
      </CCol>
      <CCol md="3" sm="4" xs="4" >
        <CInputGroup class="mb-3">
        <CInputGroupText>$</CInputGroupText>
              <CFormInput class="border-0" min="0" type="number" v-model="products.gross_sale_to"/>
        </CInputGroup>
      </CCol>
<!--      Bonus-->
      <CCol md="3" sm="4" xs="4" >
        <CInputGroup class="mb-3">
              <CFormInput class="border-0" min="0" type="number" v-model="products.bonus_percent"/>
          <CInputGroupText>%</CInputGroupText>
              <CButton class="ms-2 text-black"
                       color="danger"
                       shape="rounded-pill" v-if="this.bonusData.gross_sales_slab_products.length > 1" v-on:click="removeItem(products,this.bonusData.gross_sales_slab_products)" variant="ghost">X
              </CButton>
        </CInputGroup>
      </CCol>
      <CCol md="6" v-if="i===this.bonusData.gross_sales_slab_products.length-1">
        <CButton color="primary" v-on:click="addItem(this.bonusData.gross_sales_slab_products)">Add</CButton>
      </CCol>
    </CRow>
  </div>
<!--  Tiered Bonus for Services-->
  <div>
        <h3 class="mb-3" style="border-bottom: solid black; text-align: center;">Tiered Bonus for Services</h3>
        <CRow :key="i" class="justify-content-between" v-for="(products,i) in this.bonusData.gross_sales_slab_services">
      <CCol md="3" sm="4" xs="4">
        <CInputGroup class="mb-3">
          <CInputGroupText>$</CInputGroupText>
              <CFormInput class="border-0" min="0" type="number" v-model="products.gross_sale_from"/>
        </CInputGroup>
      </CCol>
      <CCol md="2" sm="4" xs="2">
        <CInputGroupText class="border-0">
          <b>to</b>
        </CInputGroupText>
      </CCol>
      <CCol md="3" sm="4" xs="4" >
        <CInputGroup class="mb-3">
          <CInputGroupText>$</CInputGroupText>
              <CFormInput class="border-0" min="0" type="number" v-model="products.gross_sale_to"/>
        </CInputGroup>
      </CCol>
      <CCol md="3" sm="4" xs="4" >
        <CInputGroup class="mb-3">
              <CFormInput class="border-0" min="0" type="number" v-model="products.bonus_percent"/>
          <CInputGroupText>%</CInputGroupText>
              <CButton class="ms-2 text-black"
                       color="danger"
                       shape="rounded-pill" v-if="this.bonusData.gross_sales_slab_services.length > 1" v-on:click="removeItem(products,this.bonusData.gross_sales_slab_services)" variant="ghost">X
              </CButton>
        </CInputGroup>
      </CCol>
      <CCol md="6" v-if="i===this.bonusData.gross_sales_slab_services.length-1">
        <CButton color="primary" v-on:click="addItem(this.bonusData.gross_sales_slab_services)">Add</CButton>
      </CCol>
    </CRow>
  </div>
    </div>
  <div class="d-flex gap-2">
  <CButton :disabled="disabled" class="btn btn-success mt-3" color="primary" v-on:click="updateBonus()">
        <CSpinner aria-hidden="true" component="span" size="sm" v-if="spinner"/>
        Submit
      </CButton>
  </div>
 </div>
</template>
<script>
    export default {
        name: "BonusSetting",
      data () {
        return {
            bonusData:{
            enable_bonus: false,
            enable_flat_bonus: false,
            enable_tiered_bonus: false,
          flat_bonus_percent_product: '0',
          flat_bonus_percent_service: '0',
          gross_sales_calculation_period: '1',
          minimum_sale_flat: '0',
          gross_sales_slab_products: [{gross_sale_from: '0', gross_sale_to: '0', bonus_percent: '0'}],
          gross_sales_slab_services: [{gross_sale_from: '0', gross_sale_to: '0', bonus_percent: '0'}],
          },
          disabled:true,
          spinner:false,
          options:[
            { label: 'daily', value: 1 },
            { label: 'weekly', value: 2 },
            { label: 'Bi-weekly', value: 3},
            {label: 'Per-order', value: 5},
            {label: 'Do not Apply',value: 6}
            /*
            gross_sales_calculation_period
            // 1 - daily, 2 - weekly,
            3 - 2 weeks, 4 = monthly,
             5 = per order,
             6 = do not apply
            * */
          ]
        }
        },
      watch:{
          bonusData: {
            handler: function () {
              this.disabled = false
            },
            deep:true
          }
      },
      created() {
        this.$schedsdk.getBonusSettings().then((result)=>{
        //Better Implementation needed to convert each value to string
           this.bonusData.enable_bonus=result.data.enable_bonus
           this.bonusData.enable_flat_bonus=result.data.enable_flat_bonus;
           this.bonusData.enable_tiered_bonus=result.data.enable_tiered_bonus;
           this.bonusData.flat_bonus_percent_product=result.data.flat_bonus_percent_product.toString();
           this.bonusData.flat_bonus_percent_service=result.data.flat_bonus_percent_service.toString();
           this.bonusData.gross_sales_calculation_period=result.data.gross_sales_calculation_period.toString();
           this.bonusData.gross_sales_slab_products=result.data.gross_sales_slab_products;
        this.bonusData.gross_sales_slab_products.forEach((v) => {
             v.gross_sale_from = v.gross_sale_from.toString();
             v.gross_sale_to = v.gross_sale_to.toString();
             v.bonus_percent = v.bonus_percent.toString();
           }
           )
           this.bonusData.gross_sales_slab_services=result.data.gross_sales_slab_services;
        this.bonusData.gross_sales_slab_services.forEach((v) => {
            v.gross_sale_from = v.gross_sale_from.toString();
            v.gross_sale_to = v.gross_sale_to.toString();
            v.bonus_percent = v.bonus_percent.toString();
          }
        )
           this.bonusData.minimum_sale_flat=result.data.minimum_sale_flat.toString();
          if(result.data.gross_sales_slab_products.length===0){
            this.addItem(this.bonusData.gross_sales_slab_products)
          }
          if(result.data.gross_sales_slab_services.length===0){
            this.addItem(this.bonusData.gross_sales_slab_services)
          }
        });
      },
      methods:{
          removeItem(item,array){
            let index=array.indexOf(item);
            if(index > -1 && array.length !==1) {
              array.splice(index, 1)
            }
          },
          addItem(array){
        array.push({gross_sale_from: '0', gross_sale_to: '0', bonus_percent: '0'})
          },
        updateBonus(){
            this.disabled=true;
            this.spinner=true;
            this.$schedsdk.updateBonusSettings(this.bonusData).then(()=>{
              this.spinner=false
              this.disabled=false;
            })
        }
      }
    }
</script>

<style>
div.form-switch input.form-check-input {
  width: 2.8rem;
  height: 22px;
}
</style>
