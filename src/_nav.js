export default [
  {
    component: 'CNavItem',
    name: 'Calendar',
    to: '/dashboard',
    icon:  'tabler:calendar-due',
    utype: [2,3,4]
  }, 
  {
    component: 'CNavItem',
    name: 'Appointments',
    to: '/bookings',
    icon:'tabler:layout-dashboard',
    utype: [2,3,4,5]
  },
  {
    component: 'CNavItem',
    name: 'Clients',
    to: '/customers',
    icon: 'material-symbols:person-4-outline-rounded',
    utype: [2,3,4],
  },
  {
    component: 'CNavItem',
    name: 'Quick Sale',
    to: '/new_po',
    icon: 'tabler:file-chart',
    utype: [2,3,4]
  },
  {
    component: 'CNavItem',
    name: 'Manage Business',
    to: '/manage-business',
    icon: 'tabler:address-book',
    utype: [2,3,4]
  },
  {
    component: 'CNavItem',
    name: 'Help',
    to: '/help',
    icon: 'material-symbols:help-center-outline-rounded',
    utype: [2,3,4]
  },
  //Admin related:
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
      icon: 'tabler:clipboard-list',
      utype: [1]
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
    name: 'Quotes Management',
    to: '/quotes/list',
    icon: 'tabler:blockquote',
    utype: [1]
  },
  {
      component: 'CNavItem',
      name: 'Billing Txns upload',
      to: '/admin-billing-upload',
      icon: 'tabler:checkup-list',
      utype: [1]
  },
  {
      component: 'CNavItem',
      name: 'Referral Plans',
      to: '/referrals/plans/list',
      icon: 'tabler:chart-dots-3',
      utype: [1]
  },

]
