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
                <form class="add-edit-resource-type-form" @submit.prevent="addEditResourceType">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Group Name</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.group_name" 
                                        :class={invalid:v$.form.group_name.$error}
                                        @blur="v$.form.group_name.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.group_name.$dirty && v$.form.group_name.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <input 
                                        class="form-check-input"
                                        type="checkbox"
                                        v-model="form.is_active" 
                                        :class={invalid:v$.form.is_active.$error}
                                        @blur="v$.form.is_active.$touch()" 
                                    /> &nbsp;
                                    <label class="control-label"><b>Activate</b></label>
                                    
                                    <p class="error-msg" v-if="v$.form.is_active.$dirty && v$.form.is_active.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            
                            <div class="col-md-1" v-if="form.available_attributes.length">
                                Attributes:
                            </div>
                            <div class="col-md-8 mb-3">
                                <template v-for="(available_attribute, index) in form.available_attributes" :key="index">
                                    <div class="tag-style">
                                        <span>{{ available_attribute.name }}</span>
                                        <button class="btn btn-close" aria-label="Remove item" @click="(e) => removeAttributeItem(index)"></button>
                                    </div>
                                </template>
                            </div>
                        </div>
                        
                        <div class="row">
                             <div class="col-md-8 mb-3">
                                A group can contain attributes like 'floor' or 'capacity'. Add those attributes here:  <button class="btn btn-primary" type="button" @click="showAttributeModal"> Add attribute</button>
                             </div>


                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <button class="btn btn-success">{{ operationName == 'edit' ? 'Update' : 'Add'}} Resource Group</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
        <CModal :visible="show_attribute_modal" @close="hideAttributeModal">
            <CModalHeader>
                <CModalTitle>Add attribute</CModalTitle>
            </CModalHeader>
            <form class="add-attribute-form" @submit.prevent="addUomData">
                <CModalBody>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>Attribute Name</b></label>
                                <input class="form-control placeholder-no-fix"
                                    type="text" 
                                    v-model="attribute_data.name"
                                    :class={invalid:v$.attribute_data.name.$error}
                                    @blur="v$.attribute_data.name.$touch()" 
                                />
                                <p class="error-msg" v-if="v$.attribute_data.name.$dirty && v$.attribute_data.name.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>Type</b></label>
                                <v-select 
                                    v-model="attribute_data.type" label="name" :options="resourceAttributeType"
                                    :reduce="st => st.value"
                                    @search:blur="v$.attribute_data.type.$touch()"
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
                                <p class="error-msg" v-if="v$.attribute_data.type.$dirty && v$.attribute_data.type.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"><b>Description</b></label>
                                <textarea class="form-control" id="description" rows="3" v-model="attribute_data.attrib_description"
                                :class={invalid:v$.attribute_data.attrib_description.$error}
                                @blur="v$.attribute_data.attrib_description.$touch()" 
                                ></textarea>
                                <p class="error-msg" v-if="v$.attribute_data.attrib_description.$dirty && v$.attribute_data.attrib_description.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton type="button" color="secondary" @click="hideAttributeModal">Close</CButton>
                    <CButton color="primary" 
                    @click="addAttributeData" class="btn btn-success">Save changes</CButton>
                </CModalFooter>
            </form>
        </CModal>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts';
import staticListMixin from '@/mixins/static-list';

export default {
    name: 'Add/Edit Resource Group',
    components: {
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    mixins: [staticListMixin],
    data() {
        return ({
            operationName: "add",
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            attribute_data: {
                "name": "",
                "type": "",
                "attrib_description": ""
            },
            show_attribute_modal: false,
            form: {
                "_id": null,
                group_name: '',
                is_active: true,
                available_attributes: []
            }
        });
    },
    created() {
        let resourceTypeId = this.$route.params.id;
        let that = this;
        if (resourceTypeId) {
            this.$schedsdk.get_resource_group(resourceTypeId).then(function(result) {
                if (result.status) {
                    let resourceTypeData = result.data;
                    that.form.group_name = resourceTypeData.group_name;
                    that.form.is_active = resourceTypeData.is_active;
                    that.form.available_attributes = resourceTypeData.available_attributes;
                    that.form._id = resourceTypeData._id;
                }
            });
            this.operationName = "edit";
        }
    },
    validations: {
        form: {
            group_name: {
                required
            },
            is_active: {
                required
            }
        },
        attribute_data: {
            name: {
                required
            },
            type: {
                required
            },
            attrib_description: {
                required
            }
        }
    },
    methods: {
        showAttributeModal() {
            this.show_attribute_modal = true;
        },
        hideAttributeModal() {
            this.v$.attribute_data.$reset();
            this.show_attribute_modal = false;
        },
        mockAttributeItem() {
            return {
                "attrib_description": "",
                "name": "",
                "type": ""
            }
        },
        addAttributeData() {
            this.v$.attribute_data.$touch();
            if (!this.v$.attribute_data.$invalid) {
                this.addAttributeItem(this.attribute_data);
            }
        },
        resetAttributeData() {
            this.v$.attribute_data.$reset();
            this.show_attribute_modal = false;
            this.attribute_data = this.mockAttributeItem();
        },
        addAttributeItem(item = null) {
            item = item ?? this.mockAttributeItem();
            this.form.available_attributes.push(item);
            this.resetAttributeData();
        },
        removeAttributeItem(index) {
            this.form.available_attributes.splice(index, 1);
        },
        addEditResourceType() {
            let that = this;
            let sdkFunction = this.operationName == "edit" ? "edit_resource_groups" : "add_resource_groups";
            this.$schedsdk[sdkFunction](this.form).then(function(result) {
                if (result.status) {
                    that.$router.push("/resources/types");
                } else {
                    that.alertData = {
                        message: result.message,
                        type:'danger'
                    }
                    that.alert = true;
                    that.show = 4;
                }
            }).catch((error) => {
                this.alertData = {
                    message: error.data.message || error.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        }
    }
}

</script>