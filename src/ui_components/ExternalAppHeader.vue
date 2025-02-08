<template>
    <div>
        <CHeader fixed with-subheader light :class="visibility === 1 ? 'd-flex' : 'd-none'">
            <CHeaderBrand
                class="mx-auto d-inline-flex align-items-center"
                to="/"
            >
                <img name="logo" src="/img/logo-new.png" height="34" alt="Logo" />
                <span class="text text-hidden mt-1 ms-2">SkySalon</span>
            </CHeaderBrand>
        </CHeader>
    </div>
</template>
    
<script>
export default {
    name: 'ExternalAppHeader',
    props: {
    visibility: {
      type: Number,
      required: true
    }
  }
}
</script>
<style>
.header-brand {
    font-family: 'Overpass', sans-serif;
}
</style>
    