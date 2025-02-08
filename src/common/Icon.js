import { defineComponent, h, createApp } from 'vue';
import { UserIcon, LayoutDashboardIcon, AddressBookIcon, FileDotsIcon, BusinessplanIcon, FileInfoIcon, FileChartIcon, UsersIcon, BorderAllIcon, BriefcaseIcon, LayoutGridAddIcon, CheckupListIcon, CalendarEventIcon, DeviceMobileMessageIcon, SettingsIcon, FileSettingsIcon, SettingsAutomationIcon, AwardIcon, ComponentsIcon, ReportAnalyticsIcon, BookUploadIcon, ChartDots3Icon, AntennaBars5Icon, BuildingIcon, ShieldLockIcon, InfoCircleIcon, LogoutIcon, XIcon, PlusIcon, AdjustmentsHorizontalIcon, DeviceMobileIcon, ClipboardIcon, DotsVerticalIcon, EditIcon, ListDetailsIcon, BackspaceIcon, EyeOffIcon, ReceiptOffIcon, NetworkIcon, MessageIcon, ClipboardListIcon, PlaylistXIcon, BrowserXIcon, FloatCenterIcon, MoonIcon, SunIcon, ShoppingCartIcon, DeviceTabletIcon, CreditCardIcon, PrinterIcon, MailIcon, ReceiptRefundIcon,ShieldCheckIcon, ShieldOffIcon, SendIcon, SearchIcon, ChevronLeftIcon, ExclamationCircleIcon, CircleCheckIcon,  CircleNumber1Icon, CircleNumber2Icon, CircleNumber3Icon, CircleNumber4Icon, EraserIcon, SquarePlusIcon, TrashIcon, CopyIcon, ReportMoneyIcon, CalendarDueIcon, ClipboardTextIcon, NotebookIcon, BookIcon, CirclesIcon, VectorBezierArcIcon, MapPinsIcon, Settings2Icon, FileInvoiceIcon, ClockIcon, PinnedFilledIcon, HourglassEmptyIcon, ReceiptTaxIcon, MapPinIcon, WorldIcon, ClickIcon, CalendarTimeIcon, ChecklistIcon, ListNumbersIcon, MessagePlusIcon, TableIcon, BlockquoteIcon, ListCheckIcon, PhotoIcon, UploadIcon, DragDropIcon, AlbumIcon, PolaroidIcon, CircleArrowLeftIcon, CircleArrowRightIcon, ArrowNarrowRightIcon, SortAscendingIcon, SortDescendingIcon, SwitchVerticalIcon, EyeIcon, ChevronUpIcon, FilterIcon, SettingsFilledIcon, CirclePlusIcon } from "vue-tabler-icons";

