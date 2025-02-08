<template>
    <div class="wrap-result-content">
        <CRow v-if="pageSections.length == 0">
            <CCol sm="12">
                <div class="py-5 text-center" style="max-width: 800px">
                    <img src="/img/no-result.svg" alt="" class="img-empty" />
                    <p class="h5 mt-4 d-block">
                        No matching operations for "{{ term }}"
                    </p>
                    <button
                        class="btn btn-primary px-4 mt-3"
                        @click.stop="$emit('showAll')"
                    >
                        Show All in Section
                    </button>
                </div>
            </CCol>
        </CRow>
        <div class="search-box-wrap">
            <CRow>
                <CCol
                    sm="12"
                    class="mb-4"
                    v-for="(pageSection, index) in pageSections"
                    :key="index"
                >
                    <h5 class="text-uppercase mb-3 me-3">
                        {{ pageSection.name }}
                    </h5>
                    <ul
                        class="ps-0 d-flex flex-wrap"
                        v-if="pageSection.operations && pageSection.operations.length > 0"
                    >
                        <CNavItem
                            class="ps-0 me-3"
                            v-for="(operation, index) in pageSection.operations"
                            :key="index"
                        >
                            <router-link
                                :to="operation.link"
                                class="d-inline-flex align-items-center justify-content-start px-3"
                            >
                                <Icon :icon="operation.icon" :height="26" />
                                <span class="ms-2">{{ operation.name }}</span>
                            </router-link>
                        </CNavItem>
                                                    
                    </ul>
                    <div class="mb-5 no-operation-div" v-else>
                        <p class="h5 mt-4 d-block">
                            No operations match search.
                        </p>
                        <button
                            class="btn btn-primary px-4 mt-0"
                            @click.stop="$emit('showAll', pageSection.slug)"
                        >
                            Show All in Section
                        </button>
                    </div>
                    
                </CCol>
            </CRow>
        </div>
    </div>
</template>

<script>
import { Icon } from '@/common/Icon'

export default {
    name: "SearchResults",
    components: {
        Icon
    },
    emits: ['showAll'],
    props: {
        pageSections: {
            type: Object
        },
        term: {
            type: String
        }
    }
}
</script>