<template>
<div>
    <div class="d-flex font-overpass">
        <AppSideBar />
        <div class="w-100 section-right">
            <AppHeader class="print-d-none" />
            <CContainer fluid class="wrap-body">
                 <CCard class="card-custom mx-n-15 border-0">
                    <CCardBody class="p-2 p-sm-3 table-invoice-body">
                        <CRow class="gx-0">
                            <CCol class="mb-2">
                                <table class="w-100 table-top-invoice">
                                    <tr>
                                        <td>
                                            <div class="d-flex">
                                                <div class="business-img">
                                                    <img src="../../public/img/upwork.png" alt="">
                                                </div>
                                                <div class="ms-2">
                                                    <p class="mb-0"><b>John Doe</b></p>
                                                    <p class="mb-0">business@info.com</p>
                                                    <p class="mb-0">916000555</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-end">
                                            <p class="mb-0">Silver Sky,</p>
                                            <p class="mb-0">23 NW 26th Court,</p>
                                            <p class="mb-0">Fort Lauderdale, Fl,</p>
                                            <p class="mb-0">33311 United States</p>
                                        </td>
                                    </tr>
                                </table>
                            </CCol>
                        </CRow>
                        <CRow class="gx-0">
                            <CCol class="gray-section mb-3">
                                <table class="w-100">
                                    <tbody>
                                        <tr>
                                            <td width="75%">
                                                <p class="mb-0"><b>Invoice To:</b></p>
                                                <p class="mb-0">Narmada vishal</p>
                                                <p class="mb-0">23 NW 26th Court, Fort Lauderdale,fl, 33311  United States.</p>
                                                <p class="mb-0">9160000000</p>   
                                                <p class="mb-0">mwebInformatic@gmail.com</p>
                                            </td> 
                                            <td width="25%" class="text-end">
                                                <p class="mb-0"><b>Invoice Number:</b></p>
                                                <p class="mb-0">338007002665</p>
                                                <p class="mb-0">Due date: Jun 21, 2022</p>   
                                                <a href=""><u>Booking Details</u></a>   
                                                <!-- <p class="mb-0">classicyoga@gmail.com</p> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CCol>
                        </CRow>
                        <CRow class="gx-0">
                            <CCol>
                                <div class="table-responsive">
                                <table bordered class="table table-bordered table-custom table-invoice">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Qty</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr>
                                            <td>Swedish massage choice 160 mins</td>
                                            <td>1</td>
                                            <td>
                                                $260
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Service Tax (6.625%)</td>
                                            <td></td>
                                            <td>
                                                $17.23
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Service surcharge (4%)</td>
                                            <td></td>
                                            <td>
                                                $10.4
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Total</td>
                                            <td>
                                                $287.63
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Paid</td>
                                            <td>
                                                $0
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Due</td>
                                            <td>
                                                $287.63
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </CCol>
                        </CRow>
                        <CRow class="gx-0 print-d-none">
                            <CCol md="12" lg="6">
                                <CAccordion flush class="custom-accordian">
                                    <CAccordionItem>
                                        <CAccordionHeader>
                                        Payment Operations
                                        </CAccordionHeader>
                                        <CAccordionBody class="">
                                        <div class="">
                                            <button class="btn btn-success me-2 mb-2">
                                                <Icon icon="tabler:device-tablet" :height="19"></Icon> Take Payment on Device</button>
                                            <button class="btn btn-success mb-2"><Icon icon="tabler:credit-card" :height="19"></Icon> Pay by Card on File</button>
                                        </div>
                                        <div class="">
                                            <button class="btn btn-dark-new me-2 mb-2"><Icon icon="tabler:notes-off" :height="19"></Icon> Remove Cancellation Charges</button>
                                            <button class="btn btn-dark-new mb-2"><Icon icon="tabler:receipt-refund" :height="19"></Icon> Refund on Device</button>
                                        </div>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>
                            </CCol>
                            <CCol md="12" lg="6">
                                <div class="d-md-flex justify-content-lg-end">
                                    <button class="btn btn-primary-new me-2 mb-2 mb-md-0"><Icon icon="tabler:mail" :height="19"></Icon> Email Invoice</button>
                                    <button class="btn btn-primary-new"><Icon icon="tabler:printer" :height="19"></Icon> Print Invoice on Device</button>
                                </div>
                            </CCol>
                        </CRow>
                        <CRow class="gx-0 print-d-none">
                            <CCol>
                                <hr />
                            </CCol>
                        </CRow>
                        <CRow class="gx-0">
                            <CCol>
                                <div class="table-responsive">
                                    <table bordered class="table table-bordered table-custom">
                                        <thead>
                                            <tr>
                                                <th>Methods</th>
                                                <th>Card Source</th>
                                                <th>Operation</th>
                                                <th>Payment Date</th>
                                                <th>Transaction Number</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="d-none">
                                                <td>Swedish massage choice 160 mins</td>
                                                <td>1</td>
                                                <td>$260</td>
                                                <td>Swedish massage choice 160 mins</td>
                                                <td>1</td>
                                                <td>$260</td>
                                            </tr>
                                            <tr>
                                                <td colspan="4"></td>
                                                <td><b>Total</b></td>
                                                <td>$287.63</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="">
                                    <CCol><CFormCheck label="Include payment record in Print/PDF" /></CCol>
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
                
            </CContainer>
            <AppFooter />
        </div>
        
    </div>
