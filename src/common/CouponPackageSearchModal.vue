<template>
    <CModal 
        :visible="show"
        aria-labelledby="CouponPackageSearchModal"
        @close="onModalClose"
        :unmount-on-close="true"
    >
        <CModalHeader>
            <CModalTitle id="CouponPackageSearchModal">Coupon Package</CModalTitle>
        </CModalHeader>
        <CModalBody class="text-center">
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group text-start">
                        <label class="control-label"><b>Coupon Code</b></label>
                        <v-select 
                            v-model="selected_coupon_code" 
                            :options="coupon_list"
                            label="coupon_name">
                        <template v-slot:no-options>
                            Type to search ..
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                            {{ option.coupon_name }}  ({{option.discount_type!=1?currency_symbol:""}}{{option.amount}}{{option.discount_type==1?"%":""}} off)
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                            {{ option.coupon_name }}  ({{option.discount_type!=1?currency_symbol:""}}{{option.amount}}{{option.discount_type==1?"%":""}} off)
                            </div>
                        </template>
                        </v-select>
                    </div>
                    <div class="form-group text-start" v-if="customer_id">
                        <label class="control-label"><b>Packages</b></label>
                        <v-select 
                            v-model="selected_package" 
                            :options="purchased_packages_list"
                            label="coupon_name">
                        <template v-slot:no-options>
                            Type to search ..
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                            {{ option.package_name }}({{ option.redemption_code }})
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                            {{ option.package_name }}({{ option.redemption_code }})
                            </div>
                        </template>
                        </v-select>
                    </div>
                </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="applyCode">
                Apply
            </CButton>
            <CButton color="secondary" @click="onModalClose">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
import { debounce } from 'lodash'

export default {
    name: 'CouponPackageSearchModal',
    emits: ['onClose', 'onApplyCode'],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        clearInput: {
            type: Boolean,
            default: false
        },
        customer_id: {
            type: String || null,
            default: null
        }
    },
    data() {
        return ({
            show: this.visible,
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            selected_coupon_code: null,
            selected_package: null,
            coupon_list: [],
            purchased_packages_list: []
        })
    },
    watch: {
        visible: function(newVal) {
            this.show = newVal;
        },
        customer_id: function(val) {
            if (val) {
                this.getPackagesList(val);
            } else {
                this.purchased_packages_list = [];
            }
        },
        clearInput(newValue) {
            if (newValue) {
                this.selected_coupon_code = "";
            }
        }
    },
    mounted() {
        this.getCouponsList();
        if (this.customer_id) {
            this.getPackagesList(this.customer_id);
        }
    },
    methods: {
        onModalClose() {
            this.$emit('onClose');
        },
        getCouponsList() {
            this.$schedsdk.getCouponsList({}).then((result)=>{
                if(result.status == 1){
                    this.coupon_list = result.data
                }
            })
        },
        getPackagesList(customer_id) {
            this.$schedsdk.get_purchased_packages({
                "package_name": "",
                "page_no": 1,
                "customer_id": customer_id,
                "show_used_up_packages": false,
                "show_incomplete_packages": false,
                "purchase_start_date": 0,
                "purchase_end_date": 0
            }).then((result)=>{
                if(result.status == 1){
                    this.purchased_packages_list = result.data
                }
            })
        },
        applyCode() {
            this.$emit('onApplyCode', {
                coupon_code: this.selected_coupon_code,
                package: this.selected_package,
            });
        }
    }
}
</script>