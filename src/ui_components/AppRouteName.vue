<template>
    <h5 class="mb-0 title-page ms-2 fw-500">{{ name }}</h5>
</template>
<script>
    import appHelper from '@/helpers/app_helper'

    export default {
        name: "AppRouteName",
        computed: {
            name() {
                let name = '';
                switch (this.$route.name) {
                    case 'Resources':
                        name = this.$route.params.standard_resource_name;
                        break;
                    case 'Add Resource':
                        name = `Add ${this.$route.params.standard_resource_name}`;
                        break;
                    case 'Edit Resource':
                        name = `Edit ${this.$route.params.standard_resource_name}`;
                        break;
                    case 'Conversation Manager':
                        name = 'Conversation Manager';
                        break;
                        
                    default:
                        name = this.$route.name;
                        break;
                }
                return name ? appHelper.titleCase(name): '';
            }
        }
    }
</script>