import BonusSettingIcon from '@/common/svg/SettingsDollar';
import LoyaltySettingIcon from '@/common/svg/IconLoyaltySetting';
import ChevronDropIcon from '@/common/svg/DropIcon';
import CurrencyDollarIcon from '@/common/svg/CurrencyDollar';
import CheckAllIcon from '@/common/svg/CheckAll';
import CheckCircleSharpIcon from '@/common/svg/CheckCircleS';
import CheckCircleDoneIcon from '@/common/svg/CheckCircleD';
import CloseCircleSharpIcon from '@/common/svg/CloseCircle';
import AmazonAlexaIcon from '@/common/svg/IconAlexa';
import GoogleHomeIcon from '@/common/svg/GoogleHome';
import FacebookIcon from '@/common/svg/IconFacebook';
import RefreshIcon from '@/common/svg/IconRefresh';
import CalendarXIcon from '@/common/svg/CalendarX';
import ChannelShareRegularIcon from '@/common/svg/MyReferrals';
import LineStyleIcon from '@/common/svg/LineStyle';
import NotesOffIcon from '@/common/svg/NotesOff';
import SquareRoundedPlusIcon from '@/common/svg/SquareRoundedPlus'
import MdiWarningIcon from '@/common/svg/MdiWarning'
import IconNewSale from '@/common/svg/IconNewSale';
import IconInvoiceList from '@/common/svg/IconInvoiceList';
import IconInvoicePayments from '@/common/svg/IconInvoicePayments';
import IconCustomers from '@/common/svg/IconCustomers';
import IconCreateNewPurchase from '@/common/svg/IconCreateNewPurchase';
import IconInvoiceCustomerPayments from '@/common/svg/IconInvoiceCustomerPayments';
import IconManageGroups from '@/common/svg/IconManageGroups';
import IconManageResources from '@/common/svg/IconManageResources';
import IconProducts from '@/common/svg/IconProducts';
import IconCategory from '@/common/svg/IconCategory';
import IconServices from '@/common/svg/IconServices';
import IconManagePackages from '@/common/svg/IconManagePackages';
import IconManageCoupons from '@/common/svg/IconManageCoupons';
import IconPurchasedPackages from '@/common/svg/IconPurchasedPackages';
import IconPastOrders from '@/common/svg/IconPastOrders';
import IconPaymentProfiles from '@/common/svg/IconPaymentProfiles';
import IconSubscription from '@/common/svg/IconSubscription';
import IconTemplates from '@/common/svg/IconTemplates';
import IconCampaign from '@/common/svg/IconCampaign';
import IconAllReports from '@/common/svg/IconAllReports';
import IconTopSelling from '@/common/svg/IconTopSelling';
import IconProductServices from '@/common/svg/IconProductServices';
import IconBuySubscription from '@/common/svg/IconBuySubscription';
import IconHelpSquare from '@/common/svg/IconHelpSquare';
import IconEmployee from '@/common/svg/IconEmployee';
import Loading from '@/common/svg/Loading';
import AlbumGridIcon from '@/common/svg/Album';
import ProductIcon from '@/common/svg/Product';
import StarIcon from '@/common/svg/StarIcon';
import MinusIcon from '@/common/svg/Minus';
import UserPlus from '@/common/svg/UserPlus';
import IconRosetteDiscountCheck from '@/common/svg/IconRosetteDiscountCheck';
import IconRosetteDiscountCheckOff from '@/common/svg/IconRosetteDiscountCheckOff';
import DonationIcon from '@/common/svg/Donation'
import FilterFilledIcon from '@/common/svg/FilterFilled'

