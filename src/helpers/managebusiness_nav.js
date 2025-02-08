export default {
    getPage: function (userData) {
        let user_type = userData.type
        let is_dev_mode = (import.meta.env.VITE_DEPLOY_MODE || 'dev') == 'dev';
        return {
            page_name: "Manage Business",
            access_roles: [1, 2, 3, 4],
            sections: this.getSectionsArray(user_type, is_dev_mode)
        }
    },
    getSectionBySlug :function(arr, slug)     {
        return arr.find(ele => (ele.slug == slug))
    },

    getSectionsArray: function (user_type, is_dev_mode = true) {
        let arr = [];

        arr.push(this.getBusinessSection());
        arr.push(this.getAppointmentSettingsSection());
        arr.push(this.getSalesSection());
        arr.push(this.getCustomersSection());
        arr.push(this.getEmployeesSection());
        arr.push(this.getResourcesSection());
        arr.push(this.getProdSection());
        
        arr.push(this.getPackageCouponsSection());
        arr.push(this.getBusinessPurchasesSection());
        arr.push(this.getIntegrationsSection());
        arr.push(this.getInventorySection());
        arr.push(this.getPrintingSettingsSection())
        arr.push(this.getClassManageSection());
        arr.push(this.getMessageMarketingCenter());
        arr.push(this.getReportsSection());
        arr.push(this.getBulkUploadsSection());

       let sections =  arr.filter(a => user_type==1||a.access_roles.includes(user_type)).map((a) => {
            a.operations = a.operations.filter(o => user_type==1||o.access_roles.includes(user_type));
            a.name = is_dev_mode && a.feature_in_development ? `${a.name} *DEV` : a.name;
            return a;
        });
        return sections;
        
        
    },

    /* ----------- All Sections -------------------*/
    getBusinessSection: function () {
        return {
            name: 'Business',
            slug: 'business',
            access_roles: [2, 3],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Business Info',
                    icon: 'majesticons:dollar-circle-line',
                    link: '/business',
                    access_roles: [2, 3]
                },
                {
                    name: 'Business Hours',
                    icon: 'tabler:clock',
                    link: '/settings/set_business_hours',
                    access_roles: [2, 3]
                },
                {
                    name: 'Tax Setup',
                    icon: 'tabler:tax',
                    link: '/settings/tax_setup',
                    access_roles: [2, 3]
                },
                {
                    name: 'Multiple Locations',
                    icon: 'tabler:location',
                    link: '/multi_location',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Bonus Settings',
                    icon: 'icon:bonus-setting',
                    link: '/settings/bonus_settings',
                    access_roles: [2, 3]
                },
                {
                    name: 'Loyalty Settings',
                    icon: 'icon:loyalty-setting',
                    link: '/settings/loyalty',
                    access_roles: [2, 3]
                },
                /*
                removed because all settings link is now in this managebusiness_nav
                {
                    name: 'All Settings',
                    icon: 'uil:bill',
                    link: '/settings',
                    access_roles: [2, 3, 4]
                },
                */
                {
                    name: 'My Referrals',
                    icon: 'fluent:channel-share-12-regular',
                    link: '/referrals/register/list',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Donation Campaign',
                    icon: 'tabler:donation-icon',
                    link: '/donation_campaigns/list',
                    access_roles: [2, 3, 4]
                },
                ,
                {
                    name: 'POS Screen',
                    icon: 'majesticons:dollar-circle-line',
                    link: '/pos',
                    access_roles: [2, 3, 4]
                },

            ]
        }
    },
    getAppointmentSettingsSection: function () {
        return {
            name: 'Appointment Settings',
            slug: 'appointment-settings',
            access_roles: [2, 3],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Online Web Settings',
                    icon: 'tabler:world',
                    link: '/settings/online_web_settings',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Booking Settings',
                    icon: 'tabler:click',
                    link: '/settings/booking_settings',
                    access_roles: [2, 3, 4]
                },
                
                {
                    name: 'Wait List',
                    icon: 'tabler:clipboard',
                    link: '/settings/wait_list_settings',
                    access_roles: [2, 3]
                },
                {
                    name: 'Appt. Reminders',
                    icon: 'tabler:calendar-time',
                    link: '/settings/booking_reminder_settings',
                    access_roles: [2, 3]
                },
                {
                    name: 'Waiver Templates',
                    icon: 'tabler:checklist',
                    link: '/paperwork/manage_document_templates',
                    access_roles: [2, 3]
                },
                {
                    name: 'Waiver Requirements',
                    icon: 'tabler:list-numbers',
                    link: '/paperwork/manage_paperwork_requirements',
                    access_roles: [2, 3]
                },
                {
                    name: 'Custom SMS/Texts',
                    icon: 'tabler:message-plus',
                    link: '/settings/custom_templates_sms',
                    access_roles: [2, 3]
                },
                
              
            ]
        }
    },
    getMessageMarketingCenter: function(){
        return {
            name: 'Messages/Marketing',
            slug: 'messages-marketing',
            access_roles: [2, 3],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Conversations',
                    icon: 'tabler:device-mobile-message',
                    link: '/conversation-manager',
                    access_roles: [2, 3]
                },
                {
                    name: 'Message Center',
                    icon: 'tabler:device-mobile-message',
                    link: '/business_message_center',
                    access_roles: [2, 3]
                },
                {
                    name: 'Marketing Templates',
                    link: '/manage_marketing/list',
                    icon: 'lucide:layout-template',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Marketing Campaigns',
                    link: '/manage_marketing/campaigns',
                    icon: 'material-symbols:campaign-outline-rounded',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'SMS/Text Templates',
                    link: '/settings/custom_templates_sms',
                    icon: 'lucide:layout-template',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Message Rates',
                    link: '/business_message_center/info_message_rates',
                    icon: 'material-symbols:campaign-outline-rounded',
                    access_roles: [2, 3, 4]
                },
                

            ]
        }
    },
    getSalesSection: function () {
        return {
            name: 'Sales/Invoice',
            slug: 'sales',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'New Sale',
                    icon: 'majesticons:dollar-circle-line',
                    link: '/sale_purchase_order',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Invoice List',
                    icon: 'gg:loadbar-doc',
                    link: '/invoices',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Invoice Payments',
                    icon: 'uil:bill',
                    link: '/invoices/payments',
                    access_roles: [2, 3, 4]
                }
            ]
        }
    },

    getCustomersSection: function () {
        return {
            name: 'Customers',
            slug: 'customers',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Clients/Customers',
                    icon: 'material-symbols:person-4-outline-rounded',
                    link: '/customers',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Create New Purchase',
                    icon: 'material-symbols:note-add-outline',
                    link: '/customer_purchase/create',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Purchased Packages',
                    icon: 'uil:invoice',
                    link: '/customers/purchased_packages',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Wait List',
                    icon: 'tabler:file-dots',
                    link: '/manage_waitlist',
                    access_roles: [2, 3, 4]
                },

            ]
        }
    },
    getEmployeesSection: function () {
        return {
            name: 'Employees',
            slug: 'employees',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Employee List',
                    icon: 'material-symbols:person-4-outline-rounded',
                    link: '/users',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Add New Employee',
                    icon: 'material-symbols:note-add-outline',
                    link: '/users/add',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Multiple Employees',
                    icon: 'material-symbols:note-add-outline',
                    link: '/users/bulk-add',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Teams/Departments',
                    icon: 'tabler:layout-grid-add',
                    link: '/departments',
                    access_roles: [2, 3, 4]
                }
            ]
        }
    },

    getResourcesSection: function () {
        return {
            name: 'Rooms, Equipment/Resources/Facilities',
            slug: 'resources',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
               /* {
                    component: 'CNavItem',
                    name: 'Manage Facility Types',
                    link: '/resources/types',
                    icon: 'material-symbols:tab-group-outline-rounded',
                    access_roles: [2, 3, 4]
                },  
                Facility types is not shown because we have transitioned to standard names
                */
                {
                    component: 'CNavItem',
                    name: 'Manage Rooms',
                    link: '/resources/rooms',
                    icon: 'material-symbols:file-copy-outline-rounded',
                    access_roles: [2, 3, 4]
                },
                {
                    component: 'CNavItem',
                    name: 'Manage Equipment',
                    link: '/resources/equipment',
                    icon: 'material-symbols:file-copy-outline-rounded',
                    access_roles: [2, 3, 4]
                }
                ,
                {
                    component: 'CNavItem',
                    name: 'All Resources',
                    link: '/resources/all_resources_list',
                    icon: 'material-symbols:file-copy-outline-rounded',
                    access_roles: [2, 3, 4]
                }

                
            ]
        }
    },

    getProdSection: function () {
        return {
            name: 'Products & Services',
            slug: 'products',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Products',
                    link: '/products/list',
                    icon: 'mdi:box-variant-closed',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Product Category',
                    link: '/product_category',
                    icon: 'material-symbols:category-outline-rounded',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Services',
                    link: '/services/list',
                    icon: 'ri:service-line',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Service Category',
                    link: '/service_category',
                    icon: 'material-symbols:category-outline-rounded',
                    access_roles: [2, 3, 4]
                },
               
            ]
        }
    },
    getInventorySection: function(){
        return {
            name: 'Inventory Management',
            slug: 'inventory-management',
            access_roles: [2, 3, 4],
            feature_in_development: true,
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Manage Stock',
                    link: '/stocks/manage',
                    icon: 'tabler:circles',
                    access_roles: [2, 3]
                },
                {
                    name: 'Take Stock Count',
                    link: '/inventory/count',
                    icon: 'tabler:clipboard-text',
                    access_roles: [2, 3]
                },
               
            ]
        }
    },
    getClassManageSection: function(){
        return {
            name: 'Class Management',
            slug: 'class-management',
            access_roles: [2, 3, 4],
            feature_in_development: true,
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Subjects',
                    link: '/subjects',
                    icon: 'tabler:book',
                    access_roles: [2, 3,4]
                },
                {
                    name: 'Courses',
                    link: '/courses',
                    icon: 'tabler:notebook',
                    access_roles: [2, 3,4]
                },
                {
                    name: 'Classes',
                    link: '/classes',
                    icon: 'tabler:vector-bezier-arc',
                    access_roles: [2, 3,4]
                },
               
            ]
        }
    },
    getPackageCouponsSection: function () {
        return {
            name: 'Packages & Coupons',
            slug: 'packages-coupons',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Manage Packages',
                    link: '/packages/list',
                    icon: 'ant-design:setting-outlined',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Manage Coupons',
                    link: '/coupons/list',
                    icon: 'mdi:coupon-outline',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Manage Plans',
                    link: '/plans/list',
                    icon: 'tabler:list-check',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Subscriptions',
                    link: '/subscriptions',
                    icon: 'eos-icons:product-subscriptions-outlined',
                    access_roles: [2, 3, 4]
                },
            ]
        }
    },

    getBusinessPurchasesSection: function () {
        return {
            name: 'Business Subscriptions/Purchases',
            slug: 'business-purchases',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Purchased Items',
                    link: '/standalonepurchases/purchased_packages',
                    icon: 'icon-park-outline:agreement',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Past Orders',
                    link: '/standalonepurchases/past_orders',
                    icon: 'mdi:shop-time-outline',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Payment Profiles',
                    link: '/standalonepurchases/payment_profiles',
                    icon: 'mdi:account-payment-outline',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Subscriptions',
                    link: '/standalonepurchases/automatic_purchases',
                    icon: 'eos-icons:product-subscriptions-outlined',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Buy Credits / Subscriptions',
                    link: '/standalonepurchases',
                    icon: 'icon-park-outline:doc-success',
                    access_roles: [2, 3, 4]
                }
            ]
        }
    },

   
    getReportsSection: function () {
        return {
            name: 'Reports',
            slug: 'reports',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'All Reports',
                    icon: 'mdi:file-document-outline',
                    link: '/reports/all',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Top selling items',
                    icon: 'mdi:arrow-top-right-bold-box-outline',
                    link: '/reports/items',
                    access_roles: [2, 3, 4]
                },
                {
                    name: 'Revenue by employee',
                    icon: 'tabler:report-money',
                    link: '/reports/revenue',
                    access_roles: [2, 3, 4]
                }
            ]
        }
    },

    getBulkUploadsSection: function () {
        return {
            name: 'File Based Uploads',
            slug: 'file-based-uploads',
            access_roles: [2, 3, 4],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Upload Customers',
                    icon: 'material-symbols:person-4-outline-rounded',
                    link: '/customers-upload',
                    access_roles: [2, 3]
                },
                {
                    name: 'Upload Products/Services',
                    icon: 'fluent-mdl2:product-variant',
                    link: '/products',
                    access_roles: [2, 3]
                },
                {
                    name: 'Upload Appointments',
                    icon: 'fluent-mdl2:product-variant',
                    link: '/bookings/bookingsbulkupload',
                    access_roles: [2, 3]
                }
            ]
        }
    },
    getIntegrationsSection: function () {
        return {
            name: 'Integrations',
            slug: 'integrations',
            access_roles: [2, 3],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Manage Integrations',
                    icon: 'tabler:settings-automation',
                    link: '/integrations',
                    access_roles: [2, 3]
                }
            ]
        }
    },
    getPrintingSettingsSection: function () {
        return {
            name: 'Printing',
            slug: 'Printing',
            access_roles: [2, 3],
            __comment: "access_roles above is at section level",
            operations: [
                {
                    name: 'Receipt Printing',
                    icon: 'tabler:settings-automation',
                    link: '/settings/receipt_print_settings',
                    access_roles: [2, 3]
                }
            ]
        }
    },
    
}