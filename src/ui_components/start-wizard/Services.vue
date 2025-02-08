<template>
    <div class="card service-list">
        <TabAlert 
            v-if="show_error_data"
            icon="mdi:warning"
            class="error-msg-new"
            :type="errorData.type"
            :heading="errorData.heading"
            :subheading="errorData.subheading"
        />
        <div class="card-body pt-4 px-2 px-sm-3">
            <div>
                <div class="form-field-height">
                    <h6 class="mb-4">
                        Add at least 1 'Service Category' and 1 'Service'
                    </h6>

                    <div class="row mb-2" v-for="(service, index) in services" :key="index">
                        <div class="col-md-3 mb-2">
                            <div class="form-floating">
                                <input
                                    v-model="service.name"
                                    type="text"
                                    class="form-control"
                                    id="service-name"
                                    placeholder="1. Service name"
                                    :class="{
                                        invalid: formErrors[index]?.name,
                                    }"
                                />
                                <label for="service-name">{{ index + 1}}. Service name</label>
                            </div>
                            <p class="error-msg" v-if="formErrors[index]?.name">{{ formErrors[index].name }}</p>
                        </div>
                        <div class="col-md-3 mb-2">
                            <div>
                            <div class="form-floating d-flex align-items-center">
                                <input
                                    v-model="service.category"
                                    type="text"
                                    class="form-control"
                                    id="service-category"
                                    placeholder="Service Category"
                                    :class="{
                                        invalid: formErrors[index]?.category,
                                    }"
                                />
                                <label for="service-category">Service Category</label>
                                <Icon
                                    icon="tabler:info-circle"
                                    class="theme-color cursor-pointer ms-1"
                                    style="top: 0"
                                    :width="24"
                                    :height="24"
                                    @click="
                                        () => {
                                            visibleServiceCatHelpModal = true
                                        }
                                    "
                                />
                                
                            </div>
                            <p class="error-msg" v-if="formErrors[index]?.category">{{ formErrors[index].category }}</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <div class="d-flex">
                                <div class="input-small pe-1 pe-sm-3">
                                    <div class="form-floating">
                                        <input
                                            v-model.number="service.price"
                                            type="text"
                                            class="form-control"
                                            id="service-price"
                                            placeholder="Price $"
                                            :class="{
                                                invalid: formErrors[index]?.price,
                                            }"
                                        />
                                        <label for="service-price"
                                            >Price $</label
                                        >
                                    </div>
                                    <p class="error-msg" v-if="formErrors[index]?.price">{{ formErrors[index].price }}</p>
                                </div>
                                <div class="input-small pe-1 pe-sm-3">
                                    <div class="form-floating">
                                        <input
                                            v-model.number="service.time"
                                            type="text"
                                            class="form-control"
                                            id="service-time"
                                            placeholder="Time(mins)"
                                            :class="{
                                                invalid: formErrors[index]?.time,
                                            }"
                                        />
                                        <label for="service-time"
                                            >Time(mins)</label
                                        >
                                    </div>
                                    <p class="error-msg" v-if="formErrors[index]?.time">{{ formErrors[index].time }}</p>
                                </div>
                                <div class="px-1 pe-sm-3 ps-sm-0">
                                    <div class="d-flex pt-2">
                                        <Icon
                                            class="me-1 me-sm-2 cursor-pointer"
                                            icon="tabler:eraser"
                                            :height="24"
                                            color="secondary"
                                            v-c-tooltip="{
                                                content: 'Clear',
                                                placement: 'top',
                                            }"
                                            @click="clearRow(index)"
                                        />
                                        <Icon
                                            v-if="index != 0"
                                            class="cursor-pointer"
                                            icon="tabler:trash"
                                            :height="24"
                                            color="secondary"
                                            v-c-tooltip="{
                                                content: 'Delete',
                                                placement: 'top',
                                            }"
                                            @click="removeRow(index)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div class="d-flex justify-content-center">
                        <button
                            class="
                                btn btn-success
                                d-inline-flex
                                align-items-center
                            "
                            @click="addServiceRows(2)"
                        >
                            <Icon
                                icon="tabler:plus"
                                :height="20"
                                :width="20"
                                class="me-2"
                            /><span>Add more service</span>
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 pt-3">
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-light" type="button" @click="() => $emit('previousClick')">
                                Previous
                            </button>
                            <button class="btn btn-success" type="button" @click="addServices">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <InfoHelperModal 
            :visible="visibleServiceCatHelpModal"
            title="Help Service Category"
            :body-lines='["Type a name for service category. For example: type in Hair Services for hair related services."]'
            @modal:close="visibleServiceCatHelpModal = false"
        />
    </div>
