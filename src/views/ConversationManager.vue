<template>
  <div>
    <div class="d-flex font-overpass">
      <AppSideBar />
      <div class="w-100 section-right">
        <AppHeader class="print-d-none" />
        <CContainer fluid class="wrap-body">
          <CCard class="card-custom mx-n-15 border-0 ">
            <CCardBody class="p-2 pb-0 pb-sm-0 p-sm-3 table-invoice-body">
              <CRow class="gx-0">
                <CCol class="mb-2">                  
                  <div class="messaging"  :class="{'collapse-panel': collapseCustomerInfo}">
                    <div class="inbox_msg d-flex position-relative">
                      <div class="inbox_people float-start w-100 overflow-hidden w-100" :class="{'d-none': activeConversation && isMobileView}">
                        <div class="headind_srch overflow-hidden">
                          <div class="srch_bar d-inline-block text-end">
                            <div class="stylish-input-group position-relative">
                              <input type="text" class="search-bar form-control"  placeholder="Search" >
                              <span class="input-group-addon position-absolute">
                                <button type="button">
                                  <Icon icon="tabler:search-icon" :height="19" />
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="inbox_chat">
                          <div class="msg_list" :key="index" v-for="(conver, index) in msgConvesations" :class="{'active_chat': activeConversation?._id == conver._id}" @click="activateConversation(conver)">
                            <div class="msg_people overflow-hidden">
                              <div class="msg_img float-start"> </div>
                              <div class="msg_ib">
                                <h5>
                                  <template v-if="conver.app_side_user_first_name">
                                    {{conver.app_side_user_first_name}} {{conver.app_side_user_last_name}}
                                  </template>
                                  <template v-else>
                                    {{conver.msg_identity_visitor}} 
                                  </template>
                                  <span class="msg_date float-end text-light-detail">{{getFormattedDateShort(conver.last_msg_utc)}}</span>
                                </h5>
                                <p class="opacity-7">{{conver.last_message_preview}}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="!activeConversation" class="no_selection d-md-flex align-items-center justify-content-center w-100 d-none">
                        <div class="py-5 text-center">
                          <img src="/img/no-result.svg" alt="" class="img-empty" style="width:250px;">
                          <p class="h5 mt-4 d-block text-center">Select a conversation on the left </p>
                        </div>
                      </div>
                      <div v-else class="w-100 d-md-block"
                        :class="{'d-none': !isMobileView}"
                      >
                        <div class="d-md-flex w-100">
                          <div class="mesgs float-start  position-relative">
                            <div class="msg_history" id="conversation-scroller" ref="conversation_scroller">
                              <div class="msg_history_head_outer d-lg-flex justify-content-between w-100 py-2 border-bottom px-3 align-items-center position-absolute filter-wrap">
                                <div class="msg_history_head d-flex justify-content-start align-items-center">
                                  <span @click="deactivateConversation" class="back-to-list d-block"><Icon icon="tabler:chevron-left" :height="24" /></span>
                                  <h5 class="pb-1 mb-0 mb-lg-0 me-2">
                                    <template v-if="activeConversation.app_side_user_first_name">
                                    {{activeConversation.app_side_user_first_name}} {{activeConversation.app_side_user_last_name}}
                                    <span v-if="hideSidePanel==true" @click="showUserInfoPanel"><Icon icon='tabler:info-circle'/></span>
                                  </template>
                                  <template v-else>
                                    {{activeConversation.msg_identity_visitor}} 
                                  </template> 
                                  </h5>
                                </div>
                                <div class="d-flex d-flex align-items-start align-lg-items-center">
                                  <div class="form-floating filter-status">
                                    <v-select id="select-status"
                                      v-model="selectedMsgFilters"
                                      placeholder=""
                                      multiple
                                      label="label" :options="messageFilters"
                                      :reduce="st => st.value"
                                      :class="{'options-selected': selectedMsgFilters.length > 0}"
                                      >
                                      <!-- <v-select id="select-status"
                                        placeholder=""
                                        multiple
                                        label="label" :options="messageFilters"
                                        :reduce="st => st.value"
                                        :key="selected-msg-filters"
                                        :class="{'options-selected': selected-msg-filters.length > 0}"
                                        > -->
                                      <template v-slot:no-options>
                                        Type to search..
                                      </template>
                                      <template v-slot:option="option" >
                                        <div class="d-center">
                                          {{ option.label }}
                                        </div>
                                      </template>
                                      <template v-slot:selected-option="option" >
                                        <div class="selected d-center">
                                          {{ option.label }}
                                        </div>
                                      </template>
                                    </v-select>
                                    <label for="select-status">Select filter</label>
                                  </div>
                                  <CButton v-if="customerDetails" @click="togglePanel" class="ms-0 setting-profile px-0 d-xl-none d-inline-block" style="padding-right:0 !important;">
                                    <Icon icon="tabler:info-circle" :height="24" />
                                  </CButton>
                                </div>
                              </div>
                              <div class="conversation-outer">
                                <div class="conversation-inner px-3 pb-3 pt-0">
                                  <chat-data-shimmer v-if="loading" />
                                  <template v-else>
                                    <template v-if="messagesByDate">
                                    <template v-for="(messages, groupDate) in messagesByDate" :key="groupDate">
                                      <div class="date-divider text-center mt-3">
                                        <span class="">{{ setDateFormat(groupDate)}}</span>
                                      </div>
                                      <template v-for="(message, index) in messages" :key="index">
                                        <div 
                                          v-if="message.msg_type == 'receive'"  class="incoming_msg mb-2">
                                          <div class="received_msg d-inline-block">
                                            <div class="received_withd_msg">
                                              <p class="">{{message.message}}</p>
                                              <div class="d-flex justify-content-between mt-1">
                                                <span class="time_date opacity-7"><span class="me-1">{{message.msg_time}}</span> |  &nbsp; <span class="text-capitalize">Via {{getMessageChannelName(message)}}</span></span> 
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                       
                                        <div v-if="message.msg_type == 'send'" class="outgoing_msg mb-2 outgoing_deliver">
                                          <div class="sent_msg">
                                            <p class="float-end">{{message.message}}</p> <br/>
                                            <div class="d-flex justify-content-between mt-1 float-end">
                                              <span class="time_date opacity-7">
                                                <span class="me-1">{{message.msg_time}}</span> |&nbsp; <span class="text-capitalize">Via {{getMessageChannelName(message)}}</span>
                                              </span>
                                              <!-- <span class="warning-span status-completed"><Icon icon="bi:check-all" :height="20" /></span> -->
                                              <span v-if="message.delivery_status >= 90" class="warning-span status-error">Error</span>
                                              <span 
                                              v-else class="warning-span status-delivered"><Icon icon="bi:check-all" :height="20" /></span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                      </template>
                                      
                                    </template>
                                  </template>
                                  <h2 v-else>No message found</h2>
                                  </template>
                                  
                                </div>
                              </div>
                            </div>
                            <div class="type_msg pt-0 pb-2 px-3">
                              <span class="warning-textarea float-start" v-if="error">{{error}}</span> 
                              <div class="input_msg_write">
                                <textarea ref="message_input" class="write_msg" rows="1" placeholder="Type a message" v-model="message" 
                                @keydown.enter.prevent.exact="sendMessage"
                                @keyup.ctrl.enter.prevent="newLine"
                                ></textarea>
                                <hr class="mt-0">
                                <div class="d-flex align-items-center justify-content-between">
                                  <select class="form-select select-medium w-auto" v-model="messageChannel">
                                    <option v-for="mc in messageChannels" :key="mc.value" :value="mc.value">
                                      {{mc.label}}
                                    </option>
                                  </select>
                                  <button class="msg_send_btn btn btn-primary-new ps-1" type="button" :disabled="disableSendButton()" @click="sendMessage">
                                    <Icon icon="tabler:send-icon" :height="17" />
                                    <span>Send</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-if="hideSidePanel!=true && customerDetails" class="profile_info d-xl-inline-block">
                            <div class="text-start p-3 border-bottom d-flex align-items-center justify-content-between">
                              <!-- <div class="profile_img">
                                <img src="https://ptetutorials.com/images/user-profile.png" alt="img">
                                </div>
                                <p>Olive yew</p> -->
                              <div class="right_profile_top">
                                <div class="d-flex align-items-center justify-content-between">
                                  <p class="h6"><template v-if="activeConversation.app_side_user_first_name">
                                    <span><Icon icon="tabler:chevron-left" @click="hideUserInfoPanel"/>{{activeConversation.app_side_user_first_name}} {{activeConversation.app_side_user_last_name}}</span>
                                  </template>
                                  <template v-else>
                                    {{activeConversation.msg_identity_visitor}} 
                                  </template> </p>
                                  <CButton @click="togglePanel" class="ms-2 setting-profile profile-close px-0 d-inline-block d-xl-none">
                                    <Icon icon="tabler:x" :height="20" />
                                  </CButton>
                                </div>
                                <div class="loading" style="margin-top: 7px; height: 19.19px;" v-if="loading">
                                  <p></p>
                                </div>
                                <template v-else>
                                  <p v-if="customerDetails.email">{{customerDetails.email}}</p>
                                  <p v-if="customerDetails.phone">{{getPhoneFormat(customerDetails.phone)}}</p>
                                </template>
                              </div>
                              <div class="profile_img ms-1 me-2">
                                <img v-if="customerDetails.profile_pic" :src="customerDetails.profile_pic" :alt="customerDetails.first_name +' '+ customerDetails.last_name">
                                <img src="/img/user-profile.png" v-else :alt="customerDetails.first_name +' '+ customerDetails.last_name">
                              </div>
                            </div>
                            <div class="profile_details px-3 pt-3 pb-4">                              
                              <div v-if="customerDetails.booking_data && customerDetails.booking_data.length > 0">
                                <h5 class="h6"><b>Recent Bookings</b></h5>
                                <ul class="ps-0 list-style-none" v-if="loading">
                                  <li class="mb-3">
                                    <div class="row mb-2 pt-1">
                                      <div class="col-8"><div class="loading"></div></div>
                                      <div class="col-4"><div class="loading"></div></div>
                                    </div>
                                    <div class="loading"></div>
                                  </li>
                                  <li class="mb-3">
                                    <div class="row mb-2 pt-1">
                                      <div class="col-8"><div class="loading"></div></div>
                                      <div class="col-4"><div class="loading"></div></div>
                                    </div>
                                    <div class="loading"></div>
                                  </li>
                                  <li class="mb-3">
                                    <div class="row mb-2 pt-1">
                                      <div class="col-8"><div class="loading"></div></div>
                                      <div class="col-4"><div class="loading"></div></div>
                                    </div>
                                    <div class="loading"></div>
                                  </li>
                                  <li class="mb-3">
                                    <div class="row mb-2 pt-1">
                                      <div class="col-8"><div class="loading"></div></div>
                                      <div class="col-4"><div class="loading"></div></div>
                                    </div>
                                    <div class="loading"></div>
                                  </li>
                                  <li class="mb-0">
                                    <div class="row mb-2 pt-1">
                                      <div class="col-8"><div class="loading"></div></div>
                                      <div class="col-4"><div class="loading"></div></div>
                                    </div>
                                    <div class="loading"></div>
                                  </li>
                                </ul>
                                <ol class="ps-3" v-else>
                                  <li class="mb-2" v-for="booking in customerDetails.booking_data" :key="booking._id"> 
                                    <div class="d-flex justify-content-between align-items-center">
                                      <p class="my-0"><a :target="'_blank'" :href="'/bookings/detail/'+booking._id">{{booking.service_order_id}}</a></p>
                                      <small><span class="me-1 fw-400">{{getFormattedDateShort(booking.service_start_date)}}</span>
                                      <!-- <span class="opacity-85">{{booking.service_start_date}}</span> -->
                                      </small>
                                    </div>
                                    <p class="text-light-detail mt-0 ellipsis-text">{{booking.services.map(s => s.name).join(",")}}</p>
                                  </li>
                                </ol>
                              </div>
                              <div v-else class="w-100 d-flex justify-content-center flex-wrap">
                                <img src="/img/no-result.svg" alt="" class="img-empty img-fluid" style="width: 80%;"/>
                                <p class="h6 my-3 d-block text-center">No Recent Booking</p>  
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CContainer>
       
      </div>
    </div>
  </div>
