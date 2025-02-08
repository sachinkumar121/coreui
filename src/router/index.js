import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';

// Containers
const ExternalContainer = () => import('@/containers/ExternalContainer.vue')

// Views
const Dashboard = () => import('@/views/dashboard/Dashboard.vue')
const Dashboardv2 = () => import('@/views/dashboard/Dashboardv2.vue')
const Login = () => import('@/views/onBoarding/Login.vue')
const Login2 = () => import('@/views/onBoarding/Login2.vue')
const Register = () => import('@/views/onBoarding/Register.vue')
const PartnerRegister = () => import('@/views/onBoarding/PartnerRegister.vue')
//const PreRegister = () => import('@/views/onBoarding/PreRegister.vue')

const ForgotPassword = () => import('@/views/onBoarding/ForgotPassword.vue')
const PartnerInfo = () => import('@/views/onBoarding/PartnerInfo.vue')
const Integration = () => import('@/views/integration/Integration.vue')
const UsersList = () => import('@/views/users/List.vue')


const CreateUser = () => import('@/views/users/Add.vue')
const DetailUser = () => import('@/views/users/Detail.vue')
const AddBulkUser = () => import('@/views/users/AddBulkUser.vue')
const Bookings = () => import('@/views/bookings/List.vue')
const CreateBooking = () => import('@/views/bookings/Create.vue')
const AddBooking = () => import('@/views/bookings/Add.vue')
const DetailBooking = () => import('@/views/bookings/Detail.vue')
const WaitList = () => import('@/views/waitList/List.vue')
const CreateWaitList = () => import('@/views/waitList/Create.vue')
const CustomersList = () => import('@/views/customers/List.vue')
const CustomersAdd = () => import('@/views/customers/Add.vue')
const AddBulkCustomer = () => import('@/views/customers/AddBulkCustomer.vue')
//const CustomersMessages = () => import('@/views/customers/Messages.vue')
const CustomersMessages = () => import('@/views/customers/MessengerIntegration.vue')
const SendCustomersMessages = () => import('@/views/customers/CustomerMessage.vue')
const CustomerPaperWorkList = () => import('@/views/customers/ListPaperwork.vue')
const CustomerPaperWorkLogs = () => import('@/views/customers/PaperworkLogs.vue')
const CustomerPurchasedPackages = () => import('@/views/standalonepurchases/PurchasedPackagesList.vue')

const CreateCustomerPurchase = () => import('@/views/customerpurchases/CreateV2.vue')

const Customers = () => import('@/views/users/Customers.vue')
const UserProfile = () => import('@/views/users/Profile.vue')
const ChangePassword = () => import('@/views/users/ChangePassword.vue')
const BusinessProfile = () => import('@/views/users/BusinessProfile.vue')
const BusinessList = () => import('@/views/business/List.vue')
const BusinessDetail = () => import('@/views/business/Detail.vue')
const BusinessUsers = () => import('@/views/business/business_user.vue')
const ServicesList = () => import('@/views/services/List.vue')
const ServicesAddEdit = () => import('@/views/services/AddEditService.vue')
const BulkAddEditService = () => import('@/views/services/BulkAddEditService.vue')
const BulkAddFlexTimes = () => import('@/views/services/BulkAddFlexTimes.vue')

//const ServicesDetail = () => import('@/views/services/AddEditService.vue')
const ServiceCatList = () => import('@/views/service_category/List.vue')
const ProductsCatList = () => import('@/views/product_category/List.vue')
const ProductsList = () => import('@/views/products/List.vue')
const ProductAdd = () => import('@/views/products/Add.vue')
const ProductEdit = () => import('@/views/products/Detail.vue')
const AddEditProduct = () => import('@/views/products/AddEditProduct.vue')
const ProductEditInventory = () => import('@/views/products/EditInventory.vue')
const Products = () => import('@/views/products/Products.vue')
const UploadDetail = () => import('@/views/products/UploadDetail.vue')
const RecordsLookup = () => import('@/views/lookup/RecordsLookup.vue')
const Records = () => import('@/views/lookup/Records.vue')
const RevenueReport = () => import('@/views/reports/Revenue.vue')
const TopSelling = () => import('@/views/reports/top_selling.vue')
const referralPlanList = () => import('@/views/referrals/plans/List.vue')
const referralPlanAdd = () => import('@/views/referrals/plans/Add.vue')
const referralPlanDetail = () => import('@/views/referrals/plans/Detail.vue')
const referralRegisterList = () => import('@/views/referrals/register/List.vue')
const referralRegisterAdd = () => import('@/views/referrals/register/Add.vue')
const referralRegisterDetail = () => import('@/views/referrals/register/Detail.vue')
const Messages = () => import('@/views/messages/index.vue')
const Package = () => import('@/views/messages/package.vue')
const PackageAddEdit = () => import('@/views/packages/AddEdit.vue')
const PackagesList = () => import('@/views/packages/List.vue')


