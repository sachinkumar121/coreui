<template>
  <CSVFileUploader 
    heading="Bulk Import Customers"
    :sample_file_url="sample_file_url"
    file_usage="user"
  />
</template>
<script>
import CSVFileUploader from '@/ui_components/CSVFileUploader.vue';

export default {
  components: { CSVFileUploader },
  name: "Bulk Import Customers",
  data() {
    return ({
      sample_file_url: this.$store.state.skysched_global_api_base_url + 'csv_files/users_sample.csv'
    })
  },
};
</script>