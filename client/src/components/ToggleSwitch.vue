<template>
  <div class="toggle-switch">
    <input type="checkbox" v-model= "checked" @change="toggleSwitch" id="checkbox">
    <label for="checkbox" class="slider"></label>
    <label for="checkbox"><slot></slot>
    </label>
  </div>

<!--  <div class="dropdown" :class="{open:isOpen}" @click="toggleSwitch">
      <slot name="title">
        <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">
          <i :class="icon"></i>
          <p class="notification">{{title}}
            <b class="caret"></b>
          </p>
        </a>
      </slot>
    <slot></slot>
  </div> -->
  
</template>
<script>
export default{
  props: {
    defaultChecked: {
      type : Boolean, default: false
    },
  data () {
    return {
      checked: this.defaultChecked
      }
    },
  methods: {
    toggleSwitch () {
      this.$emit('input', this.checked)
      }
    }
  }
</script>
