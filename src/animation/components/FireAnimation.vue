<template>
    <span></span>
</template>

<script>
import useAnimation from '@/composables/useAnimation';

export default {
    name: "FireAnimation",
    setup: () => {
        const { fireAnimation } = useAnimation();
        return { fireAnimation };
    },
    mounted() {
        this.fireAnimation()
    }
}
</script>