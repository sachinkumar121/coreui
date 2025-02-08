export default [
  {
    component: 'CSidebarNav',
    _children: [
      {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'tabler:layout-dashboard',
        utype: [2,3,4]
      },
      {
        component: 'CNavGroup',
        name: 'Class Management',
        icon: 'tabler:float-center',
        utype: [2,3,4],
        feature_in_development: true,
        items: [
          {
            component: 'CNavItem',
            name: 'Subjects',
            to: '/subjects',
            utype: [2,3,4]
          },
          {
            component: 'CNavItem',
            name: 'Courses',
            to: '/courses',
            utype: [2,3,4]
          },
          {
            component: 'CNavItem',
            name: 'Classes',
            to: '/classes',
            utype: [2,3,4]
          },
        ]
      },
      {
        component: 'CNavItem',
        name: 'Bookings',
        to: '/bookings',
        icon: 'tabler:address-book',
        utype: [2,3,4]
      },
      {
        component: 'CNavItem',
        name: 'WaitList',
        to: '/manage_waitlist',
        icon: 'tabler:file-dots',
        utype: [2,3,4]
      },
      {
        component: 'CNavItem',
        name: 'Business',
        to: '/business/list',
        icon: 'tabler:businessplan',
        utype: [1]
      },
      {
        component: 'CNavItem',
        name: 'App Logs',
        to: '/app_logs',
        icon: 'tabler:file-info',
        utype: [1]
      },
      {
        component: 'CNavGroup',
        name: 'Sales / Invoices',
        icon: 'tabler:file-chart',
        utype: [2,3,4],
        items: [
            {
              component: 'CNavItem',
                name: 'New Sale',
                to: '/sale_purchase_order',
            },
            {
              component: 'CNavItem',
              name: 'Invoice List',
              to: '/invoices',
            },
            {
              component: 'CNavItem',
              name: 'Invoice Payments',
              to: '/invoices/payments',
            }
          ]
      },
      {
        component: 'CNavGroup',
        name: 'Customers',
        icon: 'tabler:users',
        utype: [2,3,4],
        items: [
            {
                component: 'CNavItem',
              name: 'Customers',
              to: '/customers',
              utype: [2,3,4]
            },

            {
                component: 'CNavItem',
                name: 'Create New Purchase',
                to: '/customer_purchase/create',
                utype: [2,3,4]
            },
            {
                component: 'CNavItem',
                name: 'Purchased Packages',
                to: '/customers/purchased_packages',
                utype: [2,3,4]
            }
          ]
      },
 
    
      {
        component: 'CNavGroup',
        name: 'Resources/Rooms',
        icon: 'tabler:border-all',
        utype: [],
        items: [
          {
            component: 'CNavItem',
            name: 'Manage Res. Groups',
            to: '/resources/types',
            utype: []
          },
          {
            component: 'CNavItem',
            name: 'Manage Resources',
            to: '/resources',
            utype: []
          }
        ]
      },

      {
        component: 'CNavGroup',
        name: 'Facilities',
        icon: 'tabler:border-all',
        utype: [2,3,4],
        items: [
          {
            component: 'CNavItem',
            name: 'Rooms',
            to: '/resources/rooms',
            utype: [2,3,4]
          },
          {
            component: 'CNavItem',
            name: 'Equipment',
            to: '/resources/equipment',
            utype: [2,3,4]
          }
        ]
      },
     

      {
        component: 'CNavItem',
        name: 'Employees',
        to: '/users',
        icon: 'tabler:briefcase',
        utype: [2,3],
      },
      {
        component: 'CNavItem',
        name: 'Teams/Departments',
        to: '/departments',
        icon: 'tabler:layout-grid-add',
        utype: [2,3,4],
      },

      {
        component: 'CNavGroup',
        name: 'Products & Services',
        icon: 'tabler:checkup-list',
        utype: [1,2,3],
        items: [
          {
            component: 'CNavItem',
            name: 'Products',
            to: '/products/list',
          },
          {
            component: 'CNavItem',
            name: 'Product Category',
            to: '/product_category',
          },
          {
            component: 'CNavItem',
            name: 'Services',
            to: '/services/list',
          },
          {
            component: 'CNavItem',
            name: 'Service Category',
            to: '/service_category',
          },
          {
            component: 'CNavItem',
            name: 'Manage Packages',
            to: '/packages/list',
          },
          {
            component: 'CNavItem',
            name: 'Manage Coupons',
            to: '/coupons/list',
          },
        ]
      },
      {
        component: 'CNavItem',
        name: 'My Availability',
        to: '/tbd_myschedule',
        icon: 'tabler:calendar-event',
        utype: [2,3,4]
      },
      {
        component: 'CNavItem',
        name: 'Conversations',
        to: '/business_message_center',
        icon: 'tabler:device-mobile-message',
        utype: [2,3,4]
      },
      {
        component: 'CNavItem',
        name: 'Conversation Manager',
        to: '/conversation-manager',
        icon: 'tabler:device-mobile-message',
        utype: [2,3,4]
      },
      {
        component: 'CNavItem',
        name: 'Settings',
        to: '/settings',
        icon: 'tabler:settings',
        utype: [2,3]
      },
      {
        component: 'CNavGroup',
        name: 'Inventory',
        icon: 'cil:line-style',
        utype: [2,3,4],
        feature_in_development: true,
        items: [
          {
            component: 'CNavItem',
            name: 'Manage Stocks',
            to: '/stocks/manage',
            utype: [2,3,4]
          },
          {
            component: 'CNavItem',
            name: 'Inventory Count',
            to: '/inventory/count',
            utype: [2,3,4]
          }
        ]
      },
      {
        component: 'CNavItem',
        name: 'Admin Settings',
        to: '/app_admin_settings',
        icon: 'tabler:file-settings',
        utype: [1]
      },
      {
        component: 'CNavItem',
        name: 'Integrations',
        to: '/integrations',
        icon: 'tabler:settings-automation',
        utype: [2,3]
      },
      {
        component: 'CNavGroup',
        name: 'Purchases / Subscriptions',
        icon: 'tabler:award',
        utype: [2,3],
        items: [
            {
                component: 'CNavItem',
              name: 'Buy Credits / Subscriptions',
              to: '/standalonepurchases'
            },
            {
                component: 'CNavItem',
              name: 'Past Orders',
              to: '/standalonepurchases/past_orders'
            },
            {
                component: 'CNavItem',
                name: 'Payment Profiles',
                to: '/standalonepurchases/payment_profiles'
            },
            {
                component: 'CNavItem',
                name: 'Subscriptions',
                to: '/standalonepurchases/automatic_purchases'
            },
            {
                component: 'CNavItem',
                name: 'Purchased Packages',
                to: '/standalonepurchases/purchased_packages'
            }
          ]
      },

      {
        component: 'CNavGroup',
        name: 'Marketing',
        icon: 'tabler:components',
        utype: [1,2,3],
        items: [
          {
            component: 'CNavItem',
            name: 'Templates',
            to: '/manage_marketing/list',
          },
          {
            component: 'CNavItem',
            name: 'Campaigns',
            to: '/manage_marketing/campaigns',
          },
        ]
      },
      {
        component: 'CNavGroup',
        name: 'Reports',
        icon: 'tabler:report-analytics',
        utype: [2,3],
        items: [
          {
            component: 'CNavItem',
            name: 'All reports',
            to: '/reports/all'
          },
          {
            component: 'CNavItem',
            name: 'Revenue by employee',
            to: '/reports/revenue'
          },
          {
            component: 'CNavItem',
            name: 'Top selling items',
            to: '/reports/items'
          }
        ]
      },
      {
        component: 'CNavGroup',
        name: 'Bulk Upload',
        icon: 'tabler:book-upload',
        utype: [2,3],
        items: [
          {
            component: 'CNavItem',
            name: 'Customers',
            to: '/customers-upload'

          },
          {
            component: 'CNavItem',
            name: 'Products/Services',
            to: '/products'
          }
        ]
      },
      {
        component: 'CNavItem',
        name: 'Referral Plans',
        to: '/referrals/plans/list',
        icon: 'tabler:chart-dots3',
        utype: [1]
      },
      {
        component: 'CNavItem',
        name: 'My Referrals',
        to: '/referrals/register/list',
        icon: 'fluent:channel-share-12-regular',
        utype: [2,3,4]
      },
      {
        component: 'CNavItem',
        name: 'Billing Txns upload',
        to: '/admin-billing-upload',
        icon: 'tabler:checkup-list',
        utype: [1]
      },
    ]
  }
]

