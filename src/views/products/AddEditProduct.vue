<template>
    <div>
        <CRow>
            <CCol sm="12">
                <Alerts
                    :alertData="alertData"
                    :show="show"
                    @alertClosed="alertClosedFn"
                    v-if="alert"
                />
                <form class="add-edit-product-form" @submit.prevent="submit">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Product Name</b></label
                                    >
                                    <input
                                        :class="{
                                            invalid: v$.product_name.$error,
                                        }"
                                        class="form-control placeholder-no-fix"
                                        type="text"
                                        v-model="product_name"
                                        @blur="v$.product_name.$touch()"
                                    />
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.product_name.$dirty &&
                                            v$.product_name.required.$invalid
                                        "
                                    >
                                        This field must not be empty.
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Product Code</b></label
                                    >
                                    <input
                                        class="form-control placeholder-no-fix"
                                        type="text"
                                        v-model="product_code"
                                        :class="{
                                            invalid: v$.product_code.$error,
                                        }"
                                        @blur="v$.product_code.$touch()"
                                    />
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.product_code.$dirty &&
                                            v$.product_code.required.$invalid
                                        "
                                    >
                                        This field must not be empty.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label w-100 d-flex justify-content-between flex-wrap"><b>Product Category</b><span @click="show_prod_cat_modal = true" class="link-style cursor-pointer">Add new category</span></label>
                                    <v-select
                                        v-model="product_category"
                                        label="name"
                                        :options="categories_option"
                                    >
                                        <template v-slot:no-options>
                                            Type to search Business name..
                                        </template>
                                        <template v-slot:option="option">
                                            <div class="d-center">
                                                {{ option.name }}
                                            </div>
                                        </template>
                                        <template
                                            v-slot:selected-option="option"
                                        >
                                            <div class="selected d-center">
                                                {{ option.name }}
                                            </div>
                                        </template>
                                    </v-select>
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.product_category.$dirty &&
                                            v$.product_category.required.$invalid
                                        "
                                    >
                                        Please select a product category.
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Product Price</b></label
                                    >
                                    <input
                                        class="form-control placeholder-no-fix"
                                        v-model="price"
                                        :class="{invalid: v$.price.$error}"
                                        @blur="v$.price.$touch()"
                                    />
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.price.$dirty &&
                                            v$.price.required.$invalid
                                        "
                                    >
                                        This field must not be empty.
                                    </p>
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.price.$dirty &&
                                            v$.price.minVal.$invalid
                                        "
                                    >
                                        price must be greater than 0.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Universal product Code</b></label
                                    >
                                    <input
                                        class="form-control placeholder-no-fix"
                                        type="text"
                                        v-model="upc"
                                    />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>European Article Number</b></label
                                    >
                                    <input
                                        class="form-control placeholder-no-fix"
                                        type="text"
                                        v-model="ean"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="md-checkbox has-success">
                                    <input
                                        type="checkbox"
                                        v-model="is_active"
                                        :checked="is_active"
                                        class="md-check form-check-input"
                                    />
                                    <label class="ms-2"
                                        ><b>Mark as active</b>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="row" v-if="isInventoryEnabled">
                            <div class="col-md-8">
                                <div
                                    class="text-muted"
                                    style="text-align: center"
                                >
                                    <label><b>Inventory</b></label>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="isInventoryEnabled">
                            <div class="col-md-4">
                                <div class="form-group d-flex">
                                    <label class="control-label"
                                        ><b>Qty on hand: </b></label
                                    ><br />
                                    <br />
                                    <p class="ms-1 mb-0">
                                        {{
                                            inventory_data?.est_qoh || 0
                                        }}
                                        (Measure:
                                        {{
                                            getUomDesc(
                                                inventory_data?.base_uom,
                                                inventory_data,
                                            )
                                        }}
                                        ) {{ getIncreaseDecreaseTag() }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>{{
                                            getPlaceHolderForNewQty()
                                        }}</b></label
                                    >
                                    <input
                                        v-model.number="adjust_qty"
                                        class="form-control placeholder-no-fix"
                                        type="text"
                                        :placeholder="getPlaceHolderForNewQty()"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="isInventoryEnabled">
                            <div class="col-md-4">
                                <div class="form-group d-flex">
                                    <label class="control-label"
                                        ><b>Cost per unit: </b></label
                                    ><br />
                                    <br />
                                    <p class="ms-1 mb-0">
                                        {{ currency_symbol
                                        }}{{
                                            inventory_stock_data?.stock_sales_unit_cost ||
                                            0
                                        }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>New Cost Per Unit</b></label
                                    >
                                    <input
                                        v-model.number="
                                            adjust_new_sales_unit_cost
                                        "
                                        class="form-control placeholder-no-fix"
                                        type="text"
                                        placeholder="New Cost Per Unit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <button
                                    class="btn btn-success float-end"
                                >
                                    {{
                                        operation == 'add' ? 'Add' : 'Update'
                                    }}
                                    Product
                                </button>
                                <button
                                    v-if="operation == 'edit' &&
                                        isInventoryEnabled &&
                                        !isUseSimplifiedInventory
                                    "
                                    type="button"
                                    @click="
                                        $router.push(
                                            `/products/${product_id}/inventory-data`,
                                        )
                                    "
                                    style="margin-left: 5px"
                                    class="btn btn-success btn-end"
                                >
                                    Edit Inventory Data
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
        <add-product-cat-modal 
            :visible="show_prod_cat_modal"
            @close="show_prod_cat_modal = false"
            @error="onError"
            @success="onCategoryAdd"
        />
    </div>
</template>
<script>
import {required, minValue} from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import Alerts from '@/views/Alerts'
import AddProductCatModal from '@/views/product_category/AddProductCatModal';

export default {
    name: 'AddEditProduct',
    setup: () => ({v$: useVuelidate()}),
    components: {
        Alerts, AddProductCatModal
    },
    data() {
        return {
            operation: 'add',
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
            inventory_data: null,
            inventory_stock_data: null,
            categories_option: [],
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: '',
            },
            product_id: '',
            product_name: '',
            product_code: '',
            product_category: '',
            price: 1,
            ean: '',
            upc: '',
            is_active: true,
            uomData: this.$store.state.uom_data,
            adjust_qty: null,
            adjusting_new_stock: false,
            adjust_new_sales_unit_cost: null,
            show_prod_cat_modal: false
        }
    },
    computed: {
        isInventoryEnabled() {
            return this.$store.state.business_settings.inventory_enabled
        },
        isUseSimplifiedInventory() {
            return this.$store.state.business_settings
                .use_simplified_inventory === undefined
                ? true
                : this.$store.state.business_settings.use_simplified_inventory
        },
    },
    validations: {
        product_name: {
            required,
        },
        product_code: {
            required,
        },
        price: {
            required,
            minVal: minValue(1),
        },
        product_category: {
            required,
        },
    },
    created() {
        this.getProductCategories()
        if (this.$route.params.product_id && 
            this.$route.params.product_id.length>3) 
        {
            this.operation = 'edit'
            this.getProductDetail()
        }
    },
    methods: {
        onCategoryAdd(category) {
            this.categories_option.push(category);
            this.product_category = category;
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
        getIncreaseDecreaseTag() {
            let str = ''
            if (this.adjust_qty !== null && this.adjust_qty != '') {
                if (this.adjusting_new_stock) {
                    str +=
                        ' increases by ' + Math.abs(this.adjust_qty) + ' items'
                } else {
                    let curr_qoh = this.inventory_data?.est_qoh || 0
                    let diff = this.adjust_qty - curr_qoh
                    if (diff < -0.0000001) {
                        str += ' reduces by ' + Math.abs(diff) + ' items'
                    } else {
                        str += ' increases by ' + Math.abs(diff) + ' items'
                    }
                }
            }
            return str
        },
        getPlaceHolderForNewQty() {
            let str = this.adjusting_new_stock
                ? 'Quantity received in stock delivery'
                : 'New Quantity on Hand'

            return str
        },
        getUomDesc(in_uom_code, id) {
            //console.log(in_uom_code, id, "Asdasd")
            if (!in_uom_code) {
                return in_uom_code
            }
            let uom_code = in_uom_code.toUpperCase()
            let uom_codeobj = this.uomData.filter((e) => {
                if (e.code == uom_code) {
                    //console.log(e.description)
                    // return e.description;
                    return true
                }
                return false
            })
            // console.log(uom_codeobj[0],"asdsadsa")
            if (uom_codeobj) {
                return uom_codeobj[0].description
            }
            return in_uom_code
        },
        getProductDetail() {
            this.$schedsdk
                .get_product_detail({
                    product_id: this.$route.params.product_id,
                    get_stock_data: this.isInventoryEnabled,
                })
                .then((result) => {
                    if (result.data.status == 1) {
                        this.product_id = result.data._id
                        this.product_name = result.data.name
                        this.product_code = result.data.product_code
                        this.product_category = result.data.product_category
                        this.price = result.data.price
                        this.ean = result.data.ean
                        this.upc = result.data.upc
                        this.is_active = result.data.status == 1 ? true : false
                        this.inventory_data = result.data.inventory_data
                        this.inventory_stock_data = result.data.inventory_stock
                    }
                })
        },
        isValidNumber(v) {
            if (v !== null && v !== '' && Number.isFinite(+v)) {
                return true
            }
            return false
        },
        submit(e) {
            e.preventDefault()
            this.v$.$touch()
            let data = {
                name: this.product_name,
                price: this.price,
                product_category: this.product_category._id,
                product_code: this.product_code,
                upc: this.upc,
                ean: this.ean,
                status: this.is_active == true ? 1 : 0,
            }
            if (this.operation == 'edit') 
            {
                data._id = this.product_id;
            }

            let vaq = this.isValidNumber(this.adjust_qty)
            let vsales = this.isValidNumber(this.adjust_new_sales_unit_cost)
            if (vsales && +this.adjust_new_sales_unit_cost < -0.000001) {
                this.alertData = {
                    message: 'Unit price cannot be negative',
                    type: 'danger',
                }
                this.alert = true
                this.show = 4
                return
            }
            data.adjust_stock_qty_count_data = {
                adjust_type: 1,
                item_id: data._id || null,
                new_qoh: vaq ? +this.adjust_qty : null,
                new_stock_sales_unit_cost: vsales
                    ? +this.adjust_new_sales_unit_cost
                    : null,
                is_valid: vaq || vsales ? true : false,
            }

            if (!this.v$.$invalid) 
            {
                this.alert = false
                let opProm = null
                if(this.operation == 'edit')
                {
                    opProm = this.$schedsdk.edit_product(data)
                }
                else
                {
                    opProm = this.$schedsdk.add_product(data)
                }
                
                opProm.then((result) => {
                        if (result.status == 1) {
                            this.$router.push('/products/list')
                        } else {
                            this.alertData = {
                                message: result.message,
                                type: 'danger',
                            }
                            this.alert = true
                            this.show = 4
                        }
                    })
                    .catch((ex) => {
                        this.alertData = {
                            message: ex.data.message,
                            type: 'danger',
                        }
                        this.alert = true
                        this.show = 4
                    })
            }
        },
        getProductCategories() {
            this.$schedsdk
                .get_product_category({})
                .then((result) => {
                    if (result.status == 1) {
                        this.categories_option = result.data
                    }
                })
                .catch((ex) => {
                    this.alertData = {
                        message: ex.message,
                        type: 'danger',
                    }
                    this.alert = true
                    this.show = 4
                })
        },
        alertClosedFn() {
            this.show = 0
        },

    },
}
</script>
<style scoped>
.invalid {
    border: 1px solid red;
    /* background-color: lightcoral; */
    color: red;
}
.error-msg {
    color: red;
}
</style>