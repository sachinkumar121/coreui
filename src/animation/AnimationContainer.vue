<template>
    <div> 
        <component 
            class="animation-outer"
            :is="animationComponent"
            @completed="clearAnimation"
        ></component>

        <AnimationToastr :visible="showAnimationToastr"/>
    </div>
</template>

<script>
import { defineAsyncComponent, nextTick } from 'vue';
import { insertDataToCollection, getDataOfCollection, removeDataOfCollection } from '@/helpers/in-memory-db';
import utils_lib from '@/helpers/utils_lib';

import AnimationToastr from '@/animation/AnimationToastr.vue';
import { userEventCollections, userEvents, eventToAnimationMapping } from '@/constants.js';

export default {
    name: "AnimationContainer",
    data() {
        return {
            animationComponent: null
        }
    },
    components: {
        AnimationToastr,
        'heart-animation': defineAsyncComponent(() =>
            import('@/animation/components/HeartAnimation.vue')
        ),
        'confetti-animation': defineAsyncComponent(() =>
            import('@/animation/components/ConfettiAnimation.vue')
        ),
        'completed-animation': defineAsyncComponent(() =>
            import('@/animation/components/CompletedAnimation.vue')
        ),
        'paid-animation': defineAsyncComponent(() =>
            import('@/animation/components/PaidAnimation.vue')
        ),
        'fire-animation': defineAsyncComponent(() =>
            import('@/animation/components/FireAnimation.vue')
        ),
        'complete-animation': defineAsyncComponent(() =>
            import('@/animation/components/CompleteAnimation.vue')
        ),
        'multiple-star-celebration-animation': defineAsyncComponent(() =>
            import('@/animation/components/MultipleStarCelebrationAnimation.vue')
        ),
        'star-heart-glass-animation': defineAsyncComponent(() =>
            import('@/animation/components/StarHeartGlassAnimation.vue')
        ),
        'thank-you-animation': defineAsyncComponent(() =>
            import('@/animation/components/ThankYouAnimation.vue')
        )
    },
    mounted() {
        console.log("Animation View Mounted...");
        this.initAnimationEventsHandlers();
    },
    computed: {
        showAnimationToastr() {
            if (this.$store.state.user_data) {
                return (this.$store.state.user_data.ui_preferences?.enable_celebration_animations || false) &&
                !(this.$store.state.user_data.ui_preferences?.acked_keep_celebrations_msg || false) &&
                (this.$store.state.ui.show_acked_toastr || false)
            }
            return false;
        },
        eventToAnimation() {
            if (this.$store.state.user_data) {
                let choice = this.$store.state.user_data.ui_preferences?.animation_choice || 'default';
                return eventToAnimationMapping[choice];
            }
            return eventToAnimationMapping['default'];
        },
    },
    methods: {
        async clearAnimation() {
            this.animationComponent = null;
            await this.$store.commit('set_ui_data', { key: "show_acked_toastr", value: false });
        },
        async addUserEvent(collection, name) {
            let date = utils_lib.formatDate(new Date);
            await insertDataToCollection(collection, {
                date,
                name
            });
        },
        async removeStaleEvents(collection) {
            let date = utils_lib.formatDate(new Date);
            await removeDataOfCollection(collection, { date: !date }, { multi: true });
        },
        async getUserEvents(collection, name) {
            await this.removeStaleEvents();
            let userEvents = await getDataOfCollection(collection, { name }, null, 0, { date: 1 });
            return userEvents;
        },
        initAnimationEventsHandlers() {
            let that = this;
            let collection = userEventCollections['ANIMATION_VIEW'];
            
            for (const eventKey in userEvents) {
                if (Object.hasOwnProperty.call(userEvents, eventKey)) {
                    const eventName = userEvents[eventKey];
                    this.$skyEventListener.on(eventName, async (e) => {
                        that.clearAnimation();
                        await nextTick();
                        that.animationComponent = that.eventToAnimation[eventName] || null;
                        if (eventKey == "AEV_BOOKING_CREATED") {
                            await this.addUserEvent(collection, eventName);

                            let bookingCreatedEvents = await this.getUserEvents(collection, eventName);

                            if (new Array(100).fill(0).map((v, i) => i + 1).filter(v => v % 2 == 0).includes(bookingCreatedEvents.length)) {
                                await that.$store.commit('set_ui_data', { key: "show_acked_toastr", value: true });
                            }
                        }
                    });
                }
            }

            this.$skyEventListener.on('CLEAR_ANIMATION', e => {
                that.animationComponent = null;
            });
        }
    }
}
</script>
<style>

.animation-outer {
    position: fixed;
    height: 100vh !important;
    top: 0;
    width: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
}
.animation-outer svg {
    max-width: 300px;
}
</style>