export default {
	components: {
		ChevronDropIcon,
		CurrencyDollarIcon,
		CheckAllIcon,
		CheckCircleSharpIcon,
		CheckCircleDoneIcon,
		CloseCircleSharpIcon, 
		AmazonAlexaIcon,
		GoogleHomeIcon,
		FacebookIcon,
		RefreshIcon,
		CalendarXIcon,
		ChannelShareRegularIcon,
		LineStyleIcon,
		DeviceTabletIcon,
		CreditCardIcon,
		PrinterIcon,
		ReceiptOffIcon, 
		MailIcon,
		ReceiptRefundIcon,
		NotesOffIcon,
		SendIcon,
		SearchIcon,
		ChevronLeftIcon,
		ShieldCheckIcon,
		ShieldOffIcon,
		ExclamationCircleIcon, 
		CircleCheckIcon,
		CircleNumber1Icon,
		CircleNumber2Icon,
		CircleNumber3Icon,
		CircleNumber4Icon,
		EraserIcon,
		SquarePlusIcon,
		TrashIcon,
		CopyIcon,
		SquareRoundedPlusIcon,
		MdiWarningIcon,
		ChartDots3Icon,
		InfoCircleIcon,
		ReportMoneyIcon ,
		IconNewSale,
		IconInvoiceList,
		IconInvoicePayments,
		IconCustomers,
		IconCreateNewPurchase,
		IconInvoiceCustomerPayments,
		IconManageGroups,
		IconManageResources,
		IconProducts,
		IconCategory,
		IconServices,
		IconManagePackages,
		IconManageCoupons,
		IconPurchasedPackages,
		IconPastOrders,
		IconPaymentProfiles,
		IconSubscription,
		IconBuySubscription,
		IconTemplates,
		IconCampaign,
		IconAllReports,
		IconTopSelling,
		IconProductServices,
		CalendarDueIcon,
		IconHelpSquare,
		IconEmployee,
		Loading,
		ClipboardTextIcon,
		NotebookIcon, 
		BookIcon,
		CirclesIcon,
		VectorBezierArcIcon,
		MapPinsIcon,
		Settings2Icon,
		FileInvoiceIcon,
		ClockIcon,
		PinnedFilledIcon,
		HourglassEmptyIcon,
		ReceiptTaxIcon,
		MapPinIcon,
		BonusSettingIcon,
		LoyaltySettingIcon,
		WorldIcon,
		ClickIcon,
		CalendarTimeIcon,
		ChecklistIcon,
		ListNumbersIcon,
		MessagePlusIcon,
		TableIcon,
		BlockquoteIcon,
		ListCheckIcon,
		PhotoIcon,
		UploadIcon,
		DragDropIcon,
		AlbumIcon,
		AlbumGridIcon,
		PolaroidIcon,
		ProductIcon,
		StarIcon,
		MinusIcon,
		UserPlus,
		CircleArrowLeftIcon,
		CircleArrowRightIcon,
		ArrowNarrowRightIcon,
		IconRosetteDiscountCheck,
		DonationIcon,
		SortAscendingIcon, 
		SortDescendingIcon, 
		SwitchVerticalIcon,
		EyeIcon,
		ChevronUpIcon,
		FilterIcon,
		FilterFilledIcon,
		SettingsFilledIcon,
		CirclePlusIcon
	}
}

