<template></template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Available Messaging Credits',
    data() {
        return {
            credits: null,
            debug_messages: false
        };
    },
    computed: mapState({
        firstWarnMessagingToastShownCount: state => state.ui.max_credit_toast.below_2,
        disabledMessagingToastShownCount: state => state.ui.max_credit_toast.below_p5,
        lastMessageCreditMessageTime: state => state.ui.max_credit_toast.message_credit_last_shown_time
    }),
    created() {
        if(this.debug_messages)
        {
            console.log("MSG Credit Check Log: ", 
                this.firstWarnMessagingToastShownCount, 
                this.disabledMessagingToastShownCount )
        
        }
        if (this.firstWarnMessagingToastShownCount > 0 || 
            this.disabledMessagingToastShownCount > 0) 
        {
            this.getCredits();
        }
    },
    methods: {
        debugResetShownCounts()
        {
            console.log("*** DEBUG Reset Messaging Credit Shown Count *** ")
               
            this.$store.commit('updateMaxCreditToast', {key: "below_2", value: 2});
            this.$store.commit('updateMaxCreditToast', {key: "below_p5", value: 2});
        },
        getCredits(fetch_from_remote = false) {

            let second_limit = 0.50
            let first_limit = 2
            let almost_empty_val = 0.005;
            let show_once_in_n_secs = 8 * 60 * 60; //Once in 8 hours
            let max_popup_count = 2;
            let reset_tracking_count = [
                            {key: "below_2", value: max_popup_count},
                            {key: "below_p5", value: max_popup_count}
                        ]
            
            this.$schedsdk.get_business_messaging({cache_but_remote_first : fetch_from_remote}).then(async (bm_data) => {
                let credits = bm_data.total_available_credits;
                let notification = {};
               
                let tracking_data = [];
                if(this.debug_messages)
                 {
                    console.log("Print Message Credits Check ", {credits,first_limit, second_limit, almost_empty_val})
                    console.log("Print Message Credits Check ", {firstWarnShownCount: this.firstWarnMessagingToastShownCount, disabledWarnShownCount: this.disabledMessagingToastShownCount})
                 }   

                
                let last_shown_time = 0;
                last_shown_time = this.lastMessageCreditMessageTime || 0
                if (!last_shown_time)
                {
                    last_shown_time= 0;
                }
                let current_time =  +new Date();
                let diff_secs = (current_time - last_shown_time) / 1000
                let max_diff_secs  = show_once_in_n_secs  //secs
                let may_show = false;  //May show if counts allow it.
                let must_show = false; //Must show now - when time has passed
                if (diff_secs > max_diff_secs)
                {
                    must_show = true;
                    //await this.$store.commit('updateMessageCreditsLastShownTime', {});
                    //Reset previously shown counts as time has passed
                    await this.$store.commit('updateMessageCreditsTracking',{
                            notification: {},
                            tracking_data:  reset_tracking_count
                    });
                }
                else
                {
                    //Within diff secs. May show depending on how many times already shown.
                    may_show = true;
                }
                if(this.debug_messages)
                {
                    console.log("Print Message Credits Check ", {credits,first_limit, second_limit, almost_empty_val})
                    console.log("Print Message Credits Check ", {firstWarnShownCount: this.firstWarnMessagingToastShownCount, disabledWarnShownCount: this.disabledMessagingToastShownCount})
                    console.log("Diff, current logs,,", {diff_secs, max_diff_secs, must_show, may_show})
               
                }   

                //this.debugResetShownCounts()
                if (credits >= second_limit && 
                    credits < first_limit &&  //If credis are within a low range
                    (must_show || (may_show && this.firstWarnMessagingToastShownCount))
                  )  //And if firstWarn count is greater than 0(mean still to show)
                {
                     notification.text = `Messaging Credits are low (${credits} credits). Please add more credits to avoid disruption in sending reminders/notifications.`;
                     tracking_data = [
                            {key: "below_2", value: this.firstWarnMessagingToastShownCount - 1},
                            {key: "below_p5", value: 2}
                        ]
                } 
                if (credits <= almost_empty_val &&   //If credits are already out
                    (must_show || (may_show && this.disabledMessagingToastShownCount))
                    )  //Disabled warn count is greater than 0 (mean still to show).
                {
                    notification.text = "Credits are empty and outgoing messages are now disabled. Please add more credits to send reminders/notifications";
                    tracking_data = [
                        {key: "below_2", value: 2},
                        {key: "below_p5", value:this.disabledMessagingToastShownCount - 1}
                    ]
                }
                if (notification && notification.text)
                {
                    this.$store.commit('updateMessageCreditsTracking',{
                            notification: notification,
                            tracking_data:  tracking_data
                    });
                }
                
            }).catch(ex=>{
                console.log("Error getting message credits get_business_messaging ", ex)
            });
        }
    }
}
</script>