</template>

<script>
import { Icon } from '@/common/Icon';
import InfoHelperModal from '@/common/InfoHelperModal.vue';
import TabAlert from '@/common/TabAlert.vue';

export default {
    name: 'StartWizardServicesTab',
    emits: ['serviceInfoSubmitted', 'previousClick'],
    components: {
        Icon,
        InfoHelperModal,
        TabAlert
    },
    data() {
        return {
            services: [],
            formErrors: [],
            isFormSubmit: false,
            visibleServiceCatHelpModal: false,
            show_error_data: false,
            errorData: {
                type: '',
                heading: '',
                subheading: ''
            },
        }
    },
    created() {
        this.addServiceRows();
    },
    methods: {
        clearRow(i) {
            this.services[i] = {
                _id: 0,
                _message: null,
                name: '',
                category: '',
                price: '',
                time: ''
            };
            this.formErrors.splice(i, 1);
        },

        removeRow(i) {
            this.services.splice(i, 1);
            this.formErrors.splice(i, 1);
        },

        validateField(fieldVal, rules = [], params = {}, messages = {}) {
            let msg = null;
            fieldVal = typeof(fieldVal) == 'string' ? fieldVal.trim() : fieldVal;
            const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            if (rules.length) {
                if (rules.includes('email')) {
                    if (!emailRegex.test(fieldVal)) {
                        msg = messages['email'] || "Value is not a valid email address";
                    }
                }

                if (rules.includes('minLength')) {
                    if (fieldVal.length < params.min) {
                        msg = messages['minLength'] || `This field should be at least ${params.min} characters long`;
                    }
                }
                if (rules.includes('required')) {
                    if ((typeof(fieldVal) == 'string' && fieldVal.length == 0) || !fieldVal) {
                        msg = messages['required'] || `Value is required`;
                    }
                } 
            }
            return msg;
        },

        applyValidation(data) {
            let that = this;
            that.formErrors = [];
            data.forEach((d, index) => {
                if (d.name || d.category || d.price || d.time) {
                    let formError = {};
                    for (const property in d) {
                        switch(property)
                        {
                            case 'name':
                            case 'category':
                                formError[property] = this.validateField(d[property], ['required', 'minLength'], { min: 3 });
                            break;
                            case 'price':
                            case 'time':
                                formError[property] = this.validateField(d[property], ['required']);
                            break;
                        }
                        
                    }
                    that.formErrors.splice(index, 0, formError);
                }
            });
        },

        addServiceRows(rows = 2) {
            for (let i = 0; i < rows; i++) {
                this.services.push({
                    _id: 0,
                    _message: null,
                    name: '',
                    category: '',
                    price: '',
                    time: ''
                });
            }
        },

        addServices(e) {
            e.preventDefault();
            let that = this;

            that.isFormSubmit = true;
            that.show_error_data = false;

            let data = that.services.filter(s => (s.name || s.category || s.price || s.time));
            
            this.applyValidation(that.services);

            let isFormCorrect = this.formErrors.every(o => Object.keys(o).every(x => !o[x]));

            if (!this.formErrors.length) {
                that.errorData.heading = "Error"
                that.errorData.subheading = "Please add atleast one service."
                that.errorData.type = 'error';
                that.show_error_data = true;
                return false;
            }

            if (isFormCorrect) {
                that.$emit('serviceInfoSubmitted', data);
            }
        }
    }
}
</script>