const mapIconPropToIconComponent = {
    'tabler:user': UserIcon,
    'tabler:layout-dashboard': LayoutDashboardIcon,
    'tabler:address-book': AddressBookIcon,
    'tabler:file-dots': FileDotsIcon,
    'tabler:businessplan': BusinessplanIcon,
    'tabler:file-info': FileInfoIcon,
    'tabler:file-chart': FileChartIcon,
    'tabler:users': UsersIcon,
    'tabler:border-all': BorderAllIcon,
    'tabler:briefcase': BriefcaseIcon,
    'tabler:layout-grid-add': LayoutGridAddIcon,
    'tabler:checkup-list': CheckupListIcon,
    'tabler:calendar-event': CalendarEventIcon,
    'tabler:device-mobile-message': DeviceMobileMessageIcon,
    'tabler:settings': SettingsIcon,
    'tabler:file-settings': FileSettingsIcon,
    'tabler:settings-automation': SettingsAutomationIcon,
    'tabler:award': AwardIcon,
    'tabler:components': ComponentsIcon,
    'tabler:report-analytics': ReportAnalyticsIcon,
    'tabler:book-upload': BookUploadIcon,
    'tabler:chart-dots-3': ChartDots3Icon,
    'tabler:antenna-bars-5': AntennaBars5Icon,
    'tabler:building': BuildingIcon,
    'tabler:shield-lock': ShieldLockIcon,
    'tabler:info-circle': InfoCircleIcon,
    'tabler:logout': LogoutIcon,
    'tabler:x': XIcon,
    'tabler:plus': PlusIcon,
    'tabler:adjustments-horizontal': AdjustmentsHorizontalIcon,
    'tabler:device-mobile': DeviceMobileIcon,
    'tabler:clipboard': ClipboardIcon,
    'tabler:dots-vertical': DotsVerticalIcon,
    'tabler:edit': EditIcon,
    'tabler:list-details': ListDetailsIcon,
    'tabler:backspace': BackspaceIcon,
    'tabler:eye-off': EyeOffIcon,
    'tabler:receipt-off': ReceiptOffIcon,
    'tabler:network': NetworkIcon,
    'tabler:message': MessageIcon,
    'tabler:clipboard-list': ClipboardListIcon,
    'tabler:playlist-x': PlaylistXIcon,
    'tabler:browser-x': BrowserXIcon,
	'tabler:float-center': FloatCenterIcon,
	'tabler:shopping-cart': ShoppingCartIcon,
	'tabler:sun':SunIcon,
	'tabler:moon':MoonIcon,
	'ion:chevron-down': ChevronDropIcon,
	'bi:check-all': CheckAllIcon,
	'bi:currency-dollar': CurrencyDollarIcon,
	'ion:checkmark-circle-sharp': CheckCircleSharpIcon,
	'ion:checkmark-done-circle-sharp': CheckCircleDoneIcon,
	'ion:close-circle-sharp': CloseCircleSharpIcon,
	'simple-icons:amazonalexa': AmazonAlexaIcon,
	'iconoir:google-home': GoogleHomeIcon,
	'la:facebook-f': FacebookIcon,
	'ion:refresh': RefreshIcon,
	'bx:calendar-x': CalendarXIcon,
	'fluent:channel-share-12-regular': ChannelShareRegularIcon,
	'cil:line-style': LineStyleIcon,
	'tabler:device-tablet': DeviceTabletIcon,
	'tabler:credit-card': CreditCardIcon,
	'tabler:printer': PrinterIcon,
	'tabler:mail': MailIcon,
	'tabler:receipt-refund' : ReceiptRefundIcon,
	'tabler:notes-off': NotesOffIcon,
	'tabler:send-icon': SendIcon,
	'tabler:search-icon': SearchIcon,
	'tabler:chevron-left': ChevronLeftIcon,
	'tabler:shield-off': ShieldOffIcon,
	'tabler:shield-check': ShieldCheckIcon,
	'tabler:exclamation-circle': ExclamationCircleIcon,
	'tabler:circle-check': CircleCheckIcon,
	'tabler:circle-number-1': CircleNumber1Icon,
	'tabler:circle-number-2': CircleNumber2Icon,
	'tabler:circle-number-3': CircleNumber3Icon,
	'tabler:circle-number-4': CircleNumber4Icon,
	'tabler:eraser': EraserIcon,
	'tabler:square-rounded-plus': SquarePlusIcon,
	'tabler:trash': TrashIcon,
	'tabler:copy':CopyIcon,
	'custom:square-rounded-plus':SquareRoundedPlusIcon,
	'mdi:warning': MdiWarningIcon,
	'tabler:report-money': ReportMoneyIcon,
	'majesticons:dollar-circle-line': IconNewSale,
	'gg:loadbar-doc': IconInvoiceList,
	'uil:bill': IconInvoicePayments,
	'material-symbols:person-4-outline-rounded': IconCustomers,
	'material-symbols:note-add-outline': IconCreateNewPurchase,
	'uil:invoice': IconInvoiceCustomerPayments,
	'material-symbols:tab-group-outline-rounded': IconManageGroups,
	'material-symbols:file-copy-outline-rounded': IconManageResources,
	'mdi:box-variant-closed': IconProducts,
	'material-symbols:category-outline-rounded': IconCategory,
	'ri:service-line': IconServices,
	'ant-design:setting-outlined': IconManagePackages,
	'mdi:coupon-outline': IconManageCoupons,
	'icon-park-outline:agreement': IconPurchasedPackages,
	'mdi:shop-time-outline': IconPastOrders,
	'mdi:account-payment-outline': IconPaymentProfiles,
	'eos-icons:product-subscriptions-outlined': IconSubscription,
	'icon-park-outline:doc-success': IconBuySubscription,
	'lucide:layout-template': IconTemplates,
	'material-symbols:campaign-outline-rounded': IconCampaign,
	'mdi:file-document-outline': IconAllReports,
	'mdi:arrow-top-right-bold-box-outline': IconTopSelling,
	'fluent-mdl2:product-variant': IconProductServices,
	'tabler:calendar-due': CalendarDueIcon,
	'material-symbols:help-center-outline-rounded': IconHelpSquare,
	'icon-park-outline:necktie': IconEmployee,
	'icon:loading': Loading,
	'tabler:clipboard-text': ClipboardTextIcon,
	'tabler:notebook': NotebookIcon,
	'tabler:book': BookIcon,
	'tabler:circles': CirclesIcon,
	'tabler:vector-bezier-arc': VectorBezierArcIcon,
	'tabler:map-pins': MapPinsIcon,
	'tabler:settings-2': Settings2Icon,
	'tabler:file-invoice': FileInvoiceIcon,
	'tabler:clock': ClockIcon,
	'tabler:pinned-filled-icon': PinnedFilledIcon,
	'tabler:hourglass-empty': HourglassEmptyIcon,
	'tabler:tax': ReceiptTaxIcon,
	'tabler:location': MapPinIcon,
	'icon:bonus-setting': BonusSettingIcon,
	'icon:loyalty-setting': LoyaltySettingIcon,
	'tabler:world': WorldIcon,
	'tabler:click': ClickIcon,
	'tabler:calendar-time': CalendarTimeIcon,
	'tabler:checklist': ChecklistIcon,
	'tabler:list-numbers': ListNumbersIcon,
	'tabler:message-plus': MessagePlusIcon,
	'tabler:table': TableIcon,
	'tabler:blockquote': BlockquoteIcon,
	'tabler:list-check': ListCheckIcon,
	'tabler:photo-icon': PhotoIcon,
	'tabler:upload': UploadIcon,
	'tabler:drag-drop': DragDropIcon,
	'tabler:album': AlbumIcon,
	'tabler:album-grid': AlbumGridIcon,
	'tabler:polaroid': PolaroidIcon,
	'tabler:product-icon': ProductIcon,
	'tabler:star-icon': StarIcon,
	'tabler:minus': MinusIcon,
	'tabler:user-plus': UserPlus,
	'tabler:circle-arrow-left': CircleArrowLeftIcon,
	'tabler:circle-arrow-right': CircleArrowRightIcon,
	'tabler:arrow-narrow-right': ArrowNarrowRightIcon,
	'tabler:rosette-discount-check': IconRosetteDiscountCheck,
	'tabler:rosette-discount-check-off': IconRosetteDiscountCheckOff,
	'tabler:donation-icon' : DonationIcon,
	'tabler:sort-ascending' : SortAscendingIcon, 
	'tabler:sort-descending' : SortDescendingIcon, 
	'tabler:switch-vertical': SwitchVerticalIcon,
	'tabler:eye' : EyeIcon, 
	'tabler:eye-off' : EyeOffIcon,
	'tabler:chevron-up': ChevronUpIcon,
	'tabler:filter': FilterIcon,
	'tabler:filter-filled': FilterFilledIcon,
	'tabler:settings-filled': SettingsFilledIcon,
	'tabler:circle-plus':CirclePlusIcon,
}