const CouponAddEdit = () => import('@/views/coupons/AddEdit.vue')
const CouponList = () => import('@/views/coupons/List.vue')

const Settings = () => import('@/views/settings/List.vue')
const TaxSettings = () => import('@/views/settings/tax_setup.vue')
const Loyalty = () => import('@/views/settings/loyalty/loyaltyHome.vue')
const BonusSettings = () => import('@/views/settings/BonusSetting.vue')
const LoyaltySetup = () => import('@/views/settings/loyalty/loyaltySetup.vue')
const LoyaltyRedemption = () => import('@/views/settings/loyalty/loyaltyRedemption.vue')
const WaitListSettings = () => import('@/views/settings/WaitListSettings.vue')
const ReceiptPrintSettings = () => import('@/views/settings/receipt_printer_settings.vue')

const InventorySettings = () => import('@/views/settings/InventorySettings.vue')
const OnlineBookingSettings = () => import('@/views/settings/online_booking_settings.vue')
const BookingReminderSettings = () => import('@/views/settings/reminders_to_customer_settings.vue')
const BusinessMessaging = () => import('@/views/settings/business_messaging.vue')
const CreditsPurchaseHistory = () => import('@/views/settings/credits_purchase_history.vue')
const BookingSettings = () => import('@/views/settings/booking_settings.vue')
const AppAdminSetting = () => import('@/views/settings/app_admin_settings.vue')


const MultiLocationListing = () => import('@/views/multi_location_management/List.vue')
const MultiLocationAdd = () => import('@/views/multi_location_management/Add.vue')


const CustomTemplatesForTextSMS = () => import('@/views/settings/custom_text_message_templates.vue')

const ReportMain = () => import('@/views/reports/Main.vue')
const BusHourSettings = () => import('@/views/settings/business_hour.vue')
const JobProcessStatus = () => import('@/views/status/JobProcessStatus.vue')
const SSOPingBack = () => import('@/views/sso/SSOPingBack.vue')
const AppLogs = () => import('@/views/app_logs/List.vue')
const InvoiceList = () => import('@/views/invoice/List.vue')
const InvoicePaymentRecordList = () => import('@/views/invoice/PaymentRecordList.vue')
const InvoiceDetail = () => import('@/views/invoice/Detail.vue')
//const NewInvoiceDetail = ()=>import('@/views/invoice/New-Detail.vue')
const ManageDocumentTemplates = () => import('@/views/paperwork/ManageDocumentTemplates.vue')
const ManagePaperWorkRequirements = () => import('@/views/paperwork/ManagePaperWorkRequirements.vue')
const AddEditPaperWork = () => import('@/views/paperwork/AddEditPaperWork.vue')


const ManageMarketingTemplates = () => import('@/views/manage_marketing_templates/ManageMarketingTemplates.vue')
const ListMarketingCampaigns = () => import('@/views/manage_marketing_campaigns/List.vue')
const AddEditMarketingCampaign = () => import('@/views/manage_marketing_campaigns/AddEditMarketingCampaign.vue')

const StartWizardOld = () => import('@/views/wizards/StartWizard.vue')

const StartWizard = () => import('@/views/start-wizard/Index.vue')
const BillingUpload = () => import('@/views/admin/BillingUpload.vue')
const ScheduledTimeOff = () => import('@/views/users/ScheduledTimeOff.vue')
const StandAlonePurchases = () => import('@/views/standalonepurchases/List.vue')
const PastOrdersList = () => import('@/views/standalonepurchases/PastOrdersList.vue')
const PayPurchaseOrder = () => import('@/views/standalonepurchases/PayPurchaseOrder.vue')
const PaymentProfiles = () => import('@/views/standalonepurchases/PaymentProfiles.vue')
const AutomaticPurchaseSetupList = () => import('@/views/standalonepurchases/AutomaticPurchaseList.vue')
const SAPurchasedPackagesList = () => import('@/views/standalonepurchases/PurchasedPackagesList.vue')
const CustomerPurchasedPackagesV2 = () => import('@/views/standalonepurchases/PurchasedPackagesListV2.vue')
const BusinessMessageCenter = () => import('@/views/message_center/List.vue')
const InfoMessageRates = () => import('@/views/message_center/InfoMessageRates.vue')

const DepartmentsList = () => import('@/views/departments_teams/List.vue')
const ServiceSelectorCompTest = () => import('@/views/experiments/ServiceSelectorCompTest.vue')
const Test = ()=> import('@/views/Test.vue')
const SignoutAnimationTest = ()=> import('@/views/SignoutAnimationTest.vue')
const Icon = () => import('@/views/IconList.vue')
const ManageStocks = () => import('@/views/stocks/ManageStocks.vue')
const AddStock = () => import('@/views/stocks/AddStock.vue')
const AdjustStock = () => import('@/views/stocks/AdjustStock.vue')
const InventoryCount = () => import('@/views/inventory/Count.vue')
const InventoryTakeCount = () => import('@/views/inventory/TakeInventoryCount.vue')
const StockTransactions = () => import('@/views/inventory/StockTransactions.vue')