</template>
<script>
import AppSideBar from '@/ui_components/AppSidebar';
import AppHeader from '@/ui_components/AppHeader';
import AppFooter from '@/ui_components/AppFooter';
import ChatDataShimmer from './ChatDataShimmer.vue'
import moment from 'moment';
import AppHelper from "../helpers/app_helper";
import { groupBy } from 'lodash'
import { Icon } from '@/common/Icon';
import { messageChannelsIcons, messageChannelsNames } from '../constants.js';
import { findSpecificDoc, insertDataToCollection } from '../helpers/in-memory-db';
import utils_lib from '../helpers/utils_lib';

export default {
  name: 'ConversationManager',
  components: {
    Icon,
    AppSideBar,
    AppHeader,
    AppFooter,
    ChatDataShimmer
  },
  mounted() {
    window.addEventListener('resize', this.getDimensions);
    this.isMobileView = document.documentElement.clientWidth < 768;
    let that = this;
    this.$schedsdk.msg_conversations({
      search: ''
    }).then(async (result) => {
      that.msgConvesations = result.data;
    }).catch(console.error)
  },
  created() {
    this.$store.commit({
      type: 'updateSidebarVisible',
      value: false,
    });
  },
  data() {
    return {
      mobileView: false,
      loading: false,
      message: '',
      processing: false,
      collapseCustomerInfo: true,
      selectedMsgFilters: [],
      msgConvesations: [],
      conversationData: [],
      messagesByDate: {},
      messageChannel: '5',
      activeConversation: null,
      hideSidePanel: false,
      customerDetails: null,
      error: null,
      messagesIntervalID: null,
      messageChannels: [
        {'value': '1', 'label': 'E-Mail'},
        {'value': '2', 'label': 'Text/SMS'},
        {'value': '5', 'label': 'Whatsapp'}
      ],
      messageFilters: [{
          'value': 'show_all_messages',
          'label': 'Show all messages'
        },
        {
          'value': 'hide_marketing_messages',
          'label': 'Hide marketing messages'
        },
        {
          'value': 'hide_app_notification',
          'label': 'Hide app notification'
        }
      ],
      country_code: this.$store.state.business_settings.business_info.country_code
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.getDimensions);
    clearInterval(this.messagesIntervalID);
  },
  methods: {
    getPhoneFormat(ph) {
      let v = utils_lib.clean_phone(ph, this.country_code)
      return v || ph
    },
    hideUserInfoPanel()
    {
      this.hideSidePanel =true;
    },
    showUserInfoPanel()
    {
      this.hideSidePanel = false
    },
    deactivateConversation() {
      this.activeConversation = null
      this.message = '';
      this.error = null;
      this.selectedMsgFilters = [];
      if (this.messagesIntervalID) {
        clearInterval(this.messagesIntervalID);
        this.messagesIntervalID = null;
      }
    },
    getDimensions() {
      this.isMobileView = document.documentElement.clientWidth < 768;
    },
    disableSendButton() {
      return !this.message.trim().length || this.processing;
    },
    scrollMsgContainerToBottom() {
      let conversation_scroller = this.$refs.conversation_scroller;
      if (conversation_scroller) {
        conversation_scroller.scrollTop = conversation_scroller.scrollHeight;
      }
    },
    setFocusOnMessageInput() {
      let message_input = this.$refs.message_input;
      if (message_input) {
        message_input.focus();
      }
    },
    getMessageChannelIcon(message) {
      return messageChannelsIcons[message.channel || "0"];
    },
    getMessageChannelName(message) {
      return messageChannelsNames[message.channel || "0"];
    },
    setDateFormat(date) {
      return moment(date).format("MMM DD");
    },
    getFormattedDateShort: function (dt_unix) {
      let timezone = this.$store.state.business_settings.business_time_zone;
      if (dt_unix == null || dt_unix == 0) {
        return dt_unix;
      }
      return moment(dt_unix).tz(timezone).format("DD MMM YY hh:mma"); //"MMM DD, YYYY hh:mm a"
      // return moment(dt_unix).format("DD MM YY hh:mma"); //"MMM DD, YYYY hh:mm a"
    },
    togglePanel() {
      this.collapseCustomerInfo = !this.collapseCustomerInfo
    },
    newLine(e) {
      let caret = e.target.selectionStart;
      e.target.setRangeText("\n", caret, caret, "end");
      this.message = e.target.value;
    },

    getMessageList(conversation) {
      let getMessageListPromise = null;
      if (conversation.app_side_user_id) {
        getMessageListPromise = this.$schedsdk.getMessageList(conversation.app_side_user_id, {});
      } else {
        getMessageListPromise = this.$schedsdk.getMessageList("", {}, conversation._id);
      }
      return getMessageListPromise;
    },

    async getUserInfo(user_id) {
      let userInfo = null;
      /* userInfo = await findSpecificDoc('skysalon.user_panel_info', {"_id": user_id});
      if (userInfo) {
        return userInfo;
      } */
      try {
        let result = await this.$schedsdk.msg_conversation_user_info(user_id);
        userInfo = result.data[0];
        // await insertDataToCollection(`skysalon.user_panel_info`, userInfo);
        return userInfo;
      } catch(error) {
        console.log("getting user panel info" , error)
        return null;
      }
    },

    async activateConversation(conversation) {
      if (this.activeConversation == conversation) {
        return false;
      }
      this.loading = true;
      this.activeConversation = conversation;
      this.message = '';
      this.error = null;
      this.selectedMsgFilters = [];
      this.messageChannel = conversation.last_channel;
      let that = this;
      //this.hideSidePanel = false;
    
      if (conversation.app_side_user_id) {
        that.customerDetails = await that.getUserInfo(conversation.app_side_user_id);
      }
      console.log("asdasd activateConversation " ,  that.customerDetails)
      
      that.getMessageList(conversation).then(result => {
        // that.customerDetails = result.customer_detail;
        that.conversationData = result.data;
        that.messagesByDate = this.mapConversationData(that.conversationData);
        that.loading = false;
      }).catch(console.error)
      .finally(() => {
        that.scrollMsgContainerToBottom();
        that.setFocusOnMessageInput();
        if (that.messagesIntervalID) {
          clearInterval(that.messagesIntervalID);
          that.messagesIntervalID = null;
        }
        that.messagesIntervalID = setInterval(function() {
          that.getMessageList(conversation).then(result => {
            that.conversationData = result.data;
            that.messagesByDate = that.mapConversationData(that.conversationData);
          }).catch(console.error)
          .finally(() => {
            // that.scrollMsgContainerToBottom();
          });
        }, 10000);
      });
    },
    sendMessage() {
      let message = this.message.trim();
      let that = this;
      that.error = null;
      that.processing = true;
      if (message && message.length > 0) {
        let payload = {
          receiver_id: this.activeConversation.app_side_user_id || null,
          channel: this.messageChannel,
          message,
          conversation_id:  this.activeConversation._id || null
        };
        this.$schedsdk.addMessage(payload).then(result => {
          if (result.status) {
            that.error = null;
            that.message = '';
            that.conversationData.push(that.mockMessage(message, this.messageChannel));
            that.messagesByDate = this.mapConversationData(that.conversationData);
          } else {
            that.error = result.message;
          }
        }).catch(error => {
          that.error = error;
        }).finally(() => {
            that.processing = false;
            that.scrollMsgContainerToBottom();
        });
      }
    },

    mapConversationData(data) {
      let timezone = this.$store.state.business_settings.business_time_zone;
      return groupBy(data.map(function (d) {
        d.msg_type = d.direction == 0 ? "send" : "receive";
        d.msg_date = AppHelper.getDateOrTimeFromTimestamp(d.created_at, timezone);
        d.msg_time = AppHelper.getDateOrTimeFromTimestamp(d.created_at, timezone, 'hh:mm a');
        return d;
      }), ({
        msg_date
      }) => msg_date);
    },
    mockMessage(message, channel) {
      let timezone = this.$store.state.business_settings.business_time_zone;
      return {
        "direction": 0,
        channel,
        "delivery_status": 0,
        message,
        "created_at": moment().tz(timezone).format()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ellipsis-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.mx-n-15 {
  margin-right: -12px;
  margin-left: -15px;
}

.inbox_people {
  //border-right: 1px solid #c4c4c4;
  max-width: 400px;
  height: calc(100vh - 40px);
  overflow-y: scroll !important;
  position: relative;

  .headind_srch {
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1;
  }
}

.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}

.top_spac {
  margin: 20px 0 0;
}

.headind_srch {
  padding: 9px 18px 9px 18px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;

  .search-bar {
    min-height: 42px;
    padding-top: 12px;
  }
}

.srch_bar {
  width: 100%;

  .input-group-addon {
    // margin: 0 0 0 -27px;
    position: absolute;
    left: 7px;
    top: 9px;
    margin: 0;

    button {
      background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
      border: medium none;
      padding: 0;
      color: var(--text-primary-color);
      font-size: 18px;
    }
  }
}

.msg_ib {
  float: left;
  padding: 0;
  width: 100%;

  h5 {
    font-size: 14px;
    margin-bottom: 2px;

    span {
      font-size: 13px;
      font-weight: 400;
    }
  }

  p {
    font-size: 14px;
    margin: auto;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.msg_img {
  width: 11%;

  img {
    width: 100%;
  }
}

.msg_people {
  clear: both;
}

.msg_list {
  border-bottom: 1px solid #D9D9D9;
  margin: 0;
  padding: 18px 16px 10px;
  cursor: pointer;
  &.active_chat {
    background-color: #e4ecf3;
  }
}
.dark-theme {
  .msg_list {
    &.active_chat {
      background-color:  #141414;
    }
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

.time_date {
  font-size: 12px;

  img {
    height: 20px;
  }
}

.mesgs {
  width: 100%;
  border-left: 1px solid #D9D9D9;
  border-right: 1px solid #D9D9D9;
  //max-width: 609px;
}

.outgoing_msg {
  overflow: hidden;
  margin: 8px 0 8px;
}

.msg_history_head {
  img {
    height: 40px;
    width: 40px;
  }
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

.input_msg_write {
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  padding: 10px 10px;
  margin-top:1rem;
  .write_msg {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    font-size: 14px;
    width: 100%;
    height: 28px;
    resize: none;
    border:0;
    &:focus-visible {
      border:0;
      outline: 0;
    }
  }

  .form-select {
    min-height: 38px;
  }
}

.msg_send_btn {
  cursor: pointer;
}

.msg_history {
  height: calc(100vh - 255px);
  overflow-y: auto;
  margin-top: 4rem;

  .msg_history_head_outer {
    z-index: 99;
    top: 0;
  }

  .form-select {
    min-height: 38px;
  }
}

.search-bar {
  padding-left: 34px;
}

.profile_info {
  //border-left: 1px solid #D9D9D9;
  max-width: 320px;
  width: 100%;
  overflow: auto;
  right: 0;
  // height:calc(100vh - 0px);
  transition: margin-left .15s, margin-right .15s, box-shadow 75ms, transform .15s, width .15s, z-index 0s ease .15s;

  .profile_img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  p {
    margin: 7px 0 0 0;
  }

  .profile_details {
    height: calc(100vh - 153px);
    p {
      margin: 5px 0 0 0;
    }
  }
}

.right_profile_top {
  width: calc(100% - 60px);

  p {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.form-select {
  font-size: 14px;
}

.modal {
  .profile_info {
    max-width: 100%;
    border-left: 0;
  }
}

.conversation-outer {
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column-reverse;
  -webkit-box-pack: end;
  justify-content: flex-end;
  transform: rotate(180deg);
  direction: rtl;
  min-height: 100%;
  // height: 110vh;
  min-width: 328px;

  // height: calc(100vh - 64px);
  // padding-top: 15px;
  // padding-bottom: 25px;
  // padding-bottom: 34rem;
  // min-height: 85%;
  .conversation-inner {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column-reverse;
    -webkit-box-pack: end;
    justify-content: flex-end;
    margin-top: 15px;

  }

  .incoming_msg,
  .outgoing_msg,
  .date-divider {
    transform: rotate(180deg);
    direction: ltr;

    p {
      font-weight: 400;
      display: inline-block;
    }
  }
}

.date-divider {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 14px;
    height: 1px;
    background-color: #D9D9D9;
    width: 100%;
  }

  span {
    padding: 3px 10px;
    // transform: rotate(180deg);
    display: inline-block;
    position: relative;
    z-index: 1;
  }
}


.select-msg {
  min-width: 200px;
}

.filter-status {
  display: inline-block;
  min-width: 200px;

  .vs__selected-options {
    flex-wrap: nowrap;

    .selected {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 60px;
    }
  }
}

.profile-close {
  position: absolute;
  right: 5px;
  top: 0px;
}

.sidebar-outer+.section-right {
  padding-left: 67px;
}

.back-to-list {
  position: relative;
  top: -3px;
}
.warning-textarea {
  top: -25px;
  position: relative;
}
@media (min-width: 768px) {
  .inbox_people {
    min-width: 320px;
  }
}

@media (max-width: 1200px) {
  .profile_info {
    max-width: 264px;
    position: absolute;
    height: 100%;
  }

  .received_withd_msg {
    p {
      max-width: calc(100% - 2rem);
    }
  }

  .sent_msg {
    max-width: calc(100% - 2rem);
  }

  .filter-status {
    .vs__selected-options {
      .selected {
        width: 72px;
      }
    }
  }

  .messaging {
    &.collapse-panel {
      .mesgs {
        max-width: 100%;
      }

      .profile_info {
        margin-right: -20rem;
      }

    }
  }

  .conversation-outer {
    height: auto;
  }

  .msg_history {
    margin-top: 3.9rem;
  }
}
@media (max-width: 991.98px) {
  .msg_history {
    margin-top: 5.1rem;
  }
}
@media (max-width: 991.68px) {
  .filter-status {
    .vs__selected-options {
      .selected {
        width: 66px;
      }
    }
  }

  .msg_history_head_outer {
    display: block;
  }

  .msg_history_head {
    h5 {
      font-size: 16px;
    }
  }

  .filter-status {
    min-width: 92%;
    font-size: 13px !important;
  }


}

@media (max-width: 767.98px) {
  .inbox_people {
    max-width: 100%;
  }
}

@media (max-width: 575.98px) {
  .sidebar-outer.sidebar-collapse+.section-right {
    padding-left: 0px;
  } 
  .conversation-outer {
    min-width: 264px;
  }

  .msg_history {
    .msg_history_head_outer {
      padding: 10px !important;

      .setting-profile {
        padding-left: 0 !important;
      }
    }
  }
  .card-custom{
    margin-top: calc(65px + env(safe-area-inset-top));
  }
}

.headind_srch {
  padding: 10px !important;
}
.list-style-none {
  list-style-type: none;
}

</style>