const Icon =  defineComponent({
    name: 'Icon',
    components:{
        UserIcon,
		LayoutDashboardIcon,
		AddressBookIcon, 
		FileDotsIcon, 
		BusinessplanIcon,
		FileInfoIcon,
		FileChartIcon,
		UsersIcon,
		BorderAllIcon,
		BriefcaseIcon,
		LayoutGridAddIcon,
		CheckupListIcon,
		CalendarEventIcon,
		DeviceMobileMessageIcon,
		SettingsIcon,
		FileSettingsIcon,
		SettingsAutomationIcon,
		AwardIcon,
		ComponentsIcon,
		ReportAnalyticsIcon,
		BookUploadIcon,
		ChartDots3Icon,
		AntennaBars5Icon,
		BuildingIcon,
		ShieldLockIcon,
		InfoCircleIcon,
		LogoutIcon,
		XIcon,
		PlusIcon,
		AdjustmentsHorizontalIcon,
		DeviceMobileIcon,
		ClipboardIcon,
		DotsVerticalIcon,
		EditIcon,
		ListDetailsIcon,
		BackspaceIcon,
		EyeOffIcon,
		ReceiptOffIcon,
		NetworkIcon,
		MessageIcon,
		ClipboardListIcon,
		PlaylistXIcon,
		BrowserXIcon,
		SunIcon,
		MoonIcon,
		DeviceTabletIcon,
		CreditCardIcon,
		PrinterIcon,
		MailIcon,
		ReceiptRefundIcon,
		NotesOffIcon,
		SearchIcon,
		SendIcon,
		ChevronLeftIcon,
		ShieldCheckIcon,
		ShieldOffIcon,
		CircleNumber1Icon,
		CircleNumber2Icon,
		CircleNumber3Icon,
		CircleNumber4Icon,
		EraserIcon,
		SquarePlusIcon,
		TrashIcon,
		CopyIcon,
		SquareRoundedPlusIcon,
		MdiWarningIcon,
		ReportMoneyIcon,
		IconNewSale,
		IconInvoiceList,
		IconInvoicePayments,
		IconCustomers,
		IconCreateNewPurchase,
		IconInvoiceCustomerPayments,
		IconManageGroups,
		IconManageResources,
		IconProducts,
		IconCategory,
		IconServices,
		IconManagePackages,
		IconManageCoupons,
		IconPurchasedPackages,
		IconPastOrders,
		IconPaymentProfiles,
		IconSubscription,
		IconBuySubscription,
		IconTemplates,
		IconCampaign,
		IconAllReports,
		IconTopSelling,
		IconProductServices,
		CalendarDueIcon,
		IconHelpSquare,
		IconEmployee,
		Loading,
		ClipboardTextIcon,
		NotebookIcon,
		BookIcon,
		CirclesIcon,
		VectorBezierArcIcon,
		MapPinsIcon,
		Settings2Icon,
		FileInvoiceIcon,
		ClockIcon,
		BonusSettingIcon,
		LoyaltySettingIcon,
		WorldIcon,
		ClickIcon,
		CalendarTimeIcon,
		ListNumbersIcon,
		TableIcon,
		BlockquoteIcon,
		PhotoIcon,
		UploadIcon,
		DragDropIcon,
		AlbumGridIcon,
		PolaroidIcon,
		AlbumGridIcon,
		StarIcon,
		MinusIcon,
		UserPlus,
		CircleArrowLeftIcon,
		CircleArrowRightIcon,
		ArrowNarrowRightIcon,
		IconRosetteDiscountCheck,
		IconRosetteDiscountCheckOff,
		DonationIcon,
		SortAscendingIcon, 
		SortDescendingIcon, 
		SwitchVerticalIcon,
		EyeIcon,
		FilterFilledIcon,
		CirclePlusIcon
	},
	props: {
		icon: {
			type: String,
			required: true
		},
		strokeWidth: {
			default: 2,
			type: Number
		},
		width: {
			default: 24,
			type: Number
		},
		height: {
			default: 24,
			type: Number
		}
	},
	render(props) {
        const icon = props.icon;
		// console.log(mapIconPropToIconComponent[icon])
		if (mapIconPropToIconComponent[icon]) {
			return h(mapIconPropToIconComponent[icon], { strokeWidth : props.strokeWidth, style: { fill: 'transparent', width: props.width + 'px', height: props.height + 'px', verticalAlign: 'middle'} }); 
		} else {
			return h('span');
		}
	}
});

export function getIconHtml(props) {
	const tempApp = createApp({
		render() {
			return h(Icon, {
				...props
			})
		}
	})

	// in Vue 3 we need real element to mount to unlike in Vue 2 where mount() could be called without argument...
	const el = document.createElement('div');
	const mountedApp = tempApp.mount(el)

	return mountedApp.$el.outerHTML;
}


export { Icon }
