<template>
	<CToaster class="toaster-custom-placement" @close="closeNotification" v-if="show">
        <CToast :visible="show" 
                :autohide="autoClose" 
                :delay="autoCloseTime" 
                color="primary" 
                @close="closeNotification" 
                class="text-white align-items-center"
        >
            <div class="d-flex">
                <CToastBody>
                    <span>{{notification.text}}</span>
                    <div style="margin-top: 5px;">
                        <CButton style="margin-right: 10px;" @click="openPurchaseLink"  color="success">Purchase Credits</CButton>
                        <CButton color="info" @click="getCredits(true)">Refresh</CButton>
                    </div>
                </CToastBody>
                <CToastClose class="me-2 m-auto" white ref="closeBtn" @close="closeNotification"/>
            </div>
		</CToast>
	</CToaster>
</template>
<script>
	import { mapState } from 'vuex';
    export default {
        name: "MessageCreditToast",
        data() {
            return {
                toasts: []
            }
        },
        props: {
            autoClose: {
				type: Boolean,
				default: false
			},
            autoCloseTime: {
                type: Number,
                default: 5000
            }
        },
        computed: {
			show() {
				let obj = this.$store.state.message_credit_notification;
                let show = obj && Object.keys(obj).length !== 0 && obj.constructor === Object;;
                if(show)
                {
                   this.$store.commit('updateMessageCreditsLastShownTime', {});
                }
                return show
			},
			...mapState({
				'notification': 'message_credit_notification'
            })
		},
		methods: {
            openPurchaseLink() {
                this.closeNotification();
                this.$router.push("/standalonepurchases");
            },
			closeNotification() {
              	this.$store.commit('setMessageCreditNotification', {});
			},
            async getCredits(fetch_from_remote = false) {
                this.closeNotification();
                this.$schedsdk.get_business_messaging({cache_but_remote_first : fetch_from_remote}).then(async (bm_data) => {
                        //Get from remote and store
                }).catch(ex=>{
                    console.log("MCT: Error ", ex)
                });
            
            }
		}
    }
</script>