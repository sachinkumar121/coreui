<template>
    <div class="">
        <button @click="doBookingEvent('AEV_BOOKING_CREATED')">Create Booking</button><br /><br />
        <button @click="doBookingEvent('AEV_BOOKING_COMPLETED')">Complete Booking</button><br /><br />
        <button @click="doBookingEvent('AEV_SETUP_COMPLETE')">Setup Complete</button><br /><br />
        <button @click="doBookingEvent('AEV_REGISTER_COMPLETED')">Register Complete</button><br /><br />
        <!-- <button @click="doBookingEvent('AEV_BOOKING_PAID')">Paid Booking</button><br /> -->

        <!-- <button @click="getEvents('AEV_BOOKING_CREATED')">Get AEV_BOOKING_CREATED Events</button> -->
        <!-- <button @click="getEvents('AEV_BOOKING_COMPLETED')">Get AEV_BOOKING_COMPLETED Events</button><br /> -->
        <!-- <button @click="getEvents('AEV_BOOKING_PAID')">Get AEV_BOOKING_PAID Events</button><br /> -->
<!-- 
        <button @click="getAllEvents">Get All Events</button><br /><br />

        <button @click="clearAnimation">clear animation</button>
        <button @click="getUiPreferences">getUiPreferences</button><br /><br />
        
        <button @click="enableAnimation">enable animation</button>
        <button @click="disableAnimation">disable animation</button><br /><br />

        <button @click="enableAckedAnimation">enableAckedAnimation</button>
        <button @click="disableAckedAnimation">disableAckedAnimation</button><br /><br /> -->

        <!-- <animation-view 
            v-if="enable_celebration_animations"
            :current-component="animation_component"
            :show-toastr="showAnimationToastr && isEventCountReachThreshold"
        /> -->
    </div>
    <div class="hidden">
        <div class="col">
            <div class="animation-cover">
                <Vue3Lottie 
                    :animationData="HeartAnimationJSON" 
                    :height="300" 
                    :width="300" 
                />
            </div> 
            <div class="animation-cover">
                <Vue3Lottie 
                    :animationData="CompleteAnimationJSON" 
                    :height="300" 
                    :width="300" 
                />
            </div>
            <div class="animation-cover">
                <Vue3Lottie 
                    :animationData="ThankYouAnimationJSON" 
                    :height="300" 
                    :width="300" 
                />
            </div>
            <div class="animation-cover">
                <Vue3Lottie 
                    :animationData="StarHeartGlassAnimationJSON" 
                    :height="300" 
                    :width="300" 
                />
            </div>
            <div class="animation-cover">
                <Vue3Lottie 
                    :animationData="MultipleStarCelebrationAnimationJSON" 
                    :height="300" 
                    :width="300" 
                />
            </div>
        </div>
    </div> 
