<template>
    <button :type="type" :class="['btn', variant ? `btn-${variant}-${color}` : `btn-${color}`, { [`btn-${size}`]: size, active: active, disabled: disabled, }, shape]" :disabled="disabled" @click="handleClick">
        <span class="button-text"><slot /></span>
        <div class="svg-wrap">
            <TrippleDotsBouncing />
        </div>
    </button>
</template>

<script>
import TrippleDotsBouncing from '@/common/svg/TrippleDotsBouncing.vue'
export default {
    name: 'ButtonLoader',
    components: {
        TrippleDotsBouncing,
    },
    emits: ['click'],
    props: {
        active: {
            type: Boolean,
            default: false,
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
        },
        color: {
            type: String,
            validator: (value) => {
                // The value must match one of these strings
                return [
                    'primary',
                    'secondary',
                    'success',
                    'danger',
                    'warning',
                    'info',
                    'dark',
                    'light',
                    'transparent',
                ].includes(value)
            },
        },
        shape: {
            type: String,
            default: undefined,
            required: false,
            validator: (value) => {
                // The value must match one of these strings
                return [
                    'rounded',
                    'rounded-top',
                    'rounded-end',
                    'rounded-bottom',
                    'rounded-start',
                    'rounded-circle',
                    'rounded-pill',
                    'rounded-0',
                    'rounded-1',
                    'rounded-2',
                    'rounded-3',
                ].includes(value)
            },
        },
        size: {
            type: String,
            default: undefined,
            required: false,
            validator: (value) => {
                return ['sm', 'lg'].includes(value)
            },
        },
        type: {
            type: String,
            default: 'button',
            required: false,
            validator: (value) => {
                return ['button', 'submit', 'reset'].includes(value)
            },
        },
        variant: {
            type: String,
            default: undefined,
            required: false,
            validator: (value) => {
                return ['ghost', 'outline'].includes(value)
            },
        },
    },
    methods: {
        handleClick(event) {
            this.$emit('click', event)
        },
    },
}
</script>

<style lang="scss">
.btn svg.svg-loader {
    width: 64px;
    height: 27px;
    position: relative;
    top: -3px;
    display: inline-block;
    margin-top: -10px;
}
.btn {
    .svg-wrap {
        display: none;
    }
    &.active-svg {
        position: relative;
        .button-text {
            visibility: hidden;
        }
        .svg-wrap {
            position: absolute;
            width: 100%;
            left: 0;
            top: 0;
            height: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
