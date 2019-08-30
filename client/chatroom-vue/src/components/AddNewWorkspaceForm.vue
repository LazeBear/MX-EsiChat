<template>
  <b-steps v-model="activeStep" class="form" :has-navigation="false" type="is-success">
    <b-step-item label="Info" icon="format-color-text">
      <div class="columns step-container">
        <div
          class="column is-three-quarters-mobile is-three-quarters-tablet is-three-quarters-desktop"
        >
          <b-field label="Name">
            <b-input v-model="name" required></b-input>
          </b-field>
          <b-field label="Description">
            <b-input maxlength="150" type="textarea" v-model="description" required></b-input>
          </b-field>
          <b-button
            type="is-primary"
            @click="activeStep=1"
            class="step-container__btn"
            :disabled="!name || !description"
          >Next</b-button>
        </div>
      </div>
    </b-step-item>
    <b-step-item label="Icon" icon="account">
      <div class="columns step-container">
        <div
          class="column is-three-quarters-mobile is-three-quarters-tablet is-three-quarters-desktop"
        >
          <b-field label="Icon">
            <Avatar :name="name" :color="color.hex"></Avatar>
          </b-field>
          <b-field label="Pick a color">
            <Slider v-model="color"></Slider>
          </b-field>
          <b-button
            type="is-primary"
            @click="submit"
            class="step-container__btn"
            :loading="waitingResponse"
          >Submit</b-button>
        </div>
      </div>
    </b-step-item>
    <b-step-item label="Submit" icon="check-outline">
      <div class="has-text-centered">
        <div class="response-message">{{response.msg}}</div>
        <b-button type="is-primary" v-if="response.success" @click="joinNow">Join now!</b-button>
        <b-button type="is-primary" v-else @click="activeStep=0">Change info</b-button>
      </div>
    </b-step-item>
  </b-steps>
</template>

<script>
import Avatar from "./Avatar";
import mixin from "../utils/mixin";
import { Slider } from "vue-color";
export default {
  data() {
    return {
      activeStep: 0,
      name: "",
      description: "",
      color: {
        hsl: { h: 251.37931034482762, s: 0.5, l: 0.5, a: 1 },
        hex: "#5840BF",
        hex8: "#5840BFFF",
        rgba: { r: 88, g: 64, b: 191, a: 1 },
        hsv: { h: 251.37931034482762, s: 0.6666666666666666, v: 0.75, a: 1 },
        oldHue: 251.37931034482762,
        source: "hsl",
        a: 1
      },
      waitingResponse: false,
      response: { msg: "", success: false }
    };
  },
  watch: {
    createNSResponse(res) {
      if (res) {
        this.response = res;
        this.activeStep = 2;
        this.waitingResponse = false;
      }
    }
  },
  methods: {
    submit() {
      this.waitingResponse = true;
      this.createNewWorkspace({
        name: this.name,
        description: this.description,
        color: this.color.hex
      });
    },
    joinNow() {
      this.$parent.close();
      this.joinWorkspace(this.response.ns);
    }
  },
  mixins: [mixin],
  components: {
    Avatar,
    Slider
  }
};
</script>

<style lang="scss" scoped>
.form {
  background: white;
  padding: 20px 5px;
  border-radius: 5px;
}

.control {
  width: 100%;
}
.response-message {
  margin: 30px 0;
}
.step-container {
  display: flex;
  justify-content: center;
  align-items: center;
  &__btn {
    margin: 0 auto;
    display: flex;
  }

  .avatar {
    display: block;
    margin: 0 auto;
  }

  .vc-slider {
    margin: 30px auto;

    @media screen and (max-width: 575px) {
      width: 320px;
    }

    @media screen and (max-width: 450px) {
      width: 250px;
    }

    @media screen and (max-width: 374px) {
      width: 220px;
    }
  }
}
</style>