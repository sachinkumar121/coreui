<template>
    <v-select 
        v-model="api_server" 
        :options="server_options" 
        :reduce="so => so.value"
        label="label" 
        :clearable="false"
    >
    </v-select>
</template>

<script>
import useServer from '@/composables/useServer';

export default {
    name: "ServerSelector",
    setup: () => {
        const { server_options } = useServer();
        return { server_options }
    },
    emits: ['urlChange'],
    data() {
        return {
            api_server: this.$store.state.skysched_global_api_base_url
        }
    },
    watch: {
        api_server: function(val) {
            this.$emit('urlChange', val)
        }
    }
}
</script>
