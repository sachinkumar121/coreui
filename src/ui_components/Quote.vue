<template>
    <quote-modal
        :visible="visibleQuoteModal"
        :text="quote_text"
        :author="quote_author"
        :hide-seconds="11"
        @on-close="clearTimers"
    />
</template>

<script>
import moment from 'moment-timezone';
import { mapMutations, mapGetters } from 'vuex';

import QuoteModal from '@/common/QuoteModal.vue';

export default {
    name: "Quote",
    components: { QuoteModal },
    data() {
        return {
            visibleQuoteModal: false,
            quoteShowTimer: null,
            quoteHideTimer: null,
            quote_text: null,
            quote_author: null
        }
    },
    async created() {
        let business_id = this.$store.state.user_data._id;
        let lastQuoteVisible = this.getQuoteVisibilityForBusiness(business_id);
        if (!lastQuoteVisible || (lastQuoteVisible && !(moment(lastQuoteVisible).isSame(moment(), 'day')))) {
            try {
                const response = await this.$schedsdk
                .getCustomerMessageOfTheDay();
                const { data } = response;
                if (response.status && data.text) {
                    this.quote_text = data.text;
                    this.quote_author = data.author || "Anonymous";
                    this.setQuoteVisibility({key: business_id, value: moment.now()});
                    this.quoteShowTimer = setTimeout(() => {
                        this.visibleQuoteModal = true;
                    }, 1000);
                    this.quoteHideTimer = setTimeout(() => {
                        this.visibleQuoteModal = false;
                        this.clearTimers();
                    }, 10000);
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    computed: {
        ...mapGetters(['getQuoteVisibilityForBusiness'])
    },
    methods: {
        ...mapMutations(['setQuoteVisibility']),
        clearTimers() {
            this.quoteShowTimer ? clearTimeout(this.quoteShowTimer) : null;
            this.quoteHideTimer ? clearTimeout(this.quoteHideTimer) : null;
        }
    },
    unmounted() {
        this.clearTimers();
    }
}
</script>
