<template>
    <div class="d-flex justify-content-end">
        <div class="search-box-wrap position-relative">
            <input 
                type="text" 
                class="form-control pe-5" 
                placeholder="Search items"
                v-model.trim="searchTerm"
                @input="onSearching"
            >
            <button class="search-button position-absolute">
                <Icon icon="ion:close-circle-sharp" :height="34" v-if="searchTerm" @click="onClearSearch"/>
                <Icon icon="tabler:search-icon" :height="34" v-else/>
            </button>
        </div>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
import { debounce } from 'lodash'
export default {
    name: 'SearchBox',
    components: {
        Icon,
        debounce,
    },
    emits: ['input', 'clearSearch'],
    props: {
        initialTerm: {
            type: String
        }
    },
    watch: {
        initialTerm(val) {
            this.searchTerm = val || '';
        }
    },
    data() {
        return {
            searchTerm: this.initialTerm
        }
    },
    mounted() {
        this.searchTerm = this.initialTerm;
    },

    methods: {
        onSearching() {
            let that = this;
            debounce(() => {
                that.$emit('input', that.searchTerm);
            }, 300)()
        },
        onClearSearch() {
            this.searchTerm = '';
            this.$emit('clearSearch');
        }
    }
}
</script>
<style lang="scss" scoped>
    .search-box-wrap {
        input {
            font-size: 16px;
            font-weight: 500;
            background: var(--background-light);
            color: var(--text-primary-color);
        }
        .search-button {
            right: 4px;
            top: 5px;
            border: 0;
            display: inline-flex;
            position: absolute;
            width: 35px;
            height: 35px;
            align-items: center;
            color: var(--text-primary-color);
            background-color: var(--background-light);
            &:before {
                content: '';
                left: -4px;
                top: 2px;
                height: 34px;
                width: 1px;
                background-color: var(--text-gray);
                position: absolute;
                display: inline-block;
                z-index: 9;
            }
            .loader {
                top: -2px;
                left: 4px;
                position: relative;
            }
        }
    }
    
</style>