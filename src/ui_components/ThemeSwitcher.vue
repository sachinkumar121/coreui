<template>
    <div class="theme-div">
        <input
            @change="toggleTheme"
            id="checkbox"
            type="checkbox"
            class="switch-checkbox"
        />
        <label
            for="checkbox"
            class="switch-label mb-0"
        >
            <span
                ><Icon
                    icon="tabler:moon"
                    :width="20"
                    :height="20"
                    class="theme-icon"
            /></span>
            <span
                ><Icon
                    icon="tabler:sun"
                    :width="20"
                    :height="20"
                    class="theme-icon"
            /></span>
            <div
                class="switch-toggle"
                :class="{
                    'switch-toggle-checked':
                        userTheme ===
                        'dark-theme',
                }"
            ></div>
        </label>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
import { useColorModes } from '@coreui/vue'

export default {
    name: 'ThemeSwitcher',
    setup() {
        const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme');
        return {
            colorMode,
			setColorMode,
        }
    },
    components: {
        Icon
    },
    data() {
        return {
            userTheme: 'light-theme'
        }
    },
    mounted() {
        const initUserTheme = this.getTheme() || this.getMediaPreference()
        this.setTheme(initUserTheme);
    },
    methods: {
        setTheme(theme) {
            let themeColorModeForCoreUI = theme.split("-")[0] || "dark";
            this.setColorMode(themeColorModeForCoreUI);
            localStorage.setItem('user-theme', theme)
            this.userTheme = theme
            document.documentElement.className = theme
        },
        getMediaPreference() {
            const hasDarkPreference = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches
            if (hasDarkPreference) {
                return 'dark-theme'
            } else {
                return 'light-theme'
            }
        },
        toggleTheme() {
            const activeTheme = localStorage.getItem('user-theme')
            if (activeTheme === 'light-theme') {
                this.setTheme('dark-theme')
            } else {
                this.setTheme('light-theme')
            }
        },
        getTheme() {
            return localStorage.getItem('user-theme') || 'dark-theme'
        }
    }
}
</script>
<style>
.theme-div {
    position: relative;
}
/* // theme dark/light */
.switch-checkbox {
    display: none;
}
.switch-toggle-checked,
.dark-theme .switch-toggle {
    transform: translateX(calc(var(--element-size) * 0.48)) !important;
}
/* // .theme-div {
// width: 80px;
//  height: 24px;
// } */
.switch-label {
    width: 54px;
    border-radius: var(--element-size);
    border: calc(var(--element-size) * 0.025) solid var(--accent-color);
    padding-top: 0;
    padding-bottom: calc(var(--element-size) * 0.1);
    padding-left: calc(var(--element-size) * 0.1);
    padding-right: calc(var(--element-size) * 0.1);
    font-size: calc(var(--element-size) * 0.3);
    height: 26px;
    align-items: center;
    background: #bfbfbf;
    cursor: pointer;
    display: flex;
    position: relative;
    transition: background 0.5s ease;
    justify-content: space-between;
    z-index: 1;
}
.switch-toggle {
    position: absolute;
    background-color: var(--background-color-primary);
    border-radius: 50%;
    top: 1px;
    left: 3px;
    height: calc(var(--element-size) * 0.34);
    width: calc(var(--element-size) * 0.34);
    transform: translateX(0);
    transition: transform 0.3s ease, background-color 0.5s ease;
}
</style>