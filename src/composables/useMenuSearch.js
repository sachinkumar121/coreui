import managebusinessnav from '@/helpers/managebusiness_nav'
import { useStore } from 'vuex'
import { ref } from 'vue'
import utils_lib from '@/helpers/utils_lib'

export default function useMenuSearch() {
    let pageSections = ref([]);
    let searchTerm = ref(null);
    let originalPageData = ref(null);
    const store = useStore();

    const populatePageSections = () => {
        if (originalPageData.value == null) {
            let userData = store.state.user_data
            originalPageData.value = managebusinessnav.getPage(userData)
            pageSections.value = JSON.parse(JSON.stringify(originalPageData.value.sections))
        } else {
            pageSections.value = JSON.parse(JSON.stringify(originalPageData.value.sections))
        }
    }
    
    const searchMenus = () => {
        if (searchTerm.value && searchTerm.value.length > 0) {
            store.commit('setSearchPreference', {key: 'manage_business', value: searchTerm.value});
            pageSections.value = utils_lib.filterMatches(originalPageData.value.sections, {
                name: searchTerm.value,
            })
        } else {
            populatePageSections()
            store.commit('setSearchPreference', {key: 'manage_business', value: null});
        }
    }

    const showAll = (slug = null) => {
        if (!slug) {
            resetSearchTerm();
            populatePageSections();
            searchTerm.value = null;
            return
        }
        let section = managebusinessnav.getSectionBySlug(originalPageData.value.sections, slug);

        pageSections.value.map((p) => {
            if (p.slug == slug) {
                p.operations = JSON.parse(JSON.stringify(section.operations));
            }
            return p
        })
    }

    const resetSearchTerm = () => {
        searchTerm.value = null;
        searchMenus();
    }
    
    const setSearchTerm = (t) => {
        searchTerm.value = t;
        searchMenus();
    }

    return {
        pageSections,
        searchTerm,
        originalPageData,
        populatePageSections,
        searchMenus,
        showAll,
        setSearchTerm,
        resetSearchTerm
    }
}