const Resources = () => import('@/views/resources/Index.vue')
const ResourceTypes = () => import('@/views/resources/Types.vue')

const AddEditResource = () => import('@/views/resources/AddEditResource.vue')
const AddEditResourceType = () => import('@/views/resources/AddEditResourceType.vue')
const CrispChatConfig = () => import('@/views/CrispChatConfig.vue')
const SubjectList = () => import('@/views/subjects/Index.vue')
const AddEditSubject = () => import('@/views/subjects/AddEditSubject.vue')
const CourseList = () => import('@/views/courses/Index.vue')
const AddEditCourse = () => import('@/views/courses/AddEditCourse.vue')
const ClassList = () => import('@/views/classes/Index.vue')
const ExternalClassList = () => import('@/views/classes/ExternalClassList.vue')
const ExternalClassCheckout = () => import('@/views/classes/ExternalClassCheckout.vue')
const ClassSignupPoDetails = () => import('@/views/classes/ClassSignupPoDetails.vue')
const AddEditClass = () => import('@/views/classes/AddEditClass.vue')
const TestBooking = () => import('@/views/TestBooking.vue')
const ConversationManager = () => import('@/views/ConversationManager.vue')
// const TestInvoice = ()=> import('@/views/TestInvoice.vue')
const BookingList = () => import('@/views/bookings/Index.vue')
var TheContainer = () => import('@/layouts/DefaultLayout.vue')

const ClassInstancesList = () => import('@/views/classes/ClassInstancesList.vue')
const ClassSignupsList = () => import('@/views/classes/ClassSignupsList.vue')
const ClassInstanceTrackerList = () => import('@/views/classes/ClassInstanceTrackerList.vue')
const ManageBusiness = () => import('@/views/manage_business/Index.vue')
const Help = () => import('@/views/Help.vue')

const GiftCards = () => import('@/views/gift_cards/GiftCards.vue')
const CreateGiftCard = () => import('@/views/gift_cards/CreateGiftCard.vue')
const BusinessGeo = () => import('@/views/business/MCGeoView.vue')
const PurchaseOrderDetail = () => import('@/views/purchase_order/Detail.vue')

const PlanAddEdit = () => import('@/views/plans/AddEdit.vue')
const PlansList = () => import('@/views/plans/List.vue')
const AddEditSubscription = () => import('@/views/subscriptions/AddEdit.vue')
const SubscriptionsList = () => import('@/views/subscriptions/List.vue')
const QuotesList = () => import('@/views/quotes/List.vue')
const AddEditQuote = () => import('@/views/quotes/AddEdit.vue')
const QuoteCategoryList = () => import('@/views/quote-category/List.vue')
const AddEditQuoteCategory = () => import('@/views/quote-category/AddEdit.vue')

const BookingsBulkUpload = () => import('@/views/bookings/BookingsBulkUpload.vue')
const ClientPicturesList = () => import('@/views/pictures/List.vue')
const AddEditPicture = () => import('@/views/pictures/AddEdit.vue')
const AlbumDetail = () => import('@/views/pictures/Detail.vue')
const POS = () => import('@/views/pos/Index.vue')
const CustomerCheckin = () => import('@/views/customer_checkin/Index.vue')
const DonationCampaignList = () => import('@/views/donation_campaign/List.vue')
const AddEditDonationCampaign = () => import('@/views/donation_campaign/AddEdit.vue')
const DonationForm = () => import('@/views/donation_campaign/DonationForm.vue')
const AdvancedBusinessHours = () => import('@/views/settings/advanced_business_hours/Index.vue')
const OauthSettings = () => import('@/views/aas/OauthSettings.vue')
const AasApps = () => import('@/views/aas/Apps.vue')
const AasProviderCredentials = () => import('@/views/aas/ProviderCredentials.vue')
const AasOauthAccounts = () => import('@/views/aas/OauthAccounts.vue')

function ifAuthenticated(to, from, next) {
  // console.log("IF AUTH: " ,  JSON.parse(JSON.stringify(store.state.user_data)) )
  if (store != null &&
    store.state != null &&
    store.state.user_data != null &&
    store.state.user_data._id != null) {
    next()
    return
  }
  // console.log("HACK... AUTH check failed... letting it go thru")
  //HACK
  next({ path: '/login', query: { redirect_next: to.fullPath } })
  // next()
  return
  //END HACK
  // console.log("IF FAULINGGG: ");
  //console.log(to)
  // next({ path: '/login', query: { redirect_next: to.fullPath } })
}

function redirectIfAlreadyLoggedIn(to, from, next) {
  if (store != null &&
    store.state != null &&
    store.state.user_data != null &&
    store.state.user_data._id != null) {
      next({ path: '/dashboard' })
    }
  next();
}

function ifAdmin(to, from, next) {

  if (store != null && store.state != null && store.state.user_data != null && store.state.user_data.type != null
    &&
    store.state.user_data.type == 1) {
    next()
    return
  }
  next({ path: '/login', query: { redirect_next: to.fullPath } })
}

