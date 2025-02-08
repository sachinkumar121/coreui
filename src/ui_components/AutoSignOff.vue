<template>
    <IdleUserPopup :visible="isTimeout"/>
</template>

<script>
import IdleUserPopup from "@/ui_components/IdleUserPopup";
import IdleTimer from "@/helpers/idle-timer";

export default {
  name: 'AutoSignOff',
  props: {
    idle_user_logout_minutes: {
        type: Number,
        required: true,
        validator(value) {
            return value > 0;
        }
    }
  },
  components: {
    IdleUserPopup
  },
  data() {
    return ({
      isTimeout: false,
      setGraceTimer: null,
      idleTimer: null,
      popupTimeout: 5000
    });
  },
  mounted() {
    let that = this;
    let IdleTime = this.idle_user_logout_minutes;
    if (IdleTime) {
        this.idleTimer = new IdleTimer({
          timeout: IdleTime * 60, // expire after specific minutes
          onTimeout: () => {
            that.isTimeout = true;
            that.setGraceTimer = setTimeout(that.autoSignOff, that.popupTimeout);
          },
          onExpired: () => {
            that.isTimeout = true;
            that.setGraceTimer = setTimeout(that.autoSignOff, that.popupTimeout);
          }
        });
    }
  },
  unmounted() {
    this.idleTimer.cleanUp();
    clearTimeout(this.setGraceTimer);
  },
  methods: {
    autoSignOff() {
        this.isTimeout = false;
        this.$store.commit('USER_DATA', {});
        this.$store.commit('BUSINESS_DATA', {});
        this.$schedsdk.logout();
        this.$router.push("/login");
    }
  }
}
</script>