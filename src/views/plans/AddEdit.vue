<template>
  <div>
    <CRow>
      <CCol sm="12">
        <Alerts 
          :alertData="alertData" 
          :show="show"
          @alertClosed="show = 0"
          v-if="alert" 
        />
        <form class="add-edit-plan-form" @submit.prevent="null">
          <div class="form-body float-label-white-bg">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group form-floating" >
                  <input 
                    :class={invalid:v$.plan_name.$error}
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    placeholder="Plan Name"
                    v-model="plan_name"
                    @blur="v$.plan_name.$touch()" 
                  />
                  <label class="control-label"><b>Plan Name</b></label>
                  <p class="error-msg" v-if="v$.plan_name.$dirty && v$.plan_name.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group form-floating">
                  <input class="form-control placeholder-no-fix"
                    type="text" 
                    placeholder="Plan ID"
                    v-model="plan_code"
                    :class={invalid:v$.plan_code.$error}
                    @blur="v$.plan_code.$touch()" 
                  />
                  <label class="control-label"><b>Plan ID</b></label>
                  <p class="error-msg" v-if="v$.plan_code.$dirty && v$.plan_code.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group form-floating">
                  <input class="form-control placeholder-no-fix"
                    type="text" 
                    placeholder="Plan Price"
                    v-model.number="plan_price"
                    :class={invalid:v$.plan_price.$error}
                    @blur="v$.plan_price.$touch()" 
                  />
                  <label class="control-label"><b>Plan Price</b></label>
                  <p class="error-msg" v-if="v$.plan_price.$dirty && v$.plan_price.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group form-floating">
                  <textarea class="form-control placeholder-no-fix"
                    type="text" 
                    placeholder="Plan Description"
                    v-model="plan_description"
                    ></textarea>
                  <label class="control-label"><b>Plan Description</b></label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group d-sm-flex justify-content-between" >
                    <label class="control-label mt-2">Discount for other services (%)</label>
                    <div class="post-icon col-md-3">
                      <input 
                      class="form-control placeholder-no-fix" 
                      type="text" 
                      v-model.number="discount_percent_for_services"
                      />
                      <span class="label-icon">%</span> 
                    </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group d-sm-flex justify-content-between" >
                    <label class="control-label mt-2">Discount for other products (%)</label>
                    <div class="post-icon col-md-3">
                    <input 
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    v-model.number="discount_percent_for_products"
                    />
                    <span class="label-icon">%</span> 
                </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group d-sm-flex justify-content-between" >
                    <label class="control-label mt-2">Recurring every</label>
                    <div class="post-icon col-md-6 post-month-text">
                    <input 
                      class="form-control placeholder-no-fix no-spinners" 
                      type="number" 
                      v-model.number="plan_recurring_month"
                      :class={invalid:v$.plan_recurring_month.$error}
                      @blur="v$.plan_recurring_month.$touch()"
                    />
                    <span class="label-icon">months</span> 
                    </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group d-md-flex align-items-start">
                  <label class="control-label pe-2">First bill: </label>
                  <div class="pe-3">
                    <input type="radio" class="pt-1 position-relative" style="top: 2px;" v-model="plan_first_bill" id="plan_first_bill_immediately" value="immediately">
                    <label for="plan_first_bill_immediately" class="ps-1 mt-0">immediately</label>
                  </div>
                  <div>
                    <input type="radio" class="position-relative" style="top: -1px;" v-model="plan_first_bill" id="plan_first_bill_particular_day" value="particular_day">
                    <span>
                      <label for="plan_first_bill_particular_day" class="control-label mt-0 ps-1 ">day of month</label>
                      <input v-if="plan_first_bill == 'particular_day'" class="form-control placeholder-no-fix no-spinners"
                        type="number" 
                        v-model.number="plan_first_bill_day"
                        :class={invalid:v$.plan_first_bill_day.$error}
                        @blur="v$.plan_first_bill_day.$touch()" 
                      />
                    </span>
                  </div> 
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-12">
                  <button type="button" @click="addEditPlan" class="btn btn-success float-end">{{add_edit_string}} Plan</button>
              </div>
            </div>
          </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { Icon } from '@/common/Icon';
