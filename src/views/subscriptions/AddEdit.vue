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
        <form class="add-edit-subscription-form" @submit.prevent="null">
          <div class="form-body float-label-white-bg">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group form-floating" >
                  <input 
                    :class={invalid:v$.level_name.$error}
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    placeholder="Level Name"
                    v-model="level_name"
                    @blur="v$.level_name.$touch()" 
                  />
                  <label class="control-label"><b>Level Name</b></label>
                  <p class="error-msg" v-if="v$.level_name.$dirty && v$.level_name.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group form-floating">
                  <input class="form-control placeholder-no-fix"
                    type="number" 
                    min="1"
                    max="10"
                    placeholder="Level"
                    v-model="level"
                    :class={invalid:v$.level.$error}
                    @blur="v$.level.$touch()" 
                  />
                  <label class="control-label"><b>Level</b></label>
                  <p class="error-msg" v-if="v$.level.$dirty && v$.level.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group form-floating">
                  <v-select v-model="plan" :reduce="plan => plan._id" label="package_name"  :options="plans" :class="{'options-selected': plan}">
                    <template v-slot:no-options>
                      Type to search..
                    </template>
                    <template v-slot:option="option" >
                      <div class="d-center">
                      {{ option.package_name }}
                      </div>
                    </template>
                    <template v-slot:selected-option="option" >
                      <div class="selected d-center">
                      {{ option.package_name }}
                      </div>
                    </template>
                    </v-select>
                  <label class="control-label"><b>Plan</b></label>
                  <p class="error-msg" v-if="v$.plan.$dirty && v$.plan.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="row" v-if="show_business_type_menu">
              <div class="col-md-4">
                <div class="form-group form-floating">
                  <v-select multiple v-model="business_types" :reduce="t => t.type" label="name"  :options="business_type_options" :class="{'options-selected': plan}">
                    <template v-slot:no-options>
                      Type to search..
                    </template>
                    <template v-slot:option="option" >
                      <div class="d-center">
                      {{ option.name }}
                      </div>
                    </template>
                    <template v-slot:selected-option="option" >
                      <div class="selected d-center">
                      {{ option.name }}
                      </div>
                    </template>
                    </v-select>
                  <label class="control-label"><b>Business Type</b></label>
                  <p class="error-msg" v-if="v$.plan.$dirty && v$.plan.required.$invalid">This field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group form-floating">
                  <textarea class="form-control placeholder-no-fix"
                    type="text" 
                    placeholder="Level Description"
                    v-model="description"
                    ></textarea>
                  <label class="control-label"><b>Level Description</b></label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="md-checkbox has-success">
                  <input type="checkbox" 
                  v-model="is_active" 
                  :checked = is_active
                  class="md-check form-check-input">
                <label class="ms-2"><b>Is active?</b> </label>
              </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-12">
                  <button type="button" @click="addEditSubscription" class="btn btn-success float-end">{{add_edit_string}} Subscription</button>
              </div>
            </div>
          </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import Alerts from '../Alerts'
import { required, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { BUS_TYPE, USR_TYPE } from '@silverskysoft/skysched-schemas';

export default {
  name: 'Add Edit Package',
  components:{
    Alerts
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
      user_type: this.$store.state.user_data.type,
      show_business_type_menu: false,

      plans: [],
      business_type_options: Object.entries(BUS_TYPE).map(e => { return {type: e[1], name: e[0]}}),

      level_name: null,
      level: null,
      description: null,
      is_active: false,
      plan: null,
      business_types: [1],
    })
  },
  validations() {
    return {
      level_name: {
        required
      },
      level: {
        required
      },
      plan: {
        required
      },
      business_types: {
        required: requiredIf(() => this.user_type == USR_TYPE.UT_ADMIN)
      }
    }
  },
  async created() {
    await this.getPackages();
    if (this.user_type == USR_TYPE.UT_ADMIN) {
      this.show_business_type_menu = true;
    }
    const subscription_id = this.$route.params.subscription_id || null;
    if (subscription_id) {
      this.add_edit_string = "Update"
      this.getSubscriptionDetail(subscription_id);
    }
    else
    {
      this.is_active = true //keep is active true as default for creating new.
    }
  },
  methods: {
    async getPackages() {
      let data = {
        get_recurring_packages_only: true,
      }
      const response = await this.$schedsdk.get_packages_list(data);
      this.plans = response.status == 1 ? response.data : [];
    },
    async addEditSubscription(e) {
      e.preventDefault();
      this.v$.$touch();

      if(!this.v$.$invalid) {
        try {
          const subscription_id = this.$route.params.subscription_id || null;
          let sdk_method_name = "add_subscription";
          
          let data = {
            _id: this._id,
    
            level_name: this.level_name,
            level: this.level,
            is_active: this.is_active,
            description: this.description,
            allowed_business_types: this.business_types,
            associated_plan_id: this.plan
          }
          
          if (subscription_id) {
            sdk_method_name = "edit_subscription";
          }

          const response = await this.$schedsdk[sdk_method_name](data);
          if (response.status == 1) {
            this.$router.push('/subscriptions');
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
            message: error?.data?.message || "Something went wrong.",
            type: 'danger'
          }
          this.alert = true;
          this.show = 4;
        }
      }
    },
    async getSubscriptionDetail(subscription_id) {
      try {
        const response = await this.$schedsdk.get_subscription_detail(subscription_id);
        if (response.status == 1) {
          const subscription = response.data;
          this._id = subscription._id;
          this.level_name = subscription.level_name; 
          this.level = subscription.level; 
          this.is_active = subscription.is_active; 
          this.description = subscription.description; 
          this.plan = subscription.associated_plan_id; 
          this.business_types = subscription.allowed_business_types;
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