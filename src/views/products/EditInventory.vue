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
                <form class="edit-inventory-form" @submit.prevent="editInventory">
                    <div class="form-body">
                        <!-- <div class="row">
                            <template v-for="(uom_item, index) in form.inventory_data.related_uom_arr" :key="index">
                                <div>
                                    <label class="control-label"><b>convertor to base</b></label>
                                    <input class="form-control placeholder-no-fix"
                                        type="text" 
                                        v-model.number="form.inventory_data.related_uom_arr[index].convertor_to_base"
                                        :class={invalid:v$.form.inventory_data.related_uom_arr.$each.$response.$errors[index].convertor_to_base.length}
                                    />
                                    <p class="error-msg" v-if="v$.form.inventory_data.related_uom_arr.$each.$response.$errors[index].convertor_to_base.length && !v$.form.inventory_data.related_uom_arr.$each.$response.$data[index].convertor_to_base.required">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.inventory_data.related_uom_arr.$each.$response.$errors[index].convertor_to_base.length && !v$.form.inventory_data.related_uom_arr.$each.$response.$data[index].convertor_to_base.minVal">convertor to base must be greater than 0.</p>
                                </div>

                                <div>
                                    <label class="control-label"><b>relation name</b></label>
                                    <input class="form-control placeholder-no-fix"
                                        type="text" 
                                        v-model="form.inventory_data.related_uom_arr[index].relation_name"
                                        :class={invalid:v$.form.inventory_data.related_uom_arr.$each.$response.$errors[index].relation_name.length}
                                    />
                                    <p class="error-msg" v-if="v$.form.inventory_data.related_uom_arr.$each.$response.$errors[index].relation_name.length && !v$.form.inventory_data.related_uom_arr.$each.$response.$data[index].relation_name.required">This field must not be empty.</p>
                                </div>

                                <div>
                                    <label class="control-label"><b>Unit of measure</b></label>
                                    <v-select 
                                        v-model="form.inventory_data.related_uom_arr[index].uom" label="name" :options="uomData"
                                        :filter-by="filterUoms"
                                        :reduce="st => st.code"
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
                                    <p class="error-msg" v-if="v$.form.inventory_data.related_uom_arr.$each.$response.$errors[index].uom.length && !v$.form.inventory_data.related_uom_arr.$each.$response.$data[index].uom.required">This field must not be empty.</p>
                                </div>
                            </template>
                        </div> -->
                        
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <div class="mb-2"><b>Product Name:</b> {{productInfo.name}}</div>   
                                <div><b>Category:</b> {{productInfo.product_category?.name}}</div> 
                                <div><b>Instructions:</b> Setup inventory tracking Unit of Measure (UOM) to Sales Unit of Measure.</div> 
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Inventory reorder point quantity</b></label>
                                    <input class="form-control placeholder-no-fix"
                                        type="text" 
                                        v-model.number="form.inventory_data.inv_reorder_point_qty"
                                        :class={invalid:v$.form.inventory_data.inv_reorder_point_qty.$error}
                                        @blur="v$.form.inventory_data.inv_reorder_point_qty.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.inventory_data.inv_reorder_point_qty.$dirty && v$.form.inventory_data.inv_reorder_point_qty.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.inventory_data.inv_reorder_point_qty.$dirty && v$.form.inventory_data.inv_reorder_point_qty.minVal.$invalid">Inventory reorder point quantity must be greater than 0.</p>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Base unit of measure</b></label>
                                    <v-select 
                                        v-model="form.inventory_data.base_uom" label="name" :options="uomData"
                                        :filter-by="filterUoms"
                                        :reduce="st => st.code"
                                        @search:blur="v$.form.inventory_data.base_uom.$touch()"
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
                                    <p class="error-msg" v-if="v$.form.inventory_data.base_uom.$dirty && v$.form.inventory_data.base_uom.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <template v-for="(uom_item, index) in form.inventory_data.related_uom_arr" :key="index">
                                    <div class="tag-style">
                                        <span>{{uom_item.relation_name}} ({{uom_item.uom}} = {{uom_item.convertor_to_base}} {{form.inventory_data.base_uom}})</span>
                                        <button class="btn btn-close" aria-label="Remove item" @click="(e) => removeUomItem(index)"></button>
                                    </div>
                                </template>

                                <button class="btn btn-success" type="button" @click="show_uom_modal = true">Add related UOM</button>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Default Inventory Tracking UOM</b></label>
                                    <v-select 
                                        v-model="form.inventory_data.default_inventory_tracking_uom" label="name" :options="uomData"
                                        :filter-by="filterUoms"
                                        :reduce="st => st.code"
                                        @search:blur="v$.form.inventory_data.default_inventory_tracking_uom.$touch()"
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
                                    <p class="error-msg" v-if="v$.form.inventory_data.default_inventory_tracking_uom.$dirty && v$.form.inventory_data.default_inventory_tracking_uom.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Sales container packaging type</b></label>
                                    <v-select 
                                        v-model="form.inventory_data.sales_container_packing_type" label="name" :options="uomData"
                                        :filter-by="filterUoms"
                                        :reduce="st => st.code"
                                        @search:blur="v$.form.inventory_data.sales_container_packing_type.$touch()"
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
                                    <p class="error-msg" v-if="v$.form.inventory_data.sales_container_packing_type.$dirty && v$.form.inventory_data.sales_container_packing_type.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Sales to container uom</b></label>
                                    <input class="form-control placeholder-no-fix"
                                        type="text" 
                                        v-model.number="form.inventory_data.sales_2_container_uom_convertor"
                                        :class={invalid:v$.form.inventory_data.sales_2_container_uom_convertor.$error}
                                        @blur="v$.form.inventory_data.sales_2_container_uom_convertor.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.inventory_data.sales_2_container_uom_convertor.$dirty && v$.form.inventory_data.sales_2_container_uom_convertor.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.inventory_data.sales_2_container_uom_convertor.$dirty && v$.form.inventory_data.sales_2_container_uom_convertor.minVal.$invalid">Sales to container uom must be greater than 0.</p>
                                </div>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group d-flex" >
                                    <label class="control-label"><b>Quantity on hand:</b></label>
                                    <p class="ms-1 mb-0">{{form.inventory_data?.est_qoh}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group d-flex" >
                                    <label class="control-label"><b>Quantity for sale:</b></label>
                                    <p class="ms-1 mb-0">{{form.inventory_data?.est_qfs}}</p>   
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <button class="btn btn-success">Update Inventory</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
        <CModal :visible="show_uom_modal" @close="resetUomData">
            <CModalHeader>
                <CModalTitle>Add related UOM</CModalTitle>
            </CModalHeader>
            <form class="add-uom-form" @submit.prevent="addUomData">
            <CModalBody>
                <div class="form-body">

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group" >
                                <label class="control-label"><b>Relation name</b></label>
                                <input class="form-control placeholder-no-fix"
                                    type="text" 
                                    v-model="uom_data.relation_name"
                                    :class={invalid:v$.uom_data.relation_name.$error}
                                    @blur="v$.uom_data.relation_name.$touch()" 
                                />
                                <p class="error-msg" v-if="v$.uom_data.relation_name.$dirty && v$.uom_data.relation_name.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"><b>UOM</b></label>
                                <v-select 
                                    v-model="uom_data.uom" label="name" :options="uomData"
                                    :filter-by="filterUoms"
                                    :reduce="st => st.code"
                                    @search:blur="v$.uom_data.uom.$touch()"
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
                                <p class="error-msg" v-if="v$.uom_data.uom.$dirty && v$.uom_data.uom.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group" >
                                <label class="control-label"><b>Convertor to base</b></label>
                                <input class="form-control placeholder-no-fix"
                                    type="text" 
                                    v-model.number="uom_data.convertor_to_base"
                                    :class={invalid:v$.uom_data.convertor_to_base.$error}
                                    @blur="v$.uom_data.convertor_to_base.$touch()" 
                                />
                                <p class="error-msg" v-if="v$.uom_data.convertor_to_base.$dirty && v$.uom_data.convertor_to_base.required.$invalid">This field must not be empty.</p>
                                <p class="error-msg" v-if="v$.uom_data.convertor_to_base.$dirty && v$.uom_data.convertor_to_base.minVal.$invalid">convertor to base must be greater than 0.</p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group" >
                                <label class="control-label"><b>Base UOM</b></label>
                                <input 
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    readonly
                                    :value="form.inventory_data?.base_uom"
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="resetUomData" color="danger">Cancel</CButton>
                <CButton type="submit" color="success">Add</CButton>
            </CModalFooter>
            </form>
        </CModal>
    </div>
</template>

<script>
import { helpers, required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts';
import filterMixin from '@/mixins/filters';
import { pick } from "lodash";

export default {
    name: 'Edit Inventory',
    components: {
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return ({
            date_picker_config: {
                altFormat: "F j, Y",
                altInput: true
            },
            alert: false,
            show_uom_modal: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            uom_data: {
                "convertor_to_base": '',
                "relation_name": "",
                "uom": ""
            },
            form: {
                inventory_data: {
                    related_uom_arr: []
                }
            },
            productInfo: {},
            uomData: this.$store.state.uom_data
        });
    },
    created() {
        this.getProductDetail();
    },
    mixins: [filterMixin],
    validations: {
        form: {
            inventory_data: {
                inv_reorder_point_qty: {
                    required,
                    minVal: minValue(1)
                },
                base_uom: {
                    required
                },
                default_inventory_tracking_uom: {
                    required
                },
                sales_container_packing_type: {
                    required
                },
                sales_2_container_uom_convertor: {
                    required,
                    minVal: minValue(1)
                },
                // related_uom_arr: {
                //     $each: helpers.forEach({
                //         convertor_to_base: {
                //             required,
                //             minVal: minValue(1)
                //         },
                //         relation_name: {
                //             required
                //         },
                //         uom: {
                //             required
                //         }
                //     })
                // }
            }
        },
        uom_data: {
            convertor_to_base: {
                required,
                minVal: minValue(1)
            },
            relation_name: {
                required
            },
            uom: {
                required
            }
        }
    },
    methods: {
        getProductDetail() {
            this.$schedsdk.get_product_detail({product_id:this.$route.params.product_id}).then((result)=>{
                if (result.data.status) {
                    this.productInfo = result.data;
                    this.form.inventory_data = result.data.inventory_data;
                }
            });
        },
        editInventory() {
            let inventoryData = pick(this.form.inventory_data, ['base_uom', 'sales_2_container_uom_convertor', 'default_inventory_tracking_uom', 'inv_reorder_point_qty', 'sales_container_packing_type', 'related_uom_arr']);

            let productData = pick(this.productInfo, ['_id', 'name', 'price', 'status', "ean", "product_code"]);
            let formData = {};
            Object.assign(formData, productData, {"inventory_data": inventoryData});
            formData.product_category = this.productInfo.product_category._id;

            this.v$.form.$touch();
            if (!this.v$.form.$invalid) {
                this.$schedsdk.edit_product(formData).then((result) => {
                    if (result.status) {
                        this.$router.back();
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
        },
        mockRelatedUomItem() {
            return {
                "convertor_to_base": '',
                "relation_name": "",
                "uom": ""
            }
        },
        addUomData() {
            this.v$.uom_data.$touch();
            if (!this.v$.uom_data.$invalid) {
                this.addUomItem(this.uom_data);
            }
        },
        resetUomData() {
            this.v$.uom_data.$reset();
            this.show_uom_modal = false;
            this.uom_data = this.mockRelatedUomItem();
        },
        addUomItem(item = null) {
            item = item ?? this.mockRelatedUomItem();
            this.form.inventory_data.related_uom_arr.push(item);
            this.resetUomData();
        },
        removeUomItem(index) {
            this.form.inventory_data.related_uom_arr.splice(index, 1);
        }
    }
}
</script>