<template>
  <CSVFileUploader 
    heading="Bulk Import Bookings"
    :sample_file_url="sample_file_url"
    file_usage="booking_appointment_bulk"
  />
</template>
<script>
import CSVFileUploader from '@/ui_components/CSVFileUploader.vue';

export default {
  components: { CSVFileUploader },
  name: "Bulk Import Bookings",
  data() {
    return ({
      sample_file_url: this.$store.state.skysched_global_api_base_url + 'csv_files/users_sample.csv'
    })
  },
};
</script>