const authRoutes = [
  {
    path: '/login/:prefer_admin_or_access_key?',
    name: 'Login',
    beforeEnter: redirectIfAlreadyLoggedIn,
    component: Login
  },
  {
    path: '/login2/:prefer_admin?',
    name: 'Login2',
    beforeEnter: redirectIfAlreadyLoggedIn,
    component: Login2
  },
  {
    path: '/register/partner',
    name: 'PartnerRegister',
    beforeEnter: redirectIfAlreadyLoggedIn,
    component: PartnerRegister,
  },
  {
    path: '/register/:reg_type?',
    name: 'Register',
    beforeEnter: redirectIfAlreadyLoggedIn,
    component: Register,
    props: true
  },
  {
    path: '/forgot_password/:access_key?',
    name: 'ForgotPassword',
    beforeEnter: redirectIfAlreadyLoggedIn,
    component: ForgotPassword
  }
];

const protectedRoutes = [
  {
    path: '/change_password',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'ChangePassword',
        component: ChangePassword
      }
    ]
  },
  {
    path: '/settings',
    // name: 'settings-parent',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Settings',
        component: Settings
      },
      {
        path: 'tax_setup',
        name: 'Tax Setting',
        component: TaxSettings
      },
      {
        path: 'set_business_hours',
        name: 'Business Hours Setting',
        component: BusHourSettings
      },
      {
        path: 'set_business_hours/user/:user_id',
        name: 'User Business Hours Setting',
        component: BusHourSettings
      },
      {
        path: 'manage_business_hours_v2',
        name: 'Manage Business Hours',
        component: AdvancedBusinessHours
      },
      {
        path: 'manage_business_hours_v2/user/:user_id',
        name: 'Manage Business Hours for User',
        component: AdvancedBusinessHours
      },
      {
        path: 'online_web_settings',
        name: 'Online Web Settings',
        component: OnlineBookingSettings
      },
      {
        path: 'business_messaging',
        name: 'Business messaging',
        component: BusinessMessaging
      },
      {
        path: 'business_messaging/credits_purchase_history',
        name: 'Credits purchase history',
        component: CreditsPurchaseHistory
      },
      {
        path: 'custom_templates_sms',
        name: 'Custom messaging templates for SMS',
        component: CustomTemplatesForTextSMS
      },
      {
        path: 'booking_settings',
        name: 'Booking Settings',
        component: BookingSettings
      },
      {
        path: 'booking_reminder_settings',
        name: 'Booking Reminder Settings',
        component: BookingReminderSettings
      },
      {
        path: 'bonus_settings',
        name: 'Bonus Settings',
        component: BonusSettings
      },
      {
        path: 'loyalty',
        name: 'Loyalty',
        component: Loyalty,
      },
      {
        path: 'loyalty/loyalty_setup',
        name: 'Loyalty Setup',
        component: LoyaltySetup,
      },
      {
        path: 'loyalty/loyalty_redemption',
        name: 'Loyalty Redemption',
        component: LoyaltyRedemption,
      },
      {
        path: 'wait_list_settings',
        name: 'WaitList Settings',
        component: WaitListSettings
      },
      {
        path: 'inventory_settings',
        name: 'Inventory Settings',
        component: InventorySettings
      },
      {
        path: 'esp_config',
        name: 'Esp Config',
        component: CrispChatConfig
      },
      {
        path: 'receipt_print_settings',
        name: 'Receipt Printing Settings',
        component: ReceiptPrintSettings
      }
    ]
  },
  {
    path: '/app_admin_settings',
    //name: 'Integrations',
    component: TheContainer,

    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'App Admin Settings',
        component: AppAdminSetting
      }
    ]
  },
  {
    path: '/donation_campaigns',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Donation Campaigns List',
        component: DonationCampaignList
      },
      {
        path: 'add',
        name: 'Add Campaign',
        component: AddEditDonationCampaign
      },
      {
        path: 'detail/:campaign_id',
        name: 'Edit Campaign',
        component: AddEditDonationCampaign
      }
    ]
  },
  {
    path: '/quotes',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Quotes List',
        component: QuotesList
      },
      {
        path: 'add',
        name: 'Add Quote',
        component: AddEditQuote
      },
      {
        path: 'detail/:quote_id',
        name: 'Edit Quote',
        component: AddEditQuote
      }
    ]
  },
  {
    path: '/quote-categories',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Quote Category List',
        component: QuoteCategoryList
      },
      {
        path: 'add',
        name: 'Add Quote Category',
        component: AddEditQuoteCategory
      },
      {
        path: 'detail/:quote_category_id',
        name: 'Edit Quote Category',
        component: AddEditQuoteCategory
      }
    ]
  },
  {
    path: '/integrations',
    //name: 'Integrations',
    component: TheContainer,

    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Integrations',
        component: Integration
      }
    ]
  },
  {
    path: '/subjects',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Subjects',
        component: SubjectList
      },
      {
        path: 'add',
        name: 'Add Subject',
        component: AddEditSubject
      },
      {
        path: ':id/edit',
        name: 'Edit Subject',
        component: AddEditSubject
      },
    ]
  },
  {
    path: '/courses',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Courses',
        component: CourseList
      },
      {
        path: 'add',
        name: 'Add Course',
        component: AddEditCourse
      },
      {
        path: ':id/edit',
        name: 'Edit Course',
        component: AddEditCourse
      },
    ]
  },
  {
    path: '/classes',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Classes',
        component: ClassList
      },
      {
        path: 'add',
        name: 'Add Class',
        component: AddEditClass
      },
      {
        path: ':course_id/:id/edit',
        name: 'Edit Class',
        component: AddEditClass
      },
      {
        path: ':course_id/:id/instances',
        name: 'Instances List',
        component: ClassInstancesList
      },
      {
        path: ':course_id/:id/signups',
        name: 'Signup List',
        component: ClassSignupsList
      },
      {
        path: ':id/:class_instance_id/instance-tracker',
        name: 'Instance Tracker List',
        component: ClassInstanceTrackerList
      },
    ]
  },
  {
    path: '/users',
    component: TheContainer,
    // name: 'Users',
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Employee List',
        component: UsersList
      },
      {
        path: 'add',
        name: 'Create New User',
        component: CreateUser
      },
      {
        path: 'detail/:user_id',
        name: 'Edit User Detail',
        component: DetailUser
      },

      {
        path: 'scheduled_time_off/:user_id',
        name: 'Scheduled Time Off',
        component: ScheduledTimeOff
      },
      {
        path: 'bulk-add',
        name: 'Add Multiple Users',
        component: AddBulkUser
      },
    ]
  },
  {
    path: '/departments',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Departments List',
        component: DepartmentsList
      },]

  },
  {
    path: '/customers',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Client List',
        component: CustomersList
      },
      {
        path: 'add',
        name: 'Customers Add',
        component: CustomersAdd
      },
      {
        path: 'detail/:customer_id',
        name: 'Customers Edit',
        component: CustomersAdd
      },
      {
        path: 'messages/:customer_id',
        name: 'Customers Messages',
        component: CustomersMessages
      },
      {
        path: 'list_paperwork/:customer_id',
        name: 'Customer Paper Work List',
        component: CustomerPaperWorkList
      },
      {
        path: 'list_paperwork/logs/:customer_id/:paper_work_id/:signed_request_law_id?',
        name: 'Paper Work Logs',
        component: CustomerPaperWorkLogs
      },
      {
        path: 'purchased_packages/:customer_id?',
        name: 'Customer Purchased Packages',
        component: CustomerPurchasedPackages,
        props: { for_business_customer: true }
      },
      {
        path: 'bulk-add',
        name: 'Add Multiple Customers',
        component: AddBulkCustomer
      },
      {
        path: 'purchased_packages_v2/:customer_id?',
        name: 'Customer Purchased PackagesV2',
        component: CustomerPurchasedPackagesV2,
        props: { for_business_customer: true }
      },
    ]
  },
  {
    path: '/inventory',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'count',
        name: 'Inventory Count',
        component: InventoryCount
      },
      {
        path: 'count/:item_id/take-count',
        name: 'Inventory Take Count',
        component: InventoryTakeCount
      },
      {
        path: 'transactions',
        name: 'Stock Transactions',
        component: StockTransactions
      },
    ]
  },
  {
    path: '/stocks',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'manage',
        name: 'Manage Stocks',
        component: ManageStocks
      },
      {
        path: 'add',
        name: 'Add Stock',
        component: AddStock
      },
      {
        path: ':id/adjust',
        name: 'Adjust Stock',
        component: AdjustStock
      },
    ]
  },
  {
    path: '/resources',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: ':standard_resource_name',
        name: 'Resources',
        component: Resources
      },
      {
        path: ':standard_resource_name/add',
        name: 'Add Resource',
        component: AddEditResource
      },
      {
        path: ':standard_resource_name/:id/edit',
        name: 'Edit Resource',
        component: AddEditResource
      },
      {
        path: 'types',
        name: 'Resource Groups',
        component: ResourceTypes
      },
      {
        path: 'types/:id/edit',
        name: 'Edit Resource Type',
        component: AddEditResourceType
      },
      {
        path: 'types/add',
        name: 'Add Edit Resource Type',
        component: AddEditResourceType,
      }
    ]
  },
  {
    path: '/business_message_center',
    // name: 'Business',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Business Message Center',
        component: BusinessMessageCenter
      },
      {
        path: 'info_message_rates',
        name: 'Message Rate Information',
        component: InfoMessageRates
        
      }
    ]
  },
  {
    path: '/business',
    // name: '',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Business Profile',
        component: BusinessProfile
      },
      {
        path: 'list',
        name: 'Business List',
        component: BusinessList
      },
      {
        path: 'geo',
        name: 'Business Geo',
        component: BusinessGeo
      },
      {
        path: 'detail/:business_id',
        name: 'EditBusiness',
        component: BusinessDetail
      },
      {
        path: 'users/:business_id',
        name: 'BusinessUsers',
        component: BusinessUsers
      }
    ]
  },
  {
    path: '/bookings',
    component: TheContainer,
    // name: 'Bookings',
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Bookings',
        component: BookingList
      },
      {
        path: 'create',
        name: 'Create Booking',
        component: CreateBooking
      },
      {
        path: 'add',
        name: 'Add Booking',
        component: AddBooking
      },
      {
        path: 'detail/:booking_id',
        name: 'Detail Booking',
        component: DetailBooking
      },
      {
        path: 'test',
        name: 'Test Booking',
        component: TestBooking
      },
      {
        path: 'bookingsbulkupload',
        name: 'Bookings Bulk Upload',
        component: BookingsBulkUpload
        
      }
    ]
  },
  {
    path: '/manage_waitlist',
    component: TheContainer,
    // name: 'Bookings',
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Manage Wait List',
        component: WaitList
      },
      {
        path: 'add/:edit_id?',
        name: 'Add WaitList',
        component: CreateWaitList
      },
      // {
      //   path: 'detail/:booking_id',
      //   name: 'DetailBooking',
      //   component: DetailBooking
      // }
    ]
  },
  {
    path: '/customers-upload',
    redirect: '/customers-upload',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Customers',
        component: Customers
      }
    ]
  },
  {
    path: '/admin-billing-upload',
    redirect: '/admin-billing-upload',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Billing Upload',
        component: BillingUpload
      }
    ]
  },
  {
    path: '/profile',
    redirect: '/profile',
    // name: 'Profile',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Profile',
        component: UserProfile
      }
    ]
  },
  // {
  //   path: '/business',
  //   redirect: '/business',
  //   // name: 'BusinessProfile',
  //   component: TheContainer,
  //   beforeEnter: ifAuthenticated,
  //   children: [
  //     {
  //       path: '/',
  //       name: 'BusinessProfile',
  //       component: BusinessProfile
  //     }
  //   ]
  // },
  {
    path: '/services',
    // name: 'Services',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Services List',
        component: ServicesList
      },
      {
        path: 'add',
        name: 'Add Service',
        component: ServicesAddEdit
      },
      {
        path: 'detail/:service_id',
        name: 'Edit Service',
        component: ServicesAddEdit
      },

      {
        path: 'bulkadd',
        name: 'Bulk Add Edit Service',
        component: BulkAddEditService
      },
      {
        path: 'bulkaddflextime',
        name: 'Bulk Add Flex Times',
        component: BulkAddFlexTimes
      },
    ]
  },
  {
    path: '/packages',
    // name: 'packages',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Packages List',
        component: PackagesList
      },
      {
        path: 'add',
        name: 'Add Package',
        component: PackageAddEdit
      },
      {
        path: 'detail/:package_id',
        name: 'Edit Package',
        component: PackageAddEdit
      }
    ]
  },
  {
    path: '/coupons',
    // name: 'packages',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Coupons List',
        component: CouponList
      },
      {
        path: 'add',
        name: 'Add Coupon',
        component: CouponAddEdit
      },
      {
        path: 'detail/:coupon_id',
        name: 'Edit Coupon',
        component: CouponAddEdit
      }
    ]
  },
  {
    path: '/products',
    redirect: '/products',
    // name: 'Products',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Products',
        component: Products
      },
      {
        path: 'detail',
        name: 'Upload Detail',
        component: UploadDetail
      },
      {
        path: 'list',
        name: 'Products List',
        component: ProductsList
      },
      {
        path: 'add',
        name: 'Add Product',
        component: AddEditProduct
      },
      {
        path: 'detail/:product_id',
        name: 'Edit Product',
        component: AddEditProduct
      },
      {
        path: ':product_id/inventory-data',
        name: 'Edit Product Inventory Data',
        component: ProductEditInventory
      },
      {
        path: 'inventory_transactions/:product_id',
        name: 'Inventory Transactions',
        component: StockTransactions
      },
    ]
  },
  {
    path: '/invoices',
    redirect: '/invoices',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Invoice List',
        component: InvoiceList
      },
      {
        path: 'customer/:customer_id',
        name: 'Customer Invoice List',
        component: InvoiceList
      },
      {
        path: 'payments',
        name: 'Invoice Payment Record List',
        component: InvoicePaymentRecordList
      },

      {
        path: 'detail/:invoice_no',
        name: 'Detail Invoice',
        component: InvoiceDetail
      }
    ]
  },
  {
    path: '/product_category',
    redirect: '/product_category',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Products Category',
        component: ProductsCatList
      }
    ]
  },
  {
    path: '/service_category',
    redirect: '/service_category',
    // name: 'ProductsCategory',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Service Category',
        component: ServiceCatList
      }
    ]
  },
  {
    path: '/dashboard',
    redirect: '/dashboard',
    // name: 'Dashboard',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      }
    ]
  },
  {
    path: '/dashboardv2',
    redirect: '/dashboardv2',
    // name: 'Dashboard',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Dashboardv2',
        component: Dashboardv2
      }
    ]
  },
  {
    path: '/reports',
    // name: 'Report',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'all',
        name: 'All Reports',
        component: ReportMain
      },
      {
        path: 'revenue',
        name: 'Revenue Report',
        component: RevenueReport
      },
      {
        path: 'items',
        name: 'Top Selling',
        component: TopSelling
      }
    ]
  },
  {
    path: '/referrals/register',
    name: 'Referral Register',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Referral Register List',
        component: referralRegisterList
      },
      {
        path: 'add',
        name: 'Referral Register Add',
        component: referralRegisterAdd
      },
      {
        path: 'detail/:register_id',
        name: 'Referral Register Detail',
        component: referralRegisterDetail
      }
    ]
  },
  {
    path: '/status',
    name: 'Status',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'job_process_status/:rec_id',
        name: 'Job Process Status',
        component: JobProcessStatus
      },

    ]
  },
  {
    path: '/app_logs',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'App Logs',
        component: AppLogs
      },
      {
        path: 'business/:business_id',
        name: 'Business App Logs',
        component: AppLogs
      },
    ]
  },

  {
    path: '/paperwork',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'manage_document_templates',
        name: 'Manage Document Templates',
        component: ManageDocumentTemplates
      },
      {
        path: 'manage_paperwork_requirements',
        name: 'Manage Requirements',
        component: ManagePaperWorkRequirements
      },
      {
        path: 'manage_paperwork_requirements/add_edit/:paperwork_id?',
        name: 'Add Edit Paperwork',
        component: AddEditPaperWork
      }
    ]
  },


  {
    path: '/manage_marketing',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Manage Marketing Templates',
        component: ManageMarketingTemplates
      },
      {
        path: 'campaigns',
        name: 'List Marketing Campaigns',
        component: ListMarketingCampaigns
      },
      {
        path: 'add_edit_campaign/:campaign_id?',
        name: 'Add Edit Campaign',
        component: AddEditMarketingCampaign
      }
    ]
  },
  {
    path: '/start_wizard',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: ':wizard_name?',
        name: 'Start Wizard',
        component: StartWizardOld
      }
    ]
  },
  {
    path: '/standalonepurchases',
    component: TheContainer,
    beforeEnter: ifAuthenticated,


    children: [
      {
        path: '',
        name: 'Purchases',
        component: StandAlonePurchases
      },
      {
        path: 'past_orders',
        name: 'Past Orders',
        component: PastOrdersList
      },
      {
        path: 'pay_po/:po_access_url',
        name: 'Pay Purchase Order',
        component: PayPurchaseOrder
      },
      {
        path: 'payment_profiles',
        name: 'Payment Profiles',
        component: PaymentProfiles
      },
      {
        path: 'automatic_purchases',
        name: 'Automatic Purchase Setup List',
        component: AutomaticPurchaseSetupList
      },
      {
        path: 'purchased_packages',
        name: 'Purchased Packages',
        component: SAPurchasedPackagesList,
        props: { for_business_customer: false }
      },
      
    ]
  },
  {
    path: '/customer_purchase',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'create/:customer_id?',
        name: 'Customer Purchases',
        component: CreateCustomerPurchase
      }
    ]

  },
  {
    path: '/sale_purchase_order',
    redirect: '/new_po',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '/new_po',
        name: 'New Sale PO',
        component: CreateCustomerPurchase
      }
    ]
  },
  {
    path: '/multi_location',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Multi Location List',
        component: MultiLocationListing
      },
      {
        path: 'add',
        name: 'Multi Location Add',
        component: MultiLocationAdd
      }

    ]
  },
  
  {
    path: '/manage-business',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Manage Business',
        component: ManageBusiness
      }
    ]
  },
  {
    path: '/help',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Help',
        component: Help
      }
    ]
  },

  
  {
    path: '/start-wizard',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Start Wizard New',
        component: StartWizard
      }
    ]

  },
  {
    path: '/ui',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'start-wizard',
        name: 'Start Wizard UI',
        component: StartWizard
      }
    ]
  },

  // {
  //   path: '/test-invoice',
  //   name: 'TestInvoice',
  //       component: TestInvoice
  // }
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/purchase_order',
    component: TheContainer,
    // name: 'Bookings',
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'detail/:purchase_order_id',
        name: 'Purchase Order Detail',
        component: PurchaseOrderDetail
      }
    ]
  },
  {
    path: '/plans',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'list',
        name: 'Plans List',
        component: PlansList
      },
      {
        path: 'add',
        name: 'Add Plan',
        component: PlanAddEdit
      },
      {
        path: 'detail/:plan_id',
        name: 'Edit Plan',
        component: PlanAddEdit
      }
    ]
  },
  {
    path: '/subscriptions',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'Subscription List',
        component: SubscriptionsList
      },
      {
        path: 'create',
        name: 'Create Subscription',
        component: AddEditSubscription
      },
      {
        path: ':subscription_id/detail',
        name: 'Edit Subscription',
        component: AddEditSubscription
      }
    ]
  },
  {
    path: '/albums',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: ':id/edit',
        name: 'Edit Album',
        component: AddEditPicture
      },
      {
        path: ':id',
        name: 'View Album',
        component: AlbumDetail
      },
    ]
  },
  {
    path: '/customer/pictures',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: ':user_id',
        name: 'Client Picture List',
        component: ClientPicturesList
      },
      {
        path: ':user_id/add',
        name: 'Add Picture',
        component: AddEditPicture
      }
    ]
  }
];

