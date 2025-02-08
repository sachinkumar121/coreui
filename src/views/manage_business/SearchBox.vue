<template>
    <div class="search-box-wrap position-relative">
        <input
            type="text"
            placeholder="Navigate Settings"
            class="search-box form-control"
            v-model.trim="searchTerm"
            ref="searchElement"
            @input="onSearching"
            @blur="null"
            @focus="$emit('onFocus')"
        />
        <span aria-hidden="true" v-if="!searchTerm && showShortcutKeys">
            <span class="keyboard-icon-wrap" aria-hidden="true">
                <span class="keyboard-shortcut-icon">{{ controlKey }}</span>
                <span class="keyboard-shortcut-icon">K</span>
            </span>
        </span>

        <div class="search-button search-button-loader" v-if="searching">
            <div class="loader loader--style1">
                <Icon icon="icon:loading" />
            </div>
        </div>

        <button
            class="search-button"
            v-else-if="searchTerm"
            @click="onClearSearch"
        >
            <Icon icon="ion:close-circle-sharp" :height="34" />
        </button>
        <button class="search-button" v-else-if="!showShortcutKeys">
            <Icon icon="tabler:search-icon" :height="34" />
        </button>
    </div>
</template>

<script>
import { debounce } from 'lodash'
import { Icon } from '@/common/Icon'

export default {
    name: "SearchBox",
    components: {
        Icon
    },
    emits: ['input', 'clearSearch', 'onFocus'],
    props: {
        initialFocus: {
            type: Boolean,
            default: false
        },
        showShortcutKeys: {
            type: Boolean,
            default: false
        },
        initialTerm: {
            type: String
        }
    },
    watch: {
        initialTerm(val) {
            this.searchTerm = val || '';
        },
        initialFocus(value) {
            value ? this.$refs.searchElement.focus() : this.$refs.searchElement.blur();
        }
    },
    data() {
        return {
            searchTerm: this.initialTerm,
            searching: false
        }
    },
    computed: {
        controlKey() {
            let userOs = navigator.platform || '';
            let osType = userOs.toLowerCase();
            return osType.includes('mac') ? '⌘' : 'Ctrl'; 
        }
    },
    mounted() {
        if (this.initialFocus) {
            this.$refs.searchElement.focus();
        }
        this.searchTerm = this.initialTerm;
    },
    updated() {
        if (this.initialFocus) {
            this.$refs.searchElement.focus();
        }
    },
    methods: {
        onSearching() {
            this.searching = true
            let that = this;
            debounce(() => {
                that.$emit('input', that.searchTerm);
                that.searching = false
            }, 300)()
        },
        onClearSearch() {
            this.$emit('clearSearch');
            this.searchTerm = null;
        }
    }
}
</script>
