<template>
    <div class="relative onboard-toggle">
    <ThemeSwitcher />
    <CContainer class="d-flex content-center min-vh-100 container onBoarding-container">
        <CRow class="mx-auto">
            <CCol class="pt-5">
                <CCardGroup>
                    <CCard class="p-2 pb-4 mt-5">
                        <div class="logo pt-1 d-flex align-items-center justify-content-center">
                            <img class="logo-auth" :src="business_logo" />
                            <span>{{ business_name }}</span>    
                        </div>
                        <CCardBody class="pb-1">
                            <CForm @submit.prevent="login">
                                <!-- <h1>Login</h1> -->
                                <!-- <p class="text-muted h4 mb-4">Sign In to your account</p> -->
                                <div class="position-relative mb-3 text-start">
                                <CInputGroup class="mb-0">
                                    <CInputGroupText>
                                        <CIcon icon="cil-user" />
                                    </CInputGroupText>
                                    <CFormInput placeholder="E-Mail" autocomplete="username email" v-model="email" :class="{invalid:v$.email.$error}" @blur="v$.email.$touch()">
                                        <template #prepend-content>
                                            <CIcon name="cil-user" />
                                        </template>
                                    </CFormInput>
                                </CInputGroup>
                                <p
                                    class="error-msg"
                                    v-if="v$.email.$dirty && v$.email.required.$invalid"
                                    >This field must not be empty.</p>
                                <p
                                    class="error-msg"
                                    v-if="v$.email.$dirty && v$.email.minLength.$invalid"
                                    >This field must be at least 3 characters.</p>
                                </div>
                                <div class="position-relative mb-3 text-start">
                                <CInputGroup class="mb-0">
                                    <CInputGroupText>
                                        <CIcon icon="cil-lock-locked" />
                                    </CInputGroupText>
                                    <CFormInput
                                        placeholder="Password"
                                        type="password"
                                        autocomplete="password"
                                        v-model="password"
                                        v-on:keyup.enter="login" 
                                        @blur="v$.password.$touch()" :class="{invalid:v$.password.$error}" />
                                </CInputGroup>
                                <p
                                    class="error-msg"
                                    v-if="v$.password.$dirty && v$.password.required.$invalid"
                                    >Password is required.</p>
                                </div>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <Alerts 
                                            :alertData="alertData" 
                                            :show="show"
                                            @alertClosed="alertClosedFn"
                                            v-if="alert" />
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <CButton type="submit" :disabled="loggingIn" color="primary"  class="px-4">
                                            {{ loggingIn ? 'Logging in' : 'Login' }}</CButton>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        &nbsp;<br>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <a class="void-anchor" :href="null" @click="redirectToForgotPassword">Forgot Password?</a>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <a class="void-anchor" :href="null" @click="show_business_akey_model = true">Customer Login</a>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol col="12" class="text-center">
                                        <router-link to="/register" target="_self">
                                            New User? Register here
                                        </router-link>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol col="12" class="text-center cursor-pointer">
                                        <span class="selected-server-label" 
                                        @click="show_server_selection_model = true">Server: {{ 
                                                getSelectedServerObj().label }}</span>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCardGroup>
            </CCol>
        </CRow>
    </CContainer>
    <BusinessAccessKeyModal 
        :visible="show_business_akey_model"
        @modal:close="show_business_akey_model = false"
    />
    <ServerSelectionModal 
        :visible="show_server_selection_model"
        @modal:close="show_server_selection_model = false"
    />
    </div>
</template>