</template>
<script>
    import { mapState } from 'vuex';
    import HeartAnimationJSON from '@/animation/json-data/HeartAnimation.json'
    import CompleteAnimationJSON from '@/animation/json-data/CompleteAnimation.json'
    import ThankYouAnimationJSON from '@/animation/json-data/ThankYouAnimation.json'
    import StarHeartGlassAnimationJSON from '@/animation/json-data/StarHeartGlassAnimation.json'
    import MultipleStarCelebrationAnimationJSON from '@/animation/json-data/MultipleStarCelebrationAnimation.json'
    import {
        Icon
    } from '@/common/Icon';
    import RadioSelect from '@/common/RadioSelect.vue';
    import AnimationContainer from '@/animation/AnimationContainer.vue';
    import { findSpecificDoc, insertDataToCollection, getDataOfCollection, removeDataOfCollection, updateDataOfCollection } from '@/helpers/in-memory-db';
    import utils_lib from '@/helpers/utils_lib';
    import { Vue3Lottie } from 'vue3-lottie';
    
    export default {
        components: {
            Icon,
            RadioSelect,
            AnimationContainer,
            Vue3Lottie

        },
        computed: {
            showAnimationToastr() {
                return (this.$store.state.user_data.ui_preferences.enable_celebration_animations || false) && !(this.$store.state.user_data.ui_preferences.acked_keep_celebrations_msg || false)
            },
            ...mapState({
                enable_celebration_animations: state => state.user_data.ui_preferences.enable_celebration_animations || null,
                acked_keep_celebrations_msg: state => state.user_data.ui_preferences.acked_keep_celebrations_msg || false,
                animation_component: state => state.ui.animation_component || null,
            })
        },
        data() {
            return {
                visible: true,
                visibleLiveDemo: false,
                HeartAnimationJSON,
                CompleteAnimationJSON,
                ThankYouAnimationJSON,
                StarHeartGlassAnimationJSON,
                MultipleStarCelebrationAnimationJSON,
                users: [
                    { serviceId: 'PGGHX6353', serviceRequest:'02 May 22 05:54am', customer: 'Hank', provider: 'Todd Rollins', service: 'Base Hair Cut', invoice: '$35', status: 'Scheduled' },
                ],
                filterModal: false,
                collapseSidebar: false,
                isEventCountReachThreshold: false,
            }
        },
        methods: {
            // showAnimationToastr() {
            //     return (this.$store.state.user_data.ui_preferences.enable_celebration_animations || false) && !(this.$store.state.user_data.ui_preferences.acked_keep_celebrations_msg || false)
            // },
            heartAnimation () {
                console.log(clicked)
                this.HeartAnimationJSON(show)
            },
            async getUiPreferences() {
                await this.$schedsdk.get_user_ui_preferences(this.$store.state.user_data._id).then((result) => {
                    console.log("API");
                    console.log(JSON.stringify(result.data.ui_preferences));
                }).catch((error) => {
                    console.log(error);
                });
                console.log("store");
                console.log(JSON.stringify(this.$store.state.user_data.ui_preferences));
            },
            async enableAnimation() {
                await this.$schedsdk.update_user_ui_preferences({
                    user_id: this.$store.state.user_data._id,
                    ui_preferences: { enable_celebration_animations: true }
                }).then(async (result) => {
                    if (result.status) {
                        await this.$store.commit('update_user_ui_preferences', { key: "enable_celebration_animations", value: true });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            async disableAnimation() {
                await this.$schedsdk.update_user_ui_preferences({
                    user_id: this.$store.state.user_data._id,
                    ui_preferences: { enable_celebration_animations: false }
                }).then(async (result) => {
                    if (result.status) {
                        await this.$store.commit('update_user_ui_preferences', { key: "enable_celebration_animations", value: false });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            async enableAckedAnimation() {
                await this.$schedsdk.update_user_ui_preferences({
                    user_id: this.$store.state.user_data._id,
                    ui_preferences: { acked_keep_celebrations_msg: true }
                }).then(async (result) => {
                    if (result.status) {
                        await this.$store.commit('update_user_ui_preferences', { key: "acked_keep_celebrations_msg", value: true });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            async disableAckedAnimation() {
                await this.$schedsdk.update_user_ui_preferences({
                    user_id: this.$store.state.user_data._id,
                    ui_preferences: { acked_keep_celebrations_msg: false }
                }).then(async (result) => {
                    if (result.status) {
                        await this.$store.commit('update_user_ui_preferences', { key: "acked_keep_celebrations_msg", value: false });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            async clearAnimation() {
                this.$skyEventListener.emit('CLEAR_ANIMATION');
                // await this.$store.commit('set_ui_data', { key: "animation_component", value: null });
                await this.$store.commit('set_ui_data', { key: "show_acked_toastr", value: false });
            },
            async removeStaleEvents() {
                let date = utils_lib.formatDate(new Date);
                await removeDataOfCollection(`skysalon.user_events`, { date: !date }, { multi: true });
            },
            async getAllEvents() {
                let date = utils_lib.formatDate(new Date);
                await this.removeStaleEvents();
                let userEvents = await getDataOfCollection(`skysalon.user_events`, { date }, null, 0, { date: 1 });
                console.log(userEvents);
            },
            async getEvents(name) {
                await this.removeStaleEvents();
                let userEvents = await getDataOfCollection(`skysalon.user_events`, { name }, null, 0, {date: 1});
                console.log(userEvents);
                return userEvents;
            },
            async doBookingEvent(name) {
                let that = this;
                await this.clearAnimation();
                this.$skyEventListener.generateEvent(name);
                /* let userEvents = await that.$skyEventListener.getUserEvents(name);

                if (new Array(100).fill(0).map((v, i) => i + 1).filter(v => v % 2 == 0).includes(userEvents.length)) {
                    await that.$store.commit('set_ui_data', { key: "show_acked_toastr", value: true });
                } */

                /* if (this.enable_celebration_animations) {
                    // await that.$store.commit('set_ui_data', { key: "animation_component", value: 'confetti-animation' });
                } */
            },
            onValChange(v) {
                console.log(v)
            },
            toggleSidebar() {
                // console.warn('adaa')
                this.collapseSidebar=!this.collapseSidebar
            }
        }
    }
        
   
</script>
<style scoped lang="scss">
    // :root {
    //     --primary: #6D57E4;
    //     --dark: #000;
    //     --light: #fff;
    // }
    *,
    .nav-item,
    .nav-link {
        font-family: 'Overpass', sans-serif;
    }
    body, .table > :not(caption) > * > *, label, h5 {
        color: #000 !important;
    }
    a, .color-a {
        color: #6D57E4;
    }
    .nav-link {
        font-size: 16px;
    }
    
    .fw-500 {
        font-weight: 500;
    }
    
    .nav-link {
        span {
        margin-left: 16px;
        font-size: 16px;
        display: inline-block;
    }
    }
    
    .sidebar-new {
        transition: 0.3s ease-in-out;
        .sidebar-brand {
        justify-content: flex-start;
        font-size: 1.2rem;
        padding: 0 15px;
        color: #000;
        background-color: #fff;
        font-weight: 600;
        img {
        margin-right: 15px;
        width: 41.15px;
        height: 44.37px;
    }
    }
        .sidebar-new .nav-item {
        background: #fff;
    }
    .nav-item,
    .nav-item .nav-link,
    .nav-item .nav-link svg,
    .nav-item .nav-link span {
        color  : #000;
    }
    }
    .sidebar-new .sidebar-brand 

    .nav-link.nav-group-toggle {

        background-color: #fff;
        color : #000;
    }
    .header-toggler {
        border: 1px solid #ddd;
        height: 48px;
        width: 42px;
        padding: 0;
        border-radius: 50%;
        transform: rotate(-90deg);
        color: black;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .form-control {
        min-height: 44px;
        border-radius: 6px;
    }
    .custom-dropdown {
        background: #fff;
        border: 1px solid #F0F0F0;
        box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        min-width: 265px;
        color: #000;
    }
    .custom-dropdown a, .dropdown-menu a {
        color: #000;
    }
    .dropdown-menu a {
        font-size: 14px;
    }
    .dropdown-menu {
        a{
            &:hover {
            color: #6D57E4;
            text-decoration :none;
            background: #F9F8FF;
            }
            svg {
                margin-right:5px;
            }
        }
    }
    
    .card-custom {
        .form-label{
            font-weight: 500;
            /* font-size:1rem; */
        }
        th {
            font-weight: 700;
            
        }
    }
    
    .btn-primary-new {
        background-color: #6D57E4;
        border-radius: 14px; 
        border-color: #6D57E4;
        min-height: 44px;
        &.btn-primary-new-small {
            min-height:34px;
        }
        &:hover {
            background-color: #5639f3;
        }
    }
    
    .btn-outline-new {
        color: #000;
        border-color: #D9D9D9;
        border-radius: 14px; 
        min-height: 100%;
        &:hover {
            background-color: #D9D9D9;  
            color:#000;
        }
    }

    .action_column .btn.btn-primary{
        color: #000;
        background: transparent;
        border: 0;
    }
    .action_column {
        .btn:focus {
        box-shadow: none;
        }
        .dropdown-toggle::after {
            display: none;
        }        
        .dropdown-menu {
            border: 1px solid #F0F0F0;
            box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            .dropdown-item{
                padding: 0.4rem 1rem;
            }
        }
    }
    

    .dark-link, .dark-link:hover {
        font-weight: 600;
        font-size: 16px;
        color : #000;
    }
    .btn-dark-new {
        color: #fff;
        background-color: #000;
        font-weight: 500;
        min-height: 44px;
        min-width: 102px;
        text-align: center;
    }
    .form-control, .form-select {
        min-height:44px;
        border-color: #C9C9C9;
        border-radius: 6px;
    }
    
    .opacity-5 {
        opacity: .5;
    }
    .invoice-btn {
        background: #00CF3A;
        border-radius: 3px;
        padding: 2px 12px 0;
        display: inline-block;
        width: auto;
        align-items: center;
        color: #fff;
    }
    .table-hover {
        tbody.no-result-tbody > tr:hover > * {
            background-color: #fff;
            --cui-table-accent-bg: #fff;
        }
    }
    .no-result-tbody {
        td {
            // padding-left: 0;
            .img-empty {
                max-width: 423px;
                width: 100%;
            }
        }
    }
    .hidden {
        display: none;
    }
    .col {
        display: flex;
        gap: 3;
        flex-wrap: wrap;
    }
    /* .animation-cover {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,.5);
    } */
    /* media start */
    @media (screen) and (min-width:1201px) {
        .wrap-body {
            padding:0 !important;
        }
        .title-page {
            margin-left:2rem;
        }
    }
    @media screen and (max-width: 1199.98px) {
        .toggle-sidebar {
            display: none;
        }
        table {
            border-color: #C9C9C9;
            caption {
                font-size: 1.3em;
            }
            thead {
                border: none;
                clip: rect(0 0 0 0);
                height: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                position: absolute;
                width: 1px;
            }
            tr {
                border-bottom: 3px solid #ddd;
                display: block;
                margin-bottom: .625em;
            }
            td {
                border-bottom: 1px solid #ddd;
                display: block;
                font-size: .9em;
                text-align: left;
                padding-left: 145px;
                position: relative;
            }
        }

        table tbody:not(.no-result-tbody) td::before {
            content: attr(data-label);
            float: left;
            font-weight: bold;
            position: absolute;
            left: 0;
            background: #F9F8FF;
            min-width: 120px;
            top: 0;
            padding: 9px 15px;
            height: 100%;
            border-color: #E7E7E7;
            border-collapse: collapse;
            border-style: solid;
            border-width: 0 1px;
        }
        
        table td:last-child {
            border-bottom: 0;
        }
    }
    @media (min-width: 991.98px) {
        .modal-lg, .modal-xl {
            max-width: 768px;
        }
    }
</style>