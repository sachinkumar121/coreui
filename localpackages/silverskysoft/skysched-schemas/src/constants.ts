export const SIntegrationProviders = Object.freeze({
    GOOGLE: "google",
    PAYPAL: "paypal",
    AUTHNET: "authnet",
    APPLE: "apple",
    MSFT: "microsoft",
    ZAPIER: "zapier",
    INTUIT: "intuit",
    STRIPE: "stripe",
    CLOVER: "clover",
    CONSTANTCONTACT: "constantcontact",
    MAILCHIMP: "mailchimp",
    LAST: "dontuselastprivider"
});

export const SIntegrationFeatures = Object.freeze({
    CALENDAR: "calendar",
    ONDEV_PAYMENTS: "ondevicepayments",
    ECOMMERCE_PAYMENTS: "ecommercepayments",
    TRIGGERS: "triggers",
    ACCOUNTING: "accounting",
    MARKETING: "marketing",
    CONTACTS: "contacts",
    APP_PLATFORM: "appplatform",
    ONLINEMEETING: "onlinemeeting",
    LAST: "dontuselastfeature"
});
export const SAllowedLevels = Object.freeze({
    BUSINESS_ONLY: 1,
    USER_ONLY: 2,
    EITHER: 3
});


export const SIntFtrData = Object.freeze({
    "google_calendar": {
        scopes: ['openid', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'], //When approved by googlle allow readonly for calenders so it can be listed in list of calendars to use
        allowed_level: SAllowedLevels.USER_ONLY
    },
    "google_contacts": {
        scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
        allowed_level: SAllowedLevels.USER_ONLY
    },
    "paypal_ondevicepayments": {
        scopes: ['openid', 'profile', 'email', 'address', 'https://uri.paypal.com/services/paypalattributes', 'https://uri.paypal.com/services/paypalattributes/business', 'https://uri.paypal.com/services/paypalhere', 'https://uri.paypal.com/services/invoicing'],
        allowed_level: SAllowedLevels.EITHER
    },
    "intuit_accounting": {
        scopes: ['com.intuit.quickbooks.accounting'],
        allowed_level: SAllowedLevels.EITHER
    },
    "paypal_ecommercepayments": {
        scopes: ['openid',
            // 'profile', 'email', 'address', 'https://uri.paypal.com/services/paypalattributes',
            'https://uri.paypal.com/services/paypalattributes/business', 'https://uri.paypal.com/services/paypalhere', 'https://uri.paypal.com/services/invoicing'
        ],
        allowed_level: SAllowedLevels.EITHER
    },
    "stripe_ecommercepayments": {
        scopes: ['read_write'],
        allowed_level: SAllowedLevels.EITHER
    },
    "authnet_ecommercepayments": {
        scopes: ['read', 'write'],
        allowed_level: SAllowedLevels.EITHER
    },
    "clover_ecommercepayments": {
        scopes: [],
        allowed_level: SAllowedLevels.EITHER
    },
    "clover_appplatform": {
        scopes: [],
        allowed_level: SAllowedLevels.BUSINESS_ONLY
    },
    "constantcontact_marketing": {
        scopes: ['account_read', 'contact_data', 'campaign_data'],
        allowed_level: SAllowedLevels.BUSINESS_ONLY
    },
    "mailchimp_marketing": {
        scopes: [],
        allowed_level: SAllowedLevels.BUSINESS_ONLY
    },
    "dontuselastfeaturedata": null
});

export const AUTOEXTEND_OP = Object.freeze({
    SCHEDULE: 1,
    CANCEL: 2
});
export const PAYMETHOD = Object.freeze({
    PM_CARD: 0,
    PM_CASH: 1,
    PM_OTHER: 99,
});

export const BOOKING_TYPE = Object.freeze({
    // 0-pending,
    // 1-Cancelled due to stylist not available when booking created offline,
    // 2-cancelled manually, 
    // 3-on_going, 
    // 4-completed, 
    // 5-rescheduled, 
    // 6-scheduled,
    // 7-Waitlisted

    BT_PENDING: 0,
    BT_CANCELLED_OFFLINE: 1,
    BT_MANUAL_CANCEL: 2,
    BT_ON_GOING: 3,
    BT_COMPLETED: 4,
    BT_RESCHEDULED: 5,
    BT_SCHEDULED: 6,
    BT_WAITLISTED: 7,
    BT_CANCEL_AS_NO_SHOW: 8,
});
export const BOOKING_SOURCE = Object.freeze({

    // 1-app
    // 2-alexa, 
    // 3-website, 
    // 4-chat, 
    // 5-adminweb, 
    // 6-googlehome,
    // 7-facebook
    // 8-Unlogged incorrectly set as 1
    BS_UNKNOWN: 0,
    BS_APP: 1,
    BS_ALEXA: 2,
    BS_WEBSITE: 3,
    BS_WEBCHAT: 4,
    BS_ADMINWEB: 5,
    BS_GOOGLEHOME: 6,
    BS_FACEBOOK: 7,
    BS_WAITLIST: 8,
    BS_UNLOGGEDIN_1: 99

});

export const BUS_OPS = Object.freeze({

    BO_UNDEFINED_OPS: 0,
    BO_RUN_WL_CONVERSION_BUSINESS_LEVEL: 1,
    BO_SCHEDULED_BUSINESS_LEVEL_WL_PROCESS: 2,

});
export const BUS_OPS_STATE = Object.freeze({

    BOS_CREATED: 0,
    BOS_COMPLETE: 1
});

export const ECOM_PROCESSOR = Object.freeze({
    EP_STRIPE: "EP_STRIPE",
    EP_PAYPAL: "EP_PAYPAL",
    EP_AUTHNET: "EP_AUTHNET",
    EP_CLOVER: "EP_CLOVER",
    EP_MANUAL: "EP_MANUAL" //manual or out of system
});
export const ECOM_PROCESSOR_PREFIX = "EP_"

export const TXN_OP = Object.freeze({
    PT_TT_AUTH: "PT_TT_AUTH",
    PT_TT_SALE: "PT_TT_SALE",
    PT_TT_AUTH_CAPTURE: "PT_TT_AUTH_CAPTURE",
    PT_TT_ADJUST: "PT_TT_ADJUST",
    PT_TT_VOID: "PT_TT_VOID",
    PT_TT_REFUND: "PT_TT_REFUND",
    PT_TT_UNREF_REFUND: "PT_TT_UNREF_REFUND",
    PT_TT_TOKEN_REQ: "PT_TT_TOKEN_REQ",
    PT_TT_VERIFY: "PT_TT_VERIFY",
    PT_TT_OTHER: "PT_TT_OTHER"

});
//must be 1 char
export const BUSREGIONS = Object.freeze({
    BRC_NORTH_AMERICA: "N",
    BRC_EUROPE: "E",
    BRC_SE_ASIA: "S",
    BRC_INDIA: "I",
});

export const CACHE_TAGS = Object.freeze({
    CT_BUSINESS_INFO: "_BIZINF_CT",
    CT_BUSINESS_SETTING: "_BIZSET_CT",
    CT_INVOICE: "_INV_CT",
    CT_INVOICE_AMOUNTS: "_INV_AMT_CT",
    CT_BOOKING: "_BOOK_CT",
    CT_LOYALTY: "_LOYAL_CT",
    CT_LOYALTY_SETUP: "_LOYAL_SET_CT",
    CT_USER_INFO: "_USER_CT",
    CT_SERVICE_INFO: "_SVCINF_CT",
    CT_MESSAGE_TEMPLATE: "_MSTPL_CT",
    CT_PURCHASE_ORDER: "_PO_CT",

});

export const INVTRY = Object.freeze({
    NUM_QTY_FRACTIONS: 4,
    NUM_PRICE_FRACTIONS: 2
});
export const INVTRY_TXN = Object.freeze({
    TT_RECEIVE_STOCK: "RS",
    TT_PRODUCT_SALE: "PS",
    TT_PRODUCT_RETURN: "PR",
    TT_ADJUST_STOCK: "AS",
    TT_CHANGE_UNIT_PRICE: "CP",
    TT_SERVICE_USE: "SU",
    TT_INVENTORY_COUNT_UPDATE: "IU"
});

export const WEB_BOOKING_DATA = Object.freeze({
    WBD_CSS_FOLDER: "../public/css/business_css/",
    WBD_DEFAULT_CSS_FILE: "../public/css/booking_web_page.css",
    WBD_CSS_FILENAME_PREFIX: "web_booking_",
    WBD_CSS_TEMPLATE_FILENAME: "web_widget_custom_css_template.html",
    WBD_TEMPLATES_FOLDER: "../views",

});

export const ItemType = Object.freeze({
    TYPE_PRODUCT: 'P',
    TYPE_SERVICE: 'S',
    TYPE_ADJUSTMENT: 'A', //Tax / discount etc
    TYPE_SERVICE_CATEGORY: 'SVCAT',
    TYPE_PRODUCT_CATEGORY: 'PRCAT'
    //TYPE_GCPKG     : 'G'   //Not used -- A cash value - Gift Card or Package (series) or Gift Certificate
});

export const FixedItemCode = Object.freeze({
    IC_TAX: 'IC_TAX',
    IC_TIP: 'IC_TIP',
    IC_PCF: 'IC_PCF' //Processor charged fee (surcharge, convenience fee etc)
});

export const TaxEnum = Object.freeze({
    TAX_PRODUCT: 2,
    TAX_SERVICE: 1,
    TAX_OVERRIDE: 93,
    TAX_NOT_APPLICABLE: 99
});
export const PaymentMethod = Object.freeze({
    PM_CARD: 0,
    PM_CASH: 1,
    PM_OTHER: 99,
});
// 1-admin, 2-salon_owner, 3-receptionist, 4-stylist, 5-customer, 6-business, 9-Resource
//type: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], default: 0 }, 

export const USR_TYPE = Object.freeze({

    UT_UNKNOWN: 0,
    UT_ADMIN: 1,
    UT_OWNER: 2,
    UT_RECEPTION: 3,
    UT_EMPLOYEE: 4, //STYLIST
    UT_CUSTOMER: 5,
    UT_BUSINESS: 6,
    UT_RESOURCE: 9,
    UT_SUPER_ORG: 99
});

export const MSG_CHANNEL = Object.freeze({
    MC_UNKNOWN: 0,
    MC_EMAIL: 1,
    MC_SMSTEXT: 2,
    MC_VOICE: 3,
    MC_FB_MESSENGER: 4,
    MC_WHATSAPP: 5,
    MC_INSTAGRAM: 6,
    MC_WEBSITE: 7,

    MC_AUTO_SELECT: 399,
    MC_MAX_CHANNELS: 8 //<-- Must be last
});
export const MSG_CHANNEL_TRAFFIC_TYPE = Object.freeze({
    MCT_TRANSACTIONAL: 0,
    MCT_BULK: 1,
    MCT_MIXED: 2,
    MCT_CONVERSATION: 3,
    MCT_MATCH_ANY: 99
});


export const MSG_DIRECTION = Object.freeze({
    OUT: 0,
    IN: 1
});
export const MSG_TRK_REC_TYPE = Object.freeze({
    MTRT_REGULAR_MSG: 1,
    MTRT_ACCOUNTING: 2, //3 used to be unidentified. but change now
    MTRT_NON_TEMPLATED: 4, // Non templated means either owner sent unscripted / incoming
    MTRT_UNIDENTIFIED: 80 //No message identity record found
});

export const MSG_DELIVERY_PROVIDER = Object.freeze({
    MDP_TELNYX: 'mdp_telnyx', // * preferred
    MDP_TWILIO: 'mdp_twilio',
    MDP_AWS: 'mdp_aws',
    MDP_PLIVO: 'mdp_plivo',
    MDP_SENDGRID: 'mdp_sendgrid',
    MDP_ELASTICEML: 'mdp_esticeml', //elastic email // *preferred
    MDP_SMTP: 'mdp_smtp', //SMTP
    MDP_SIMULATION: 'mdp_simulation',
    MDP_WEBSITE: 'mdp_website'
});
export const MSG_PROXY_PROVIDER = Object.freeze({
    MPP_APP_BUSINESS_CUSTOMER_SUPPORT: 'mpp_bcs',
    MPP_CRISP_CHAT: 'mpp_crisp_chat',
});

export const MSG_DELIVERY_STATUS = Object.freeze({
    MDS_QUEUED: 0,
    MDS_SENT: 1,
    MDS_DELIVERED: 2,
    MDS_OPENED: 3,
    MDS_UNKNOWN: 4,
    MDS_ERROR: 90
});
export const MDS_ERROR_DETAIL = Object.freeze({
    MDSED_UNKNOWN: 0,

    MDSED_INVALID_PHONE: 1,
    MDSED_INACTIVE_PHONE: 2,
    MDSED_INCORRECT_PHONE_FORMAT: 3,
    MDSED_NON_ROUTABLE_NUMBER: 4,
    MDSED_MARKED_PERMANENT_SPAM: 5,
    MDSED_MARKED_INTERNAL_SPAM: 6,
    MDSED_BLOCKED_DUE_TO_STOP_MESSAGE: 7,
    MDSED_MESSAGING_DISABLED_FOR_NUMBER: 8,

    MDSED_MAX_NUMBER_SPECIFIC_ERROR: 20,

    //Errors above need to block the number from further messages

    //Administrative errors -- send to support
    MDSED_INVALID_RESOURCE: 30,
    MDSED_AUTH_ERROR: 31,
    MDSED_ACCOUNT_ERROR: 32,
    MDSED_POST_ADDRESS_ERROR: 33,
    MDSED_MESSAGE_PROFILE_DISABLED: 34,
    MDSED_ACCOUNT_MESSAGING_DISABLED: 35,
    MDSED_UNHEALTHY_FROM_NUMBER: 36,
    MDSED_MESSAGE_QUEUE_FULL: 37,

    MDSED_MESSAGE_TOO_LARGE: 50,
    MDSED_INVALID_FROM_ADDRESS: 51,

    //Perhaps block messaging identity
    MDSED_BLOCKED_DUE_TO_CONTENT: 53, //Internal account has messaging disabled
    MDSED_ATT_10DLC_SPAM: 55, //Internal account has messaging disabled
    MDSED_ATT_10DLC_SENDING_LIMIT: 56, //Internal account has messaging disabled

    MDSED_OTHER_ERROR: 99, //Internal account has messaging disabled

    //End Administrative errors -- send to support
    MDSED_NO_ERROR: 800, //No error detected positively

    MDSED_GENERIC_ERROR: 999
});

export const VOICE_CALL_STATUS = Object.freeze({
    VCS_CALL_STARTED: 0,
    VCS_ANSWERED: 1,
    VCS_HUNGUP: 2,
    VCS_TIMEDOUT: 3,
    VCS_UNKNOWN: 4,
    VCS_ERROR: 80
});

export const TEMPLATE_USE_ACTION = Object.freeze({
    //Booking Related
    TUA_BOOKING_CREATE: {
        id: 'create',
        order: 1,
        title: 'Booking was created'
    },
    TUA_BOOKING_REMINDER: {
        id: 'reminder',
        order: 2,
        title: 'Booking Reminder'
    },
    TUA_BOOKING_CONFIRM: {
        id: 'confirm',
        order: 3,
        title: 'Response to customer\'s booking confirmation'
    },
    TUA_BOOKING_CHECKIN: {
        id: 'checkin',
        order: 4,
        title: 'Response to customer checkin'
    },
    TUA_BOOKING_WELCOME: {
        id: 'welcome',
        order: 5,
        title: 'Welcome/Ready message sent to customer'
    },
    TUA_BOOKING_COMPLETION: {
        id: 'complete',
        order: 6,
        title: 'After booking is marked complete sent to customer'
    },
    TUA_MKT_CUSTOM: {
        id: 'mkt_custom',
        order: 700,
        title: 'Marketing'
    },
});


export const BL_JOB_TAG = Object.freeze({
    BLJT_WAIT_LIST_BATCH_CONVERT: "J_WL_CONVERT",
    BLJT_DAILY_UPCOMING_APPOINTMENTS: "J_UPCOMING_APPOINTMENTS",
});
export const WL_STATUS = Object.freeze({
    WLS_WAITING_FOR_SETTING: 0,
    WLS_WAITLISTED: 1,
    WLS_CANCELLED: 2,
    WLS_CONVERTED_TO_BOOKING: 3,
});


export const INV_ORDER_TYPE = Object.freeze({
    IOT_BOOKING: 'b',
    IOT_PURCHASE_ORDER: 'p'
});

export const AUTO_PURCH_TYPE = Object.freeze({
    APT_ONETIME: "onetime",
    APT_FIRST_DAY_OF_MONTH: "first_dom",
    APT_LAST_DAY_OF_MONTH: "last_dom",
    APT_MSG_CREDITS: "msg_credits",
    APT_YEARLY: "once_in_year",
    APT_MONTHLY: "once_in_month",
});

export const COMPARE_OP = Object.freeze({
    CO_LT: 'lt',
    CO_LTE: 'lte',
    CO_EQ: 'eq',
    CO_GT: 'gt',
    CO_GTE: 'gte'
});

export const COURSE_TYPE = Object.freeze({
    ONE_CLASS: 'one_class',
    MULTIPLE_CLASSES: 'multiple_classes',
    RECURRING_CLASSES: 'recurring_classes'
});
export const PAYMENT_MESSAGES = Object.freeze({
    CARD_WAS_CHARGED: 'Card was charged',
    INSUFFICIENT_FUNDS: 'Insufficient Funds',
    ERROR_CHARGING_CARD: 'Error charging for card'
})

export const CLOVER_ERROR_CODE = Object.freeze({
    INVALID_REQUEST: 'invalid_request',
    CARD_DECLINED: 'card_declined'
})

export const STRIPER_ERROR_CODE = Object.freeze({
    INSUFFICIENT_FUNDS: 'insufficient_funds'
})

export const CLASS_STATUS = Object.freeze({
    DRAFT: 'draft',
    ACTIVE: 'active',
    CANCEL: 'cancel'
})

export const CLASS_SIGNUP_STATUS = Object.freeze({
    CONFIRM: 'confirm',
    PAYMENT_NOT_STARTED: 'payment_not_started',
    PAYMENT_PENDING: 'payment_pending',
    PAYMENT_FAILED: 'payment_failed',
    WAITLIST: 'waitlist',
    DROP: 'drop',
})

export const CLASS_INSTANCE_STATUS = Object.freeze({
    NOT_STARTED: 'not_started',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCEL: 'cancel',
    RESCHEDULE: 'reschedule'
})

export const CLASS_TRACKER_STATUS = Object.freeze({
    PRESENT: 'present',
    ABSENT: 'absent',
})

export const CLASS_REFUND_POLICY_TYPE = Object.freeze({
    PRORATED: 'prorated',
    NO_REFUND: 'no_refund',
})

export const BUS_TYPE = Object.freeze({
    BST_UNKNOWN: 0,
    BST_MERCHANT: 1,
    BST_FRANCHISE: 2,
    BST_PARTNERORG: 3,
    BST_SUPERORG: 99,
});