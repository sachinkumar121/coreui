<template>
    <div class="data-table">
        <div class="data-table-table">
            <DataTable 
                id="report-table"
                class="table table-striped table-hover" 
                :data="$attrs.data" 
                :columns="$attrs.columns"
                :options="options" 
                ref="reportTable"
            />
        </div>
    </div>
</template>

<script>
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net';
DataTable.use(DataTablesLib);

export default {
    name: "ReportDataTable",
    mounted() {
        this.dt = this.$refs.reportTable.dt;
    },
    components: {
        DataTable
    },
    data() {
        return {
            dt: null,
            options: {
                showSearchFilter: false,
                showPerPage: false,
                showEntriesInfo: false,
                defaultPerPage: 50,
                showPagination: false,
                showDownloadButton: false,
                searching: false,
                ordering: false,
                responsive: true,
                bLengthChange: false,
                bAutoWidth: false,
                bInfo : false,
                scrollX : true,
                pagingType: 'full_numbers',
                dom: '<"d-none"i>rt<"bottom pagination-custom d-flex justify-content-center mt-3"flp><"clear">',
                language: {
                    paginate: {
                        first: '«',
                        last: '»',
                        next: '›',
                        // or '→'
                        previous: '‹', // or '←' 
                        // previous: '<i class="fa fa-fw fa-long-arrow-left">' 
                    }
                }
            }
        }
    },
    unmounted() {
        this.dt.clear().destroy();
    }
}
</script>
