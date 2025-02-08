<template>
  <CSVFileUploader 
    heading="Bulk Import Products/Services"
    :sample_file_url="sample_file_url"
    file_usage="products_services"
  />
</template>
<script>
import CSVFileUploader from '@/ui_components/CSVFileUploader.vue';

export default {
  components: { CSVFileUploader },
  name: "Bulk Import Products/Services",
  data() {
    return ({
      sample_file_url: this.$store.state.skysched_global_api_base_url + 'csv_files/products_services_sample.csv'
    })
  },
};
</script>