</div>
   
</template>
<script>
    import AppSideBar from '@/ui_components/AppSidebar';
    import AppHeader from '@/ui_components/AppHeader';
    import AppFooter from '@/ui_components/AppFooter';
    import {
        Icon
    } from '@/common/Icon';
    
    export default {
        components: {
            Icon,
            AppSideBar,
            AppHeader,
            AppFooter
        },
        mounted() {},
        data() {
            return {
                visible: true,
                collapseSidebar: false
            }
        },
        methods: {
            toggleSidebar() {
                // console.warn('adaa')
                this.collapseSidebar=!this.collapseSidebar
            }
        }
    }
        
   
</script>
<style scoped lang="scss">
    .mx-n-15 {
        margin-right: -12px;
        margin-left: -15px;
    }
    .print-img {
        display: none;
    }
    .business-img {
        background-color: #c3c3c3;
        width: 60px;
        max-height: 60px;
        display: flex;
        padding: 5px;
         -webkit-print-color-adjust: exact; 
             flex-flow: inherit;
        align-items: center;
        img {
            width: 100%;
        }
    }
    .gray-section {
        border-radius: 5px;
        background-color: var(--background-gray-section);
        -webkit-print-color-adjust: exact; 
        padding: 10px;
        td {
            vertical-align: top;
        }
    }
    .table-invoice{
        th, td {
            &:nth-child(2) {
                text-align: center;
            }
            &:nth-child(3) {
                text-align: right;
            }
        }
    }
    
    @media print {
        body {
            -webkit-print-color-adjust: exact;
        }
        body, .card-body, table th, table td, .footer {
            color: #000;
        }
        .gray-section {
            border-radius: 5px;
            background-color: #EBEBEB !important;
            -webkit-print-color-adjust: exact; 
        }
        .sidebar-outer {
            display: none;
        }
        .sidebar-outer + .section-right {
            padding-left: 0;
        }
        .print-d-none, .footer {
            display: none;
        }
        .print-img {
            display: block;
            width: 200px;
        }
        .mb-3, .mb-2 {
            margin-bottom:5px !important;
        }
        .table-custom {
            padding: 0.2rem 0.4rem;
            td, th {
                font-size: 13px;
                padding: 0.2rem 0.4rem;
            }
        }
        table {
            p {
                font-size: 13px;
            }
        }
    }
    @media (max-width: 480px) {
        .table-invoice-body {
            table:not(.table-custom) {
                td, tr {
                    display: block;
                    text-align: left !important;
                }
                td {
                    margin-bottom: 8px;
                }
            }
        }
        .gray-section {
            td {
                width: 100%;
            }
        }
        
    }
</style>