const guestRoutes = [
  { path: '/', redirect: '/login' },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages
  },
  {
    path: '/package-messages',
    name: 'Package',
    component: Package
  },
  {
    path: '/sso_ping_back',
    name: 'SSO Ping Back',
    component: SSOPingBack
  },
  {
    path: '/icon-list',
    name: 'Icon',
    component: Icon
  },
  {
    path: '/external',
    component: ExternalContainer,
    children: [
      {
        path: 'classes/:accesskey',
        name: 'External Class List',
        component: ExternalClassList
      },
      {
        path: 'classes/:accesskey/checkout',
        name: 'External Class Checkout',
        component: ExternalClassCheckout
      },
      {
        path: 'classes/:accesskey/po/:po_order_number',
        name: 'Class Signup Po Details',
        component: ClassSignupPoDetails
      },
      {
        path: 'gift-cards',
        name: 'Gift Cards',
        component: GiftCards
      },
      {
        path: 'gift-card/create',
        name: 'Create Gift Card',
        component: CreateGiftCard
      },
      {
        path: 'customer-checkin/:accesskey',
        name: 'Customer Checkin',
        component: CustomerCheckin
      },
      {
        path: 'donation/:accesskey/:campaign_id?',
        name: 'DonationForm',
        component: DonationForm
      },
    ]
  },
  {
    path: '/send_from_customer',
    name: 'Send Customers Messages',
    component: SendCustomersMessages
  },
  {
    path: '/customers/plain_messages/:customer_id',
    name: 'Customers Messages Plain',
    component: CustomersMessages
  },
  {
    path: '/partnerinfo',
    // name: 'PartnerInfo',
    component: ExternalContainer,
    children: [
      {
        path: '',
        name: 'Partner Info',
        component: PartnerInfo
      }

    ]
  },
  {
    path: '/external_access/esp/crispchat/config',
    component: ExternalContainer,
    children: [
      {
        path: '',
        name: 'Crisp Chat Config',
        component: CrispChatConfig
      }

    ]
  },
  {
    path: '/lookup',
    // redirect: '/lookup',
    // name: 'RecordsLookup',
    component: ExternalContainer,
    children: [
      {
        path: ':accesskey',
        name: 'Records Lookup',
        component: RecordsLookup
      },

    ]
  },
  {
    path: '/external_access',
    // name: 'Records',
    component: ExternalContainer,
    children: [
      {
        path: 'verify_user/:token',
        name: 'Records',
        component: Records
      },

    ]
  },
  {
    path: '/signout-animation',
    name: 'Signout Animation Test',
    component: SignoutAnimationTest
  },
  {
    path: '/test-booking',
    name: 'TestBooking2',
    component: TestBooking
  },
  {
    path: '/conversation-manager',
    name: 'Conversation Manager',
    component: ConversationManager
  },
  {
    path: '/pos',
    component: TheContainer,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '',
        name: 'POS',
        component: POS
      },
    ]
  },
];

