<template>
  <div>
    <CAlert 
    :color="data.type" 
    :visible="state"
    @update:show="checkState"
    dismissible
    @close="() => { $emit('alertClosed') }"
    >
      {{data.message}}
    </CAlert>
  </div>
</template>
<script>
export default {
    name: 'Alerts',
    props: ['alertData', 'show'],
    data () {
        return {
            data: this.alertData,
            state: Boolean(this.show || 0)
        }
    },   
    watch: {
      show (val) {
        this.state = Boolean(val);
      },
      alertData(val) {
        this.data = val;
      }
    },
    methods:{
      showAlert() {
        this.$emit('alertChanged');
      },
      checkState() {
        if(this.state == 0) {
          this.$emit('alertClosed');
        }
      }
    }
}
</script>