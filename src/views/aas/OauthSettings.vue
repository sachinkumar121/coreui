<template>
    <div class="mt-3 pt-2">
        <table class="table table-customer-list table-bordered table-oauth">
            <tbody>
                <tr>
                    <td style="width: 33.333%">
                        <div class="text-center">
                            <p class="mb-2 fw-semibold">AAS Apps</p>
                            <button @click="$router.push('/aas/apps')" class="btn btn-success justify-content-center min-w-view">View</button>
                        </div>
                    </td>
                    <td style="width: 33.333%">
                        <div class="text-center fw-semibold">
                            <p class="mb-2">AAS Provider Credentials</p> 
                            <button @click="$router.push('/aas/provider_credentials')" class="btn btn-success justify-content-center min-w-view">View</button>
                        </div>
                    </td>
                    <td style="width: 33.333%">
                        <div class="text-center fw-semibold">
                            <p class="mb-2">AAS OAuth Accounts</p> 
                            <button @click="$router.push('/aas/oauth_accounts')" class="btn btn-success justify-content-center min-w-view">View</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style lang="css" scoped>
    .min-w-view {
        min-width: 170px;
    }
    @media (max-width: 767.98px) {
        .table-oauth, .table-oauth tbody, .table-oauth tr, .table-oauth td  {
            display: block;
        }
        .table-oauth tr td,  .table-oauth tbody, .table-oauth tr {
            width: 100% !important;
        }
        .table-oauth tr td {
            border-bottom: 1px solid var(--border-color-d9);
            padding: 1rem 0.4rem;
        }
    }
</style>