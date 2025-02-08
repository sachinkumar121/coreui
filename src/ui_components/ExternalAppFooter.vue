<template>
  <CFooter :fixed="false" :class="visibility === 1 ? 'd-flex' : 'd-none'" class="mt-2">
    <div>
      <a href="https://www.silverskysoft.com" target="_blank">Silver Sky Soft Services, Inc</a>
      <span class="ml-1"> &copy; {{new Date().getFullYear()}}. version: 8.1</span>
    </div>
   
  </CFooter>
</template>

<script>
export default {
  name: 'ExternalAppFooter',
  props: {
    visibility: {
      type: Number,
      required: true
    }
  }
}
</script>
