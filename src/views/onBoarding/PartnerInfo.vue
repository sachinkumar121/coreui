<template>
<div>
	<CRow>
		<CCol sm="12">
			<div class="logo text-center">
				<img class="logo-auth" src="/img/logo-icon-auth.png" />
				<span>SkySalon</span> 
			  <br />
			</div> 
			<div class='partnerinfo_div'>
				<p>Personal information is data that can be used to uniquely identify or contact a single person. You may be asked to provide your personal information anytime you are in contact with Silver Sky Soft Services or any affiliated company. Personal information may also be collected by our apps when you signup or use features that require saving of such data. We may also collect personal information about your customers when they or you interact with our App or service. </p>
				<p>The personal information we collect allows us to keep you posted on Silver Sky Soft’s latest product announcements, updates, and upcoming events. It also helps us to improve our services, content, and advertising. If you don’t want to be on our mailing list, you can opt out anytime by contacting us via email below. We also use personal information to help us develop, deliver, and improve our products, services, content, and advertising. From time to time, we may use your personal information to send important notices, such as communications about accounts and changes to our terms, conditions, and policies. Because this information is important to your interaction with Silver Sky Soft, you may not opt out of receiving these communications. We may also use personal information for internal purposes such as auditing, data analysis, and research to improve our products, services, and customer communications.</p>
				<p>The personal information we collect allows us to keep you posted on Silver Sky Soft’s latest product announcements, updates, and upcoming events. It also helps us to improve our services, content, and advertising. If you don’t want to be on our mailing list, you can opt out anytime by contacting us via email below. We also use personal information to help us develop, deliver, and improve our products, services, content, and advertising. From time to time, we may use your personal information to send important notices, such as communications about accounts and changes to our terms, conditions, and policies. Because this information is important to your interaction with Silver Sky Soft, you may not opt out of receiving these communications. We may also use personal information for internal purposes such as auditing, data analysis, and research to improve our products, services, and customer communications.</p>
			</div>
			<div class='partnersignup_div mb-3'>
				<a href="javascript:void(0)" @click="$emit('proceed')" class="btn btn-success fs-6 px-4 py-2">Create your Partner account</a>
			</div>
		</CCol>
	</CRow>
</div>
</template>
<script>
export default {
  name: 'ProfileInfo',
  emits: ['proceed']
}
</script>
<style scoped>
.partnerinfo_div{
	font-size: 18px;
}
.partnersignup_div{
	text-align: right;
}
</style>
