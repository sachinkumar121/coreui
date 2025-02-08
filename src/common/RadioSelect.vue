<template>
    <div class="px-3 d-flex align-items-center">
        <label class="form-check me-3 form-check-custom" :class="{ active: picked == 'default' }" for="radioDefault">
            <input class="form-check-input" v-model="picked" type="radio" name="selectRadio" id="radioDefault" :value="'default'" @change="valueChange">
            <label class="form-check-label" for="radioDefault">
            Default
            </label>
        </label>
        <label class="form-check me-3 form-check-custom" :class="{ active: picked == 'customize' }" for="radioCustomize">
            <input class="form-check-input" v-model="picked" type="radio" name="selectRadio" id="radioCustomize" :value="'customize'" @change="valueChange">
            <label class="form-check-label" for="radioCustomize">
            Customize
            </label>
        </label>
    </div> 
</template>
  
<script>


export default {
    name: 'radioSelect',
    emits: ['valueChange'],
    props: {
        defaultVal: {
            type: String,
            default: 'default'
        }
    },
    data() {
        return {
            picked: this.defaultVal,
        }
    },
    methods: {
        valueChange() {
            this.$emit('valueChange', this.picked);
        }
    },
    watch: {
        defaultVal: function(newVal) {
            this.picked = newVal;
        }
    }
}
</script>
<style lang="scss">
.form-check-custom {
    padding: 10px 20px 10px 38px !important;
    background: rgb(86 57 243 / 6%);
    border-radius: 10px;
    &.active {
        background: rgb(86 57 243 / 15%);
    }
    label {
        margin-bottom:0;
        padding-left: 11px;
        position: relative;
        top: 1px;
    }
    .form-check-input {
        border-color: #5639f3;
        &:checked {
            background-color: #5639f3;
            border-color: #5639f3;
        }
    }
}
</style>