<script>
import Alerts from "../Alerts";
import login_helper from '../../helpers/login_helper';
import ThemeSwitcher from '@/ui_components/ThemeSwitcher.vue';
import useServer from '@/composables/useServer';
import { required, minLength, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import BusinessAccessKeyModal from '@/common/BusinessAccessKeyModal.vue';
import ServerSelectionModal from '@/common/ServerSelectionModal.vue';

export default {
    name: "Login",
    components: {
        Alerts,
        ThemeSwitcher,
        BusinessAccessKeyModal,
        ServerSelectionModal
    },
    setup: () => {
        const v$ = useVuelidate();
        const { getSelectedServerObj } = useServer();
        return { v$, getSelectedServerObj }
    },
    data() {
        return {
            in_prefer_admin: this.$route.params.prefer_admin_or_access_key || this.$route.query.prefer_admin || null,
            email: "",
            password: "",
            alert: false,
            show: 0,
            alertData: {
                message: "",
                type: ""
            },
            loggingIn: false,
            show_business_akey_model: false,
            show_server_selection_model: false,
            business_logo: "/img/logo-icon-auth.png",
            business_name: "SkySalon Business Login"
        };
    },
    watch: {
        '$route.params.prefer_admin_or_access_key': async function(val) {
            await this.getAndSetBusinessInfo();
        },
        '$route.query.access_key': async function(val) {
            await this.getAndSetBusinessInfo();
        },
    },
    validations() {
        return {
            email: { required, minLength: minLength(3) },
            password: { required },
        }
    },
    created() {
        let sso_message = this.$route.query.sso_message;
        this.loggingIn = false;
        if (sso_message !== undefined) {
            if (sso_message == '1') {

                this.alertData = {
                    message: "Automatic sign in failed. Please login with credentials",
                    type: "danger"
                };
                this.show = 8;
                this.alert = true;

            }
            if (sso_message == '2') {

                this.alertData = {
                    message: "Session has expired. Please login with your credentials.",
                    type: "danger"
                };
                this.show = 8;
                this.alert = true;

            }
        }
    },
    async mounted() {
        await this.getAndSetBusinessInfo();
    },
    methods: {
        async getAndSetBusinessInfo() {
            let access_key = this.$route.params.prefer_admin_or_access_key || this.$route.query.access_key || null;
            if (access_key && access_key.length > 1) {
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
        redirectToForgotPassword() {
            let access_key = this.$route.params.prefer_admin_or_access_key || this.$route.query.access_key || null;

            if (access_key && access_key.length > 1) {
                this.$router.push({
                    name: 'ForgotPassword',
                    params: {
                        access_key
                    }
                });
            } else {
                this.$router.push({
                    name: 'ForgotPassword',
                });
            }
        },
        register() {
            this.$router.push({
                name: 'Register'
            });

        },
        forgot_password() {
            this.$router.push({
                name: 'ForgotPassword'
            });
        },

        login() {
            if (!navigator.onLine) {
                this.alertData = {
                    message: "server is unreachable. Please try again",
                    type: "danger"
                };
                this.alert = true;
                this.show = 8;
                return false;
            }
            this.v$.$touch();
            if (this.v$.$invalid) {
                return;
            }
            this.loggingIn = true;
            let prefer_admin = false;
            if (this.in_prefer_admin == "1") {
                prefer_admin = true;
            }
            let loginReq = {
                email: this.email,
                password: this.password,
                source_login: 'web',
                prefer_admin: prefer_admin
            }
            let access_key = this.$route.params.prefer_admin_or_access_key || this.$route.query.access_key || null;

            if (access_key && access_key.length > 1) {
                loginReq.access_key = access_key;
            }
            this.$schedsdk.login(loginReq)
                .then(async (result) => {
                    if (result) {
                        
                        await login_helper.complete_new_login(this.$schedsdk,
                            this.$schedsdk.getLoggedInUserData(),
                            this.$store,
                            this.$appchatobj);
                        
                        const pathObj = {};
                        
                        //For admin users, its useful to go to business list first
                        if (this.$store.state.user_data.type === 1) {
                            pathObj.name = 'Business List';
                        } else {
                            pathObj.name = 'Dashboard';
                        }
                        if (this.$route.query.redirect_next) {
                            pathObj.path = this.$route.query.redirect_next;
                            delete pathObj.name;
                        }
                        this.$router.push(pathObj);

                    } else {
                        this.alertData = {
                            message: "Login failed. Please check and try again",
                            type: "danger"
                        };
                        this.alert = true;
                        this.show = 8;
                        this.loggingIn = false;
                    
                    }
                })
                .catch(ex => {
                    this.loggingIn = false;
                    this.alertData = {
                        message: ex.response.data.message,
                        type: "danger"
                    };
                    this.alert = true;
                    this.show = 8;
                }).finally(() => {
                   
                });

        },
        alertClosedFn() {
            this.show = 0;
            this.alert = false;
        }
    }
};
</script>
<style scoped lang="scss">
.theme-div {
    display: inline-block;
    position: absolute;
    right: 7px;
    top: 10px;
}
.switch-label {
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
a.void-anchor {
    text-decoration: none;
    background-color: transparent;
    color: var(--link-color);
    &:hover {
        text-decoration: underline;
        color: var(--link-color);
    }
}
</style>