<template>
    <CToaster 
        placement="bottom-start" 
        @close="closeNotification" 
        v-if="show"
    >
        <CToast 
            :visible="show" 
            :autohide="autoClose" 
            :delay="autoCloseTime" 
            :dismissible="false"
            color="primary" 
            @close="closeNotification" 
            class="text-white align-items-center"
        >
            <div class="d-flex">
                <CToastBody>
                    <span>We just showed a celebratory animation. These are occasionally shown.</span>
                    <div style="margin-top: 5px;">
                        <CButton style="margin-right: 10px;" @click="disableUserAnimation"  color="success">Disable Animations</CButton>
                        <CButton color="info" @click="keepShowingAnimation">Keep them!</CButton>
                    </div>
                </CToastBody>
                <CToastClose class="me-2 m-auto" white ref="closeBtn" @close="closeNotification"/>
            </div>
		</CToast>
	</CToaster>
</template>

<script>
export default {
    name: "AnimationToastr",
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        autoClose: {
            type: Boolean,
            default: false
        },
        autoCloseTime: {
            type: Number,
            default: 10000
        }
    },
    data() {
        return {
            show: this.visible,
        }
    },
    watch: {
        visible: function (newVal) {
            this.show = newVal
        },
    },
    methods: {
        closeNotification() {
            this.show = false;
        },
        async disableUserAnimation() {
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
            this.closeNotification();
        },
        async keepShowingAnimation() {
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
            this.closeNotification();
        }
    }
}
</script>