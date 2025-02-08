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
                <form class="add-subject-form" @submit.prevent="addEditSubject">
                    <div class="form-body">
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Name</b></label>
                                    <input 
                                        type="name"
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.name" 
                                        :class={invalid:v$.form.name.$error}
                                        @blur="v$.form.name.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.name.$dirty && v$.form.name.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Code</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.code" 
                                        :class={invalid:v$.form.code.$error}
                                        @blur="v$.form.code.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.code.$dirty && v$.form.code.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <div class="form-group">
                                    <label class="control-label"><b>Description</b></label>
                                    <textarea 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.description" 
                                        :class={invalid:v$.form.description.$error}
                                        @blur="v$.form.description.$touch()" 
                                        placeholder="Subject description"
                                    ></textarea>
                                    <p class="error-msg" v-if="v$.form.description.$dirty && v$.form.description.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <button class="btn btn-success float-end">{{ operationName == 'edit' ? 'Update' : 'Add'}} Subject</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts';

export default {
    name: 'Add/Edit Subject',
    components: {
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return ({
            operationName: "add",
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            form: {
                "_id": null,
                name: '',
                code: '',
                description: ''
            }
        });
    },
    created() {
        let subjectId = this.$route.params.id;
        let that = this;
        if (subjectId) {
            this.$schedsdk.get_subject_detail(subjectId).then(function(result) {
                if (result.status) {
                    let subjectData = result.data;

                    that.form._id = subjectData._id;
                    that.form.name = subjectData.name;
                    that.form.code = subjectData.code;
                    that.form.description = subjectData.description;
                }
            });
            this.operationName = "edit";
        }
    },
    validations: {
        form: {
            name: {
                required
            },
            code: {
                required
            },
            description: {
                required
            }
        }
    },
    methods: {
        addEditSubject() {
            this.v$.$touch();
            if(!this.v$.$invalid) {
                let subjectId = this.$route.params.id;
                let that = this;
                let sdkFunctionPromise = this.operationName == "edit" ? this.$schedsdk['update_subject'](subjectId, this.form) : this.$schedsdk['add_subject'](this.form);
                
                sdkFunctionPromise.then(function(result) {
                    if (result.status) {
                        that.$router.push("/subjects");
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
}

</script>