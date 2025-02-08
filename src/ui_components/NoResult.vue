<template>
    <div class="py-5 text-center error-prompt-div">
        <img src="/img/no-result.svg" alt="" class="img-empty"> 
        <slot/>
        </div>
</template>
<script>
export default {
    name: 'NoResult',
    data() {
        return {
        }
    },
    methods: {}
}
</script>
<style>
</style>