import Alerts from '../Alerts'
import { required, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import moment from 'moment-timezone'

export default {
  name: 'Add Edit Package',
  components:{
    Alerts, 
    Icon
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return({
      alert: false,
      show: 0,
      alertData: {
        message: '',
        type: ''
      },
      _id: null,
      add_edit_string: "Add",
      plan_name: null,
      plan_code: null,
      plan_price: null,
      package_items: [],
      plan_description: null,
      discount_percent_for_services: null,
      discount_percent_for_products: null,
      plan_recurring_month: null,
      plan_first_bill: null,
      plan_first_bill_day: null
    })
  },
  validations() {
    return {
      plan_name: {
        required
      },
      plan_code: {
        required
      },
      plan_price: {
        required
      },
      plan_recurring_month: {
        required
      },
      plan_first_bill: {
        required
      },
      plan_first_bill_day: {
        required: requiredIf(() => this.plan_first_bill == 'particular_day')
      }
    }
  },
  created() {
    const plan_id = this.$route.params.plan_id || null;
    if (plan_id) {
      this.add_edit_string = "Update"
      this.getPlanDetail(plan_id);
    }
  },
  methods: {
    async addEditPlan(e) {
      e.preventDefault();
      this.v$.$touch();

      if(!this.v$.$invalid) {
        try {
          const timezone = this.$store.state.business_settings.business_time_zone;
          const plan_id = this.$route.params.plan_id || null;
          let sdk_method_name = "add_package";

          let data = {
            is_package_recurr_allowed: true,
            hint_plan_type_recurring_package: true,
            package_type: 5,
            _id: this._id,
    
            package_name: this.plan_name,
            package_code: this.plan_code,
            package_purchase_price: this.plan_price,
            package_value: this.plan_price,
            package_description: this.plan_description,
            package_items: this.package_items,
    
            discount_percent_for_services: this.discount_percent_for_services,
            discount_percent_for_products: this.discount_percent_for_products,
    
            plan_recurring_month: this.plan_recurring_month,
            plan_first_bill: this.plan_first_bill,
            plan_first_bill_day: this.plan_first_bill_day,

            package_valid_from_date: moment.tz(moment().format('YYYY-MM-DD'), timezone).valueOf(),
            package_valid_to_date: moment.tz(moment().add(100, "y").format('YYYY-MM-DD'), timezone).valueOf(),
          }
          
          if (plan_id) {
            sdk_method_name = "edit_package";
          }

          const response = await this.$schedsdk[sdk_method_name](data);
          if (response.status == 1) {
            this.$router.push('/plans/list');
          } else {
            this.alertData = {
              message: response.message,
              type: 'danger'
            }
            this.alert = true;
            this.show = 4;
          }
        } catch (error) {
          this.alertData = {
            message: error.data.message || "Something went wrong.",
            type: 'danger'
          }
          this.alert = true;
          this.show = 4;
        }
      }
    },
    async getPlanDetail(plan_id) {
      try {
        const response = await this.$schedsdk.get_package_detail({
          package_id: plan_id
        });
        if (response.status == 1) {
          const plan = response.data;
          this._id = plan._id;
          this.plan_name = plan.package_name; 
          this.plan_code = plan.package_code; 
          this.plan_price = plan.package_value; 
          this.package_items = plan.package_items; 
          this.plan_description = plan.package_description; 
          this.discount_percent_for_services = plan.discount_percent_for_services; 
          this.discount_percent_for_products = plan.discount_percent_for_products; 
          this.plan_recurring_month = plan.plan_recurring_month; 
          this.plan_first_bill = plan.plan_first_bill; 
          this.plan_first_bill_day = plan.plan_first_bill_day; 
        } else {
          this.alertData = {
            message: response.message,
            type: 'danger'
          }
          this.alert = true;
          this.show = 4;
        }
      } catch (error) {
        this.alertData = {
          message: error.data.message || "Something went wrong.",
          type: 'danger'
        }
        this.alert = true;
        this.show = 4;
      }
    }
  }
}
</script>