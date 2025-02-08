<template>
    <div class="p-3 border-rounded d-flex align-items-start mt-4">
        <span>
            <Icon :icon="icon" :height="27" :width="27" />
        </span>
        <div class="ps-3">
            <h6 class="mb-1 fw-600">{{ heading }}</h6>
            <p class="mb-0">{{ subheading }}</p>
        </div>
    </div>
</template>

<script>
import { Icon } from '@/common/Icon'

export default {
    name: 'TabAlert',
    components: {
        Icon
    },
    props: {
        icon: {
            type: String,
        },
        type: {
            type: String,
            required: true,
            validator(value) {
                return ['success', 'error'].includes(value);
            }
        },
        heading: {
            required: true,
            type: String,
        },
        subheading: {
            required: true,
            type: String,
        }
    }
}
</script>