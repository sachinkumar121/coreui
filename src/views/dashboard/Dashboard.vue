<template>
    <BookingsTable v-if="$store.state.user_data.type == '5'"/>
    <div v-else>
        <Quote 
            v-if="visibleQuote"
        />
        <message-center-credits />
        <div class="row" v-if="false">
            <div class="col-md-3">
                <div class="card" :class="`bg-info text-white`">
                    <div class="card-body pb-0 d-flex justify-content-between">
                        <div>
                            <div class="text-value-lg">
                                {{ dashboard_data.today_bookings_count }}
                            </div>
                            <div class="text-value-lg">All Bookings Today</div>
                        </div>
                        <slot></slot>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card" :class="`bg-success text-white`">
                    <div class="card-body pb-0 d-flex justify-content-between">
                        <div>
                            <div class="text-value-lg">
                                {{ dashboard_data.bookings_next_two_hours }}
                            </div>
                            <div class="text-value-lg">Bookings in 2 Hrs</div>
                        </div>
                        <slot></slot>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card" :class="`bg-danger text-white`">
                    <div class="card-body pb-0 d-flex justify-content-between">
                        <div>
                            <div class="text-value-lg">
                                {{ dashboard_data.today_customers }}
                            </div>
                            <div class="text-value-lg">New Guests Today</div>
                        </div>
                        <slot></slot>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card" :class="`bg-dark text-white`">
                    <div class="card-body pb-0 d-flex justify-content-between">
                        <div>
                            <div class="text-value-lg">
                                {{ dashboard_data.today_sales }}
                            </div>
                            <div class="text-value-lg">Est. Sales Today</div>
                        </div>
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-4">
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="internal_svprefs.horizontal_mode"
                    @change="switch_scheduler_view_mode"
                />&nbsp;
                <label class="control-label">
                    <b>Switch to horizontal Scheduler</b>
                </label>
            </div>
            <div class="col-md-12">
                <scheduler-tab :key="schedTabKey"></scheduler-tab>
            </div>
        </div>
    </div>
</template>
<script>
import BookingsTable from '@/ui_components/booking/BookingsTable.vue'
import SchedulerTab from './scheduler-tab/SchedulerTab.vue'
import AppHelper from '../../helpers/app_helper'
import MessageCenterCredits from '@/common/MessageCreditsCheck'
import login_helper from '../../helpers/login_helper'
import Quote from "@/ui_components/Quote.vue";
export default {
    name: 'Dashboard',
    components: {
        SchedulerTab,
        MessageCenterCredits,
        Quote,
        BookingsTable
    },
    data() {
        return {
            dashboard_data: {},
            internal_svprefs: {},
            schedTabKey: 0,
            visibleQuote: false
        }
    },
    //
    created() {
        this.internal_svprefs = this.viewoptions
        if (
            AppHelper.isRoleOwner(this.$store.state) &&
            this.$store.state.business_settings
                .has_completed_business_setup_wizard !== undefined &&
            this.$store.state.business_settings
                .has_completed_business_setup_wizard == false &&
            this.$store.state.business_settings.business_setup_wizard_skipped ==
                false
        ) {
            if (this.$route.query.no_redirect == '1') {
                return
            }
            this.$router.push({name: 'Start Wizard New'})
            return
        }
        this.getAnalytices()
    },
    async mounted() {
        this.visibleQuote = this.$globalSkyAppSettings?.enable_app_quote_system || false;
    },
    methods: {
        getAnalytices() {
            this.$schedsdk
                .dashboard_analytics({type: 1})
                .then((result) => {
                    try {
                        if (result.status == 1) {
                            this.dashboard_data = result.data
                        } else {
                            login_helper.checkSessionExpiryAndRedirectToLogin(
                                result,
                                this.$schedsdk,
                                this.$router,
                            )
                        }
                    } catch (exx) {
                        console.log('asdasdsadasd')
                        console.log(exx)
                    }
                })
                .catch((ex) => {
                    login_helper.checkSessionExpiryAndRedirectToLogin(
                        ex,
                        this.$schedsdk,
                        this.$router,
                    )
                })
        },
        save_viewprefs_to_store() {
            this.$store.commit(
                'SET_SCHEDULER_VIEW_PREFS',
                this.internal_svprefs,
            )
        },
        async switch_scheduler_view_mode(e) {
            //Since the mode is horizontal_mode, its already changed.
            //this.internal_svprefs.horizontal_mode = e.target.checked? true: false;
            await this.do_switch_scheduler_view_mode(
                this.internal_svprefs.horizontal_mode,
            )
            //Do a full refresh as there is an error in scheduler
            console.log('asdasdasd full refreshAAAA')
            this.save_viewprefs_to_store()
            this.forceSchedRerender()
        },
        forceSchedRerender() {
            this.schedTabKey += 1
        },
        async do_switch_scheduler_view_mode(is_horizontal) {
            if (is_horizontal) {
                this.internal_svprefs.mode = 'horizontal'
                this.internal_svprefs.auto_height = true
                this.internal_svprefs.scheduler_height = null
            } else {
                this.internal_svprefs.mode = 'vertical'
                this.internal_svprefs.auto_height = false
                this.internal_svprefs.scheduler_height = 484
            }
        },
    },
    computed: {
        viewoptions() {
            let svp = this.$store.state.scheduler_view_preferences

            return {
                horizontal_mode: svp.horizontal_mode || false,
                mode: svp.mode || 'vertical',
                auto_height: svp.auto_height || false,
                scheduler_height: svp.scheduler_height || 884,
            }
        }, // end view options
    }
}
</script>
<style scoped>
.card {
    height: 120px;
}
#b-scheduler-15 {
    width: 1300px;
}
</style>
