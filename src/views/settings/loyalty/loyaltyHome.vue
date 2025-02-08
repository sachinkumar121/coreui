<template>
  <div class="d-flex gap-2">
  <CButton color="primary" v-on:click="this.$router.push('loyalty/loyalty_setup')">Loyalty Setup</CButton>
  <CButton color="primary" v-on:click="this.$router.push('loyalty/loyalty_redemption')">Loyalty Redemption</CButton>
</div>
</template>

<script>
    export default {
        name: "loyaltyHome"
    }
</script>

<style scoped>

</style>
