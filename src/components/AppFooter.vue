<template>
  <div class="mobile-footer">
  <CFooter class="mt-4 " >
      <div>
          <a href="https://www.silverskysoft.com" target="_blank">Silver Sky Soft Services, Inc</a>
          <span class="ms-1"
              > &copy; {{ new Date().getFullYear() }} version: 8.25</span
          >
      </div>
  </CFooter>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>