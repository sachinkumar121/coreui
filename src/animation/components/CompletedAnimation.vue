<template>
    <span></span>
</template>

<script>
import useAnimation from '@/composables/useAnimation';

export default {
    name: "CompletedAnimation",
    setup: () => {
        const { starAnimation } = useAnimation();
        return { starAnimation };
    },
    mounted() {
        this.timeOuts = [
            setTimeout(this.starAnimation, 0),
            setTimeout(this.starAnimation, 100),
            setTimeout(this.starAnimation, 200)
        ];
    },
    beforeUnmount() {
        if (this.timeOuts) {
            this.timeOuts.forEach(timer => {
                clearTimeout(timer);
            });
        }
    },
}
</script>