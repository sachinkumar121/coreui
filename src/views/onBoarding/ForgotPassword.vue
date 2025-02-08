<template>
    <div class="relative onboard-toggle">
    <ThemeSwitcher />
    <CContainer class="d-flex content-center min-vh-100 onBoarding-container onboard-forgotpassword">
        <CRow class="mx-auto">
            <CCol class="pt-5">
                <CCardGroup>
                    <CCard class="p-2 mt-5">
                        <div class="logo pt-1 d-flex align-items-center justify-content-center">
                            <img class="logo-auth" :src="business_logo" />
                            <span>{{ business_name }}</span>     
                        </div>
                        <CCardBody class="pb-1">
                            <CForm>
                                <!-- <h1>Password Reset</h1> -->
                                <!-- <p class="text-muted h4 mb-4">Password Reset</p> -->
                                <CInputGroup class="mb-3">
                                <CFormInput type="email" placeholder="E-Mail" autocomplete="username email" v-model="email" :class="{invalid:v$.email.$error}" @blur="v$.email.$touch()">
                                    <template #prepend-content>
                                        <CIcon name="cil-user" />
                                    </template>
                                </CFormInput>
                                <p
                                class="error-msg"
                                v-if="v$.email.$dirty && v$.email.required.$invalid"
                                >This field must not be empty.</p>
                                <p class="error-msg" v-if="v$.email.$dirty && !v$.email.required.$invalid && v$.email.email.$invalid">Please Enter valid email.</p>
                                </CInputGroup>
                                <CInputGroup class="mb-4">
                                    <CFormInput type="email" placeholder="Confirm E-mail" autocomplete="username email" v-model="confirmemail" :class="{invalid:v$.confirmemail.$error}" @blur="v$.confirmemail.$touch()">
                                        <template #prepend-content>
                                            <CIcon name="cil-user" />
                                        </template>
                                    </CFormInput>
                                    <p
                                    class="error-msg"
                                    v-if="v$.confirmemail.$dirty && v$.confirmemail.required.$invalid"
                                    >This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.confirmemail.$dirty && !v$.confirmemail.required.$invalid && v$.confirmemail.email.$invalid">Please Enter valid email.</p>
                                    <p
                                    class="error-msg"
                                    v-if="!v$.confirmemail.required.$invalid && !v$.confirmemail.required.$invalid && v$.confirmemail.sameAsEmail.$invalid"
                                    >The confirm email does not match with email.</p>
                                </CInputGroup>
                                <Alerts 
                                :alertData="alertData" 
                                :show="show"
                                @alertClosed="alertClosedFn"
                                v-if="alert" />
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <CButton color="primary" @click="request_password" class="px-4">Request Reset</CButton>
                                    </CCol>
                                </CRow>
                                <br/>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <button type="button" @click="back_to_login" class="btn-back">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg><span>Back to Login</span>
                                        </button>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                        
                    </CCard>
                </CCardGroup>
            </CCol>
        </CRow>
    </CContainer>
    </div>
</template>

<script>
import Alerts from "../Alerts";
import ThemeSwitcher from '@/ui_components/ThemeSwitcher.vue';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

export default {
    name: "ForgotPassword",
    components: {
        Alerts,
        ThemeSwitcher
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            access_key: this.$route.query.access_key || this.$route.params.access_key || null,
            email: "",
            confirmemail: "",
            alert: false,
            show: 0,
            alertData: {
                message: "",
                type: ""
            },
            business_logo: "/img/logo-icon-auth.png",
            business_name: "SkySalon"
        };
    },
    watch: {
        '$route.params.access_key': async function(val) {
            await this.getAndSetBusinessInfo();
        }
    },
    validations() {
        return {
            email: { required, email, minLength: minLength(3) },
            confirmemail: { required, email, minLength: minLength(3), sameAsEmail: sameAs(this.email) },
        }
    },
    async mounted() {
        await this.getAndSetBusinessInfo();
    },
    methods: {
        async getAndSetBusinessInfo() {
            let access_key = this.$route.params.access_key || null;
            if (access_key) {
                this.getBusinessInfoFromLocalStorage(access_key);
                const business_info_response = await this.$schedsdk.get_public_business_info(access_key);
                if (business_info_response.status) {
                    const { data: business_info } = business_info_response;
                    this.business_logo = business_info.small_logo_url || "/img/logo-icon-auth.png";
                    this.business_name = business_info.business_name || "SkySalon Business Login";
                    await localStorage.setItem(access_key, JSON.stringify({
                        logo: this.business_logo,
                        name: this.business_name
                    }));
                }
            }
        },
        getBusinessInfoFromLocalStorage(access_key) {
            let { logo, name } = JSON.parse(localStorage.getItem(access_key)) || { logo: "/img/logo-icon-auth.png", name: "SkySalon Business Login" };
            logo = logo || "/img/logo-icon-auth.png";
            this.business_logo = logo;
            this.business_name = name;
        },
        back_to_login() {
            let access_key = this.$route.params.access_key || null;

            if (access_key && access_key.length > 1) {
                this.$router.push({
                    name: 'Login',
                    params: {
                        prefer_admin_or_access_key: access_key
                    }
                });
            } else {
                this.$router.push({
                    name: 'Login',
                });
            }
        },
        request_password() {
            this.v$.$touch();
            if (this.v$.$invalid) {
                return;
            }
            let prefer_business_employee_user = true; //set this to false when its a customer loggings / forgot password
            this.$schedsdk.forgot_password({
                    email: this.email,
                    access_key: this.access_key,
                    source_login: 'web',
                    prefer_business_employee_user: prefer_business_employee_user
                }).then(result => {
                    if (result.status == 1) {
                        this.alertData = {
                            message: result.message,
                            type: "success"
                        };
                        this.alert = true;
                        this.show = 10;
                    } else {
                        this.alertData = {
                            message: result.message,
                            type: "danger"
                        };
                        this.alert = true;
                        this.show = 10;
                    }
                })
                .catch(ex => {
                    // console.log("ex")
                    console.log(ex)
                    this.alertData = {
                        message: ex.response.data.message,
                        type: "danger"
                    };
                    this.alert = true;
                    this.show = 10;
                });
        },
        alertClosedFn() {
            this.show = 0;
        }
    }
};
</script>
<style scoped>
.btn-back {
  border: 0;
  background-color: transparent;
  color: var(--link-color);
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}
.btn-back svg {
  width: 18px;
  fill: var(--link-color);
  margin-right: 9px;
}
.theme-div {
    display: inline-block;
    position: absolute;
    right: 7px;
    top: 10px;
}
.theme-div .switch-label {
    padding-top: 0;
}
.form-control {
    font-size: 16px;
    font-weight: 500;
}
.logo-auth {
    width: 44px;
    height: 44px;
    margin: 5px;
}
.logo span {
    font-size: 18px;
}
/* .card-body {
    max-width: 369px;
} */
</style>
