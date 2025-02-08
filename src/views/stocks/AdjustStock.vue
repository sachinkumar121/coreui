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
                <form class="adjust-stock-form" @submit.prevent="adjustStock">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Product Name/Code</b></label>
                                    <v-select 
                                        :disabled="true"
                                        v-model="form.item_id" label="name" :options="productsOption"
                                        :reduce="p => p._id"
                                        :filter-by="filterProducts"
                                        @search:blur="v$.form.item_id.$touch()"
                                    >
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
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Adjust Type</b></label>
                                    <v-select 
                                        v-model="form.adjust_type" label="name" :options="adjustType"
                                        :reduce="st => st.value"
                                        @search:blur="v$.form.adjust_type.$touch()"
                                    >
                                        <template v-slot:no-options>
                                            Type to search..
                                        </template>
                                        <template v-slot:option="option" >
                                            <div class="d-center">
                                                {{ option.label }}
                                            </div>
                                        </template>
                                        <template v-slot:selected-option="option" >
                                            <div class="selected d-center">
                                                {{ option.label }}
                                            </div>
                                        </template>
                                    </v-select>
                                    <p class="error-msg" v-if="v$.form.adjust_type.$dirty && v$.form.adjust_type.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <div class="form-group">
                                    <label class="control-label"><b>Stock(Date/Rcv. Qty/Unit Cost)</b></label>
                                    <input 
                                        readonly
                                        class="form-control placeholder-no-fix" 
                                        :value="stockInfo"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Quantity on hand</b></label>
                                    <input 
                                        readonly
                                        class="form-control placeholder-no-fix" 
                                        :value="stock?.stock_sales_unit_qty_on_hand"
                                    />
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>New quantity on hand</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model.number="form.new_qoh" 
                                        :class={invalid:v$.form.new_qoh.$error}
                                        @blur="v$.form.new_qoh.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.new_qoh.$dirty && v$.form.new_qoh.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.new_qoh.$dirty && v$.form.new_qoh.minVal.$invalid">Quantity must be greater than 0.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Cost per Unit</b></label>
                                    <input 
                                        readonly
                                        class="form-control placeholder-no-fix" 
                                        :value="stock?.stock_sales_unit_cost"
                                    />
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>New Cost per Unit</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model.number="form.unit_cost" 
                                        :class={invalid:v$.form.unit_cost.$error}
                                        @blur="v$.form.unit_cost.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.unit_cost.$dirty && v$.form.unit_cost.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.unit_cost.$dirty && v$.form.unit_cost.minVal.$invalid">Unit cost must be greater than 0.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <button class="btn btn-success">Adjust Stock</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts';
import flatPickr from 'vue-flatpickr-component';
import moment from 'moment';
import 'flatpickr/dist/flatpickr.css';
import filterMixin from '@/mixins/filters';
import staticListMixin from '@/mixins/static-list';

export default {
    name: 'Adjust Stock',
    components: {
        Alerts,
        flatPickr
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return ({
            date_picker_config: {
                altFormat: "F j, Y",
                altInput: true
            },
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            form: {
                item_id: '',
                item_stock_id: '',
                adjust_type: '',
                new_qoh: '',
                unit_cost: ''
            },
            productsOption: [],
            stock: null
        });
    },
    created() {
        this.getStock();
    },
    mixins: [filterMixin, staticListMixin],
    computed: {
        stockInfo() {
            return this.stock ? `${this.getFormattedDate(this.stock.received_date)}/${this.stock.stock_received_qty}/${this.stock.stock_received_unit_cost}` : '';
        }
    },
    methods: {
        getStock() {
            this.$schedsdk.get_stock_list({
                stock_id_arr: [this.$route.params.id]
            }).then((result) => {
                if (result.data.length) {
                    this.stock = result.data[0];
                    this.form.item_id = this.stock.item_id;
                    this.getProductsList();
                } else {
                    this.$router.push('/dashboard');
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        getProductsList() {
            this.$schedsdk.get_products_list({}).then((result)=>{
                if (result.status) {
                    this.productsOption = result.data;
                }
            }).catch((error) => {
                this.alertData = {
                    message: error.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        },

        getFormattedDate(dt_unix) {
            if (dt_unix == null || dt_unix == 0)
            {
                return dt_unix;
            }
            return moment(dt_unix).format("DD MMM YYYY");
        },

        adjustStock() {
            this.v$.$touch();
            if (!this.v$.$invalid) {

                let formData = {
                    "item_id": this.stock.item_id,
                    "item_stock_id": this.$route.params.id,
                    "adjust_type": this.form.adjust_type,
                    "new_qoh": this.form.new_qoh,
                    "unit_cost": this.form.unit_cost
                };

                // console.log(formData);
                // return;
                this.$schedsdk.adjust_stock(formData).then((result) => {
                    if (result.status) {
                        this.$router.push('/stocks/manage');
                    } else {
                        this.alertData = {
                            message: result.message,
                            type:'danger'
                        }
                        this.alert = true;
                        this.show = 4;
                    }
                }).catch((error) => {
                    this.alertData = {
                        message: error.data.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show = 4;
                });
            }
        }
    },
    validations: {
        form: {
            adjust_type: {
                required
            },
            unit_cost: {
                required,
                minVal: minValue(1)
            },
            new_qoh: {
                required,
                minVal: minValue(1)
            }
        }
    }
}
</script>