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
                <form class="add-stock-form" @submit.prevent="addStock">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Product Name/Code</b></label>
                                    <v-select 
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
                                    <p class="error-msg" v-if="v$.form.item_id.$dirty && v$.form.item_id.required.$invalid">Please select a product.</p>
                                    <!-- <input 
                                        :class={invalid:v$.form.product_name.$error}
                                        class="form-control placeholder-no-fix" 
                                        type="text" 
                                        v-model="form.product_name"
                                        @blur="v$.form.product_name.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.product_name.$dirty && v$.form.product_name.required.$invalid">This field must not be empty.</p> -->
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <!-- <label class="control-label"><b>Product Code</b></label>
                                    <input class="form-control placeholder-no-fix"
                                        type="text" 
                                        v-model="form.product_code"
                                        :class={invalid:v$.form.product_code.$error}
                                        @blur="v$.form.product_code.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.product_code.$dirty && v$.form.product_code.required.$invalid">This field must not be empty.</p> -->
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Stock Type</b></label>
                                    <v-select 
                                        v-model="form.stock_type" label="name" :options="stockType"
                                        :reduce="st => st.value"
                                        @search:blur="v$.form.stock_type.$touch()"
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
                                    <p class="error-msg" v-if="v$.form.stock_type.$dirty && v$.form.stock_type.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Paid Cost ({{currency_symbol}})</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model.number="form.paid_cost" 
                                        :class={invalid:v$.form.paid_cost.$error}
                                        @blur="v$.form.paid_cost.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.paid_cost.$dirty && v$.form.paid_cost.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.paid_cost.$dirty && v$.form.paid_cost.minVal.$invalid">price must be greater than 0.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Received unit of measure</b></label>
                                    <v-select 
                                        v-model="form.received_qty_uom" label="name" :options="uomData"
                                        :filter-by="filterUoms"
                                        :reduce="st => st.code"
                                        @search:blur="v$.form.received_qty_uom.$touch()"
                                    >
                                        <template v-slot:no-options>
                                            Type to search..
                                        </template>
                                        <template v-slot:option="option" >
                                            <div class="d-center">
                                                {{ option.description }}
                                            </div>
                                        </template>
                                        <template v-slot:selected-option="option" >
                                            <div class="selected d-center">
                                                {{ option.description }}
                                            </div>
                                        </template>
                                    </v-select>
                                    <p class="error-msg" v-if="v$.form.received_qty_uom.$dirty && v$.form.received_qty_uom.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Received Quantity</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model.number="form.received_qty" 
                                        :class={invalid:v$.form.received_qty.$error}
                                        @blur="v$.form.received_qty.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.received_qty.$dirty && v$.form.received_qty.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.received_qty.$dirty && v$.form.received_qty.minVal.$invalid">Received quantity must be greater than 0.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Received Date</b></label>
                                    <flat-pickr 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.received_date"
                                        :config="date_picker_config" 
                                        placeholder="Received Date"
                                        @blur="v$.form.received_date.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.received_date.$dirty && v$.form.received_date.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Received purchase order</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.received_purchase_order" 
                                        :class={invalid:v$.form.received_purchase_order.$error}
                                        @blur="v$.form.received_purchase_order.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.received_purchase_order.$dirty && v$.form.received_purchase_order.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-8">
                                <div class="form-group">
                                    <label class="control-label"><b>Notes</b></label>
                                    <textarea 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.notes" 
                                        :class={invalid:v$.form.notes.$error}
                                        @blur="v$.form.notes.$touch()"
                                        cols="30" rows="10"></textarea>

                                    <p class="error-msg" v-if="v$.form.notes.$dirty && v$.form.notes.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <button class="btn btn-success">Add Stock</button>
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
import AppHelper from "../../helpers/app_helper";
import 'flatpickr/dist/flatpickr.css';
import filterMixin from '@/mixins/filters';
import staticListMixin from '@/mixins/static-list';

export default {
    name: 'Add Stock',
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
            currency_symbol:this.$store.state.business_settings.business_currency_symbol,
               
            form: {
                item_id: '',
                // product_name: '',
                product_code: '',
                stock_type: '',
                product_price: '',
                received_qty: '',
                received_qty_uom: '',
                paid_cost: '',
                unit_cost: '',
                received_date: '',
                received_purchase_order: '',
                notes: ''
            },
            productsOption: [],
            uomData: this.$store.state.uom_data
        });
    },
    created() {
        this.getProductsList();
    },
    mixins: [filterMixin, staticListMixin],
    methods: {
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

        addStock() {
            this.v$.$touch();
            if (!this.v$.$invalid) {
                this.form.received_date = AppHelper.getTimestampFromDate(this.form.received_date, this.$store.state.business_settings.business_time_zone);
                let stockReceivedUnitCost = +(this.form.paid_cost / this.form.received_qty).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

                let formData = {
                    // "bin_tag": "",
                    // "closed_date": 0,
                    // "first_use_date": 0,
                    // "_id": "",
                    // "inventory_tracking_uom": "",
                    // "is_closed": false,
                    // "isSelected": false,
                    // "location": "",
                    // "sku": "",
                    // "upc": ""
                    // "name": this.form.product_name,

                    "item_id": this.form.item_id,
                    "received_date": this.form.received_date,
                    "received_qty_uom": this.form.received_qty_uom,
                    "stock_received_unit_cost": stockReceivedUnitCost,
                    "stock_received_notes": this.form.notes,
                    "stock_received_po": this.form.received_purchase_order,
                    "stock_received_qty": this.form.received_qty,
                    "stock_received_total_paid_cost": this.form.paid_cost,
                    "stock_type": this.form.stock_type,
                    "received_sales_qty": 0,
                    "stock_inventory_qty": this.form.received_qty,

                    // "sales_uom_on_receive": "",
                    // "stock_sales_unit_qty_on_hand": 0.0,
                    // "stock_sales_unit_cost": 0.0,
                };

                this.$schedsdk.add_stock(formData).then((result) => {
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
            item_id: {
                required
            },
            // product_name: {
            //     required
            // },
            // product_code: {
            //     required
            // },
            stock_type: {
                required
            },
            received_qty: {
                required,
                minVal: minValue(1)
            },
            paid_cost: {
                required,
                minVal: minValue(1)
            },
            received_qty_uom: {
                required
            },
            received_date: {
                required
            },
            received_purchase_order: {
                required
            },
            notes: {
                required
            }
        }
    },
}
</script>