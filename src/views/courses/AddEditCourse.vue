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
                <form class="add-edit-course-form" @submit.prevent="addEditCourse">
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
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Course start date</b></label>
                                    <flat-pickr 
                                        v-model="form.course_start_date" :config="date_picker_config" placeholder="Start Date"
                                    />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Course end date</b></label>
                                    <flat-pickr 
                                        v-model="form.course_end_date" :config="date_picker_config" placeholder="End Date"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b> Type</b></label>
                                    <v-select 
                                        v-model="form.type" label="name" :options="classType"
                                        :reduce="st => st.value"
                                        @search:blur="v$.form.type.$touch()"
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
                                    <p class="error-msg" v-if="v$.form.type.$dirty && v$.form.type.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>

                            <!-- <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Status</b></label>
                                    <v-select 
                                        v-model="form.status" label="name" :options="classStatusType"
                                        :reduce="st => st.value"
                                        @search:blur="v$.form.status.$touch()"
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
                                    <p class="error-msg" v-if="v$.form.status.$dirty && v$.form.status.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div> -->
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
                                        placeholder="Course description"
                                    ></textarea>
                                    <p class="error-msg" v-if="v$.form.description.$dirty && v$.form.description.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Max Classes</b></label>
                                    <input 
                                        type="number"
                                        min="0"
                                        step="1"
                                        class="form-control placeholder-no-fix" 
                                        v-model.number="form.max_classes" 
                                        :class={invalid:v$.form.max_classes.$error}
                                        @blur="v$.form.max_classes.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.max_classes.$dirty && v$.form.max_classes.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <button class="btn btn-success float-end">{{ operationName == 'edit' ? 'Update' : 'Add'}} Course</button>
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
import moment from 'moment-timezone';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts';
import staticListMixin from '@/mixins/static-list';

export default {
    name: 'Add/Edit Course',
    components: {
        Alerts, flatPickr
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
            date_picker_config: {
				altFormat: "F j, Y",
                altInput: true
			},
            form: {
                // "_id": null,
                name: '',
                code: '',
                description: '',
                type: '1',
			    status: "active",
			    course_start_date: null,
			    course_end_date: null,
                max_classes: 0
            }
        });
    },
    created() {
        let courseId = this.$route.params.id;
        let that = this;
        if (courseId) {
            this.$schedsdk.get_course_detail(courseId).then(function(result) {
                if (result.status) {
                    let courseData = result.data;
                    // console.log(courseData.type)

                    // that.form._id = courseData._id;
                    that.form.name = courseData.name;
                    that.form.code = courseData.code;
                    that.form.description = courseData.description;
                    that.form.type = courseData.type;
                    that.form.status = courseData.status;
                    that.form.max_classes = courseData.max_classes;
                    that.form.course_start_date = courseData.course_start_date;
                    that.form.course_end_date = courseData.course_end_date;
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
            type: {
                required
            },
            // status: {
            //     required
            // },
            course_start_date: {
                required
            },
            course_end_date: {
                required
            },
            max_classes: {
                required
            },
            description: {
                required
            }
        }
    },
    methods: {
        async addEditCourse() {
            let courseId = this.$route.params.id;
            let timezone = this.$store.state.business_settings.business_time_zone;
            const isFormCorrect = await this.v$.form.$validate()
            // you can show some extra alert to the user or just leave the each field to show it's `$errors`.
            if (!isFormCorrect) return

            let that = this;
            this.form.course_start_date = moment.tz(moment(this.form.course_start_date).format('YYYY-MM-DD'), timezone).valueOf();
            this.form.course_end_date = moment.tz(moment(this.form.course_end_date).format('YYYY-MM-DD'), timezone).valueOf();

            let sdkFunctionPromise = this.operationName == "edit" ? this.$schedsdk['update_course'](courseId, this.form) : this.$schedsdk['add_course'](this.form);
            
            sdkFunctionPromise.then(function(result) {
                if (result.status) {
                    that.$router.push("/courses");
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