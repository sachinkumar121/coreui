<template>
    <div>
        <CRow>
            <CCol sm="12">
                <Alerts 
                    :alertData="alertData" 
                    :show="show"
                    @alertClosed="show = 0"
                    v-if="alert" />
                <form class="add-edit-quote-form" @submit.prevent="AddEditQuoteCategory">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Title</b></label>
                                    <input 
                                    :class={invalid:v$.title.$error}
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    v-model="title"
                                    @blur="v$.title.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.title.$dirty && v$.title.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Select day range of the year</b></label>
                                    <flat-pickr 
                                        :class={invalid:v$.date_range.$error}
                                        v-model="date_range"
                                        @on-close="setDateRange"
                                        :config="picker_config"
                                        class="form-control input-date-picker"
                                    />
                                    <p class="error-msg" v-if="v$.date_range.$dirty && v$.date_range.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="md-checkbox has-success">
                                    <input type="checkbox" 
                                        v-model="enable" 
                                        :checked="enable"
                                        class="md-check">
                                    &nbsp;<label><b>Enable</b></label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <button  class="btn btn-success">{{add_edit_string}} Quote Category</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import Alerts from '../Alerts'
import { helpers } from '@vuelidate/validators'

export default {
    name: 'Add_Edit_Quote_Category',
    components: {
        Alerts,
        flatPickr
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return({
            add_edit_string: "Add",
            quote_category_id: this.$route.params.quote_category_id,

            title: null,
            enable: true,
            start_doy: 0,
            end_doy: 0,
            date_range: null,
            picker_config: {
                minDate: new Date(new Date().getFullYear(), 0, 1), 
                maxDate: new Date(new Date().getFullYear(), 11, 31), 
                mode: 'range'
            },

            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            }
        })
    },
    validations: {
        title: {
            required
        },
        date_range: {
            required, mustHaveBothDates: (value, siblings, vm) => {
                return !helpers.req(value) || (vm.start_doy && vm.end_doy)
            }
        }
    },
    async created() {
        this.add_edit_string = this.quote_category_id ? "Update": "Add";
        if (this.quote_category_id) {
            await this.getQuoteCategoryInfo(this.quote_category_id);
        }
    },
    methods: {
        setDateRange(selectedDates) {
            const [start_doy, end_doy] = selectedDates.map(d => moment(d).dayOfYear());
            this.start_doy = start_doy;
            this.end_doy = end_doy;
        },
        convertDoyToDate(dayOfYear) {
            return moment().year(moment().year()).dayOfYear(dayOfYear).set({hour:0,minute:0,second:0,millisecond:0}).toDate();
        },
        async getQuoteCategoryInfo(id) {
            try {
                const response = await this.$schedsdk
                    .get_quote_category_detail(id);
                if (response.status) {
                    const { data } = response;
                    this.title = data.cmotd_category_title;
                    this.start_doy = data.cmotd_category_start_doy;
                    this.end_doy = data.cmotd_category_end_doy;
                    this.enable = data.cmotd_category_enabled;
                    this.date_range = [this.start_doy, this.end_doy].map(d => this.convertDoyToDate(d));
                    console.log(this.date_range);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async AddEditQuoteCategory(e) {
            e.preventDefault();
            this.v$.$touch();
            if (!this.v$.$invalid) {
                
                try {
                    const data = { 
                        title: this.title, 
                        enable: this.enable,
                        start_doy: this.start_doy,
                        end_doy: this.end_doy
                    };
                    let sdkMethod = "add_quote_category";
                    if (this.quote_category_id) {
                        sdkMethod = "edit_quote_category";
                        data._id = this.quote_category_id;
                    }
                    const response = await this.$schedsdk[sdkMethod](data);
                    if (response.status) {
                        this.$router.push({ path: "/quote-categories/list" });
                    } else {
                        this.showAlert(response);
                    }
                } catch (error) {
                    this.showAlert(error);
                }
            }
        },
        showAlert(error) {
            this.alertData = {
                message: error?.data?.message || error.message || error,
                type: 'danger'
            }
            this.alert = true;
            this.show = 4;
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