<template>
    <div>
        <CModal
            :visible="show"
            @close="close"
        >
            <CModalHeader>
                <CModalTitle>Add Product Category</CModalTitle>
            </CModalHeader>
            <form
                class="add-product-category-form"
                @submit.prevent="AddNewProductCat"
            >
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"
                                    ><b>Category Name</b></label
                                >
                                <input
                                    :class="{invalid: v$.cat_name.$error}"
                                    class="form-control placeholder-no-fix"
                                    type="text"
                                    v-model="cat_name"
                                    @blur="v$.cat_name.$touch()"
                                />
                                <p
                                    class="error-msg"
                                    v-if="
                                        v$.cat_name.$dirty &&
                                        v$.cat_name.required.$invalid
                                    "
                                >
                                    This field must not be empty.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"
                                    ><b>Description</b></label
                                >
                                <input
                                    class="form-control placeholder-no-fix"
                                    type="text"
                                    v-model="cat_desc"
                                    :class="{invalid: v$.cat_desc.$error}"
                                    @blur="v$.cat_desc.$touch()"
                                />
                                <p
                                    class="error-msg"
                                    v-if="
                                        v$.cat_desc.$dirty &&
                                        v$.cat_desc.required.$invalid
                                    "
                                >
                                    This field must not be empty.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="md-checkbox has-success">
                                <input
                                    id="mark-as-active"
                                    type="checkbox"
                                    v-model="status"
                                    :checked="status"
                                    class="md-check form-check-input"
                                />
                                <label class="ms-2 cursor-pointer" for="mark-as-active"><b>Mark as active</b> </label>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="close" color="danger">Discard</CButton>
                    <CButton type="submit" color="success">Save</CButton>
                </CModalFooter>
            </form>
        </CModal>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';

export default {
    watch: {
        visible: function (newVal) {
            this.show = newVal
        },
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        }
    },
    setup() {
        const cat_name = ref('');
        const cat_desc = ref('');

        const rules = {
            cat_name: {
                required,
            },
            cat_desc: {
                required,
            },
        };
        const v$ = useVuelidate(rules, {
            cat_name, cat_desc
        }, { $scope: false });

        return { cat_name, cat_desc, v$ }
    },
    data() {
        return {
            show: this.visible,
            status: true,
        }
    },
    methods: {
        close() {
            this.show = false;
            this.v$.$reset();
            this.$emit('close');
        },
        AddNewProductCat() {
            this.v$.$touch()
            let data = {
                name: this.cat_name,
                category_description: this.cat_desc,
                status: Number(this.status)
            }
                        
            if (!this.v$.cat_name.$invalid && !this.v$.cat_desc.$invalid) {
                this.$schedsdk
                    .add_product_category(data)
                    .then((result) => {
                        if (result.status == 1) {
                            this.$emit('success', result.data);
                        } else {
                            console.log(result.message);
                            this.$emit('error', result.message);
                        }
                    })
                    .catch((ex) => {
                        this.$emit('error', ex.data.message);
                    }).finally(() => {
                        this.close();
                    })
            }
        }
    },
}
</script>