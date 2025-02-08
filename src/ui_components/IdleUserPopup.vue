<template>
    <CModal
        :visible="visible"
        alignment="center"
        backdrop="static"
    >
        <CModalHeader :close-button="false">
            <CModalTitle>Signing off</CModalTitle>
        </CModalHeader>
        <CModalBody>Our dashboard will be signing off due to no recent activity. To continue you will need to sign in again. Thank you</CModalBody>
    </CModal>
</template>

<script>
export default {
    props: {
        visible: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return ({
            countDownSec: 10
        });
    }
}
</script>