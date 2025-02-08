<template>
    <div class="loader-section">
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
        <div class="incoming_msg mb-2 incoming-loader">
        <div class="received_msg d-inline-block">
            <div class="received_withd_msg">
                <div class="loading loading-msg mb-1"></div>
                <div class="d-flex justify-content-between mt-1">
                <div class="loading"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="outgoing_msg mb-2 outgoing_deliver outgoing-loader">
        <div class="sent_msg">
            <div class="loading loading-msg"></div>
            <div class="d-flex justify-content-between mt-1 float-end w-100">
            <div class="loading w-100"></div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatDataShimmer"
}
</script>

<style scoped lang="scss">
.loader-section {
  height: calc(100vh - 342px);
  overflow: hidden;
}
.conversation-outer {
  .incoming_msg, .outgoing_msg {
    transform: rotate(180deg);
    direction: ltr;
}
}
.received_msg {
  display: inline-block;
  // padding: 0 0 0 10px;
  vertical-align: top;
  width: 100%;
}

.received_withd_msg {
  width: 100%;

  p {
    border-radius: 3px;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    border-radius: 12px 12px 12px 0;
    max-width: calc(100% - 2rem);
  }
}

.outgoing_msg {
  overflow: hidden;
  margin: 8px 0 8px;
}

.sent_msg {
  float: right;
  // width: 85%;
  p {
    background: #6D57E4;
    border-radius: 3px;
    color: #fff;
    font-size: 14px;
    margin: 0;
    color: #fff;
    padding: 5px 10px 5px 12px;
    border-radius: 12px 12px 0 12px;
  }
}
@media (max-width: 1200px) {
  
  .received_withd_msg {
    p {
      max-width: calc(100% - 2rem);
    }
  }

  .sent_msg {
    max-width: calc(100% - 2rem);
  }
}

</style>