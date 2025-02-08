<template>
  <div class="form-loyalty">
      <CRow>
         <CCol xs="2" sm="3" md="3">
          <CFormSwitch class="mb-3" :checked="this.loyalty.set_loyalty_program" inline label="Enable Loyalty Program"
               v-model="this.loyalty.set_loyalty_program"/>
         </CCol>
        <CCol xs="2" sm="3" md="3">
          <CFormFloating class="mb-2">
          <CFormInput size="sm" v-model="this.loyalty.loyalty_program_name" type="text" id="loyaltyProgram" />
          <CFormLabel size="sm" for="loyaltyProgram">Loyalty Program Name</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol xs="2" sm="3" md="3">
          <CFormFloating class="mb-2">
            <CFormInput size="sm" v-model="this.loyalty.points_currency_name" type="text" id="pointsCurrency" />
            <CFormLabel size="sm" for="pointsCurrency">Points Currency Name</CFormLabel>
          </CFormFloating>
        </CCol>
      </CRow>
                
              
    <CRow>          
     <CContainer fluid class="mb-2">
      <CRow class="g-2 justify-content-start" v-for="(elem,i) in loyalty.earning_setup" :key="i" >
        <CCol xs="2" sm="3" md="3">
          <br/>
          <p>{{elem.event_name}}</p>
        </CCol>
        <CCol xs="4" sm="3" md="3">
          <CFormFloating size="sm" class="mb-2 p-0">
            <CFormInput  size="sm" v-model="elem.points" type="number" id="floatingInput" placeholder="Points" />
            <CFormLabel  size="sm" for="floatingInput">Points</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol v-if="elem.event_name==='Sales'" xs="4" sm="3" md="3">
          <CFormSelect size="sm" class="mb-2" v-model="elem.points_type" aria-label="Small select example">
            <option value="1">Points</option>
            <option value="2">Times amount paid points</option>
          </CFormSelect>
        </CCol>
        <CCol  xs="4" sm="3" md="3">
          <CFormFloating class="mb-2">
            <CFormInput size="sm" v-model="elem.max" type="number" id="floatingInput2" placeholder="Points" />
            <CFormLabel size="sm" for="floatingInput2">Max Points</CFormLabel>
          </CFormFloating>
        </CCol>
        <div></div>
        <CCol v-if="i===this.loyalty.earning_setup.length-1" xs="4" sm="3" md="3">
          <br/>
          <p>Points Expiry</p>
        </CCol>
        <CCol v-if="i===this.loyalty.earning_setup.length-1" xs="6" sm="8" md="8">
          <CFormFloating class="mb-2">
           <CFormInput size="sm" v-model="this.loyalty.points_expiry" type="number" id="PointsExpiry"  />
            <CFormLabel size="sm" for="PointsExpiry">Points Expiry</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol v-if="i===this.loyalty.earning_setup.length-1" xs="4" sm="3" md="3">
          <br/>
          <p>Events activation days</p>
        </CCol>
        <CCol v-if="i===this.loyalty.earning_setup.length-1" xs="6" sm="8" md="8">
          <CFormFloating class="mb-2">
            <CFormInput size="sm" v-model="this.loyalty.activation_days" type="number" id="activationDays"  />
            <CFormLabel size="sm" for="activationDays">Activation days</CFormLabel>
          </CFormFloating>
        </CCol>
      </CRow>
    </CContainer>
    </CRow>
    <CFormSwitch class="mb-3" label="Force expire at end of calender year" :checked="this.loyalty.force_expire" inline
                 v-model="this.loyalty.force_expire"/>
    <div class="d-flex justify-content-between gap-2 mt-4 mb-2">
      <CButton class="" color="secondary" v-on:click="this.$router.replace('/settings/loyalty')">
          Cancel
      </CButton>
      <CButton :disabled="disabled" class="btn btn-success" color="primary" v-on:click="updateLoyaltySetup()">
        <CSpinner aria-hidden="true" component="span" size="sm" v-if="spinner"/>
        Submit
      </CButton>
    </div>
  </div>

</template>
<script>
    export default {
      name: "loyaltySetup",
      data() {
        return {
          spinner:false,
          disabled:true,
          loyalty: {
            set_loyalty_program: false,
            loyalty_program_name: "",
            points_currency_name: "",
            activation_days: '0',
            points_expiry: '0',
            force_expire: false,
            fixed_conversions: false,
            earning_setup: [
              {
                event_name: "Signup",
                points: '0',
                points_type: '0',
                max: '0',
                revenue_attached_event: false,
                points_is_multiplier_of_revenue: false,
              }
            ]
          }
        }
      },
      created() {
          this.$schedsdk.getLoyalty().then((result)=>{
                this.loyalty=result.data
            this.loyalty.activation_days= this.loyalty.activation_days.toString();
            this.loyalty.points_expiry= this.loyalty.points_expiry.toString();
            this.loyalty.earning_setup.forEach((v) => {
                v.points = v.points.toString();
                v.max = v.max.toString();
                v.points_type = v.points_type.toString();
              }
            )
            this.disabled=false
          })
      },
      methods:{
        updateLoyaltySetup(){
          this.spinner=true
          this.disabled = true
          this.$schedsdk.postLoyalty(this.loyalty).then(()=>{
            this.spinner=false;
            this.disabled=false
          })
        }
      }
    }
</script>

<style scoped>

</style>