const adminRoutes = [
  {
    path: '/referrals/plans',
    name: 'Referral Plans',
    component: TheContainer,
    beforeEnter: ifAdmin,
    children: [
      {
        path: 'list',
        name: 'Referral Plan List',
        component: referralPlanList
      },
      {
        path: 'add',
        name: 'Referral Plan Add',
        component: referralPlanAdd
      },
      {
        path: 'detail/:plan_id',
        name: 'Referral Plan Detail',
        component: referralPlanDetail
      }
    ]
  },
  {
    path: '/oauth_settings',
    component: TheContainer,
    beforeEnter: ifAdmin,
    children: [
      {
        path: '',
        name: 'Oauth Settings',
        component: OauthSettings
      }
    ]
  },
  {
    path: '/aas',
    component: TheContainer,
    beforeEnter: ifAdmin,
    children: [
      {
        path: 'apps',
        name: 'Aas Apps List',
        component: AasApps
      },
      {
        path: 'provider_credentials',
        name: 'Aas Provider Credentials List',
        component: AasProviderCredentials
      },
      {
        path: 'oauth_accounts',
        name: 'Aas Oauth Accounts List',
        component: AasOauthAccounts
      }
    ]
  }
];

function configRoutes() {
  return guestRoutes.concat(authRoutes, protectedRoutes, adminRoutes);
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: configRoutes(),
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
