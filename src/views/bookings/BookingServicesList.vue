<template>
    <span class="single-line" v-c-tooltip="{content: firstServiceName}">{{ firstServiceName }}</span>
    <div class="c-sub-text text-hidden">
        <a v-if="show_more_item && servicesListHtml" 
            class="me-2 text-underline" v-c-tooltip="{content: servicesListHtml}"
            ><Icon icon="tabler:plus" :height="15"  /><u>{{ item.services.length - 1}} more</u></a>
        <span v-if="show_time" class="opacity-7">{{total_time}} mins</span>
    </div>
</template>

<script>
import { Icon } from '@/common/Icon';

export default {
    name: "BookingServicesList",
    props: {
        item: {
            type: Object
        },
        simplelist: {
            type: Boolean
        }
    },
    components: {
        Icon
    },
    data() {
        return ({
            servicesListHtml: null,
            firstServiceName: null,
            show_time: true,
            total_time: 0,
            show_more_item: true
        });
    },
    created() {
        this.generateServicesListHtml();
    },
    methods: {
        generateServicesListHtml() {
            let servicesNameArr = this.item.services.map(s => s.name);
            this.firstServiceName = servicesNameArr.shift() || null;
            this.total_time = this.item.services.reduce(function(prev, next) {
                return prev + next.time;
            }, 0);
            if (isNaN(this.total_time) || this.total_time == 0) {
                this.show_time = false;
            }
            if (this.simplelist)
            {
                this.show_time = false;
                
            }
            if (!servicesNameArr.length) {
                this.show_more_item = false;
            } else {
                this.servicesListHtml = servicesNameArr.map(s => `<li>${s}</li>`).join("\r\n");
            }
        },
    }
}
</script>