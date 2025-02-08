<template>
    <svg class="icon-purchased-packages" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.375 2.25H5.625C5.00368 2.25 4.5 2.75368 4.5 3.375V23.625C4.5 24.2463 5.00368 24.75 5.625 24.75H21.375C21.9963 24.75 22.5 24.2463 22.5 23.625V3.375C22.5 2.75368 21.9963 2.25 21.375 2.25Z" stroke="black" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 2.25H14.0625V11.25L11.5312 9L9 11.25V2.25Z" stroke="black" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 15.75H14.625M9 19.125H18" stroke="black" stroke-width="2.25" stroke-linecap="round"/>
        </svg>
</template>    
<script>
export default {
    name: 'IconPurchasedPackages'
}
</script>
<style lang="scss" scoped>
:root.dark-theme {
    svg {
        path {
            fill: none!important;
            stroke: #fff;
        }
    }
}
</style>