<template lang="html">
  <div class="elder-dropdown">
    <div class="elder-dropdown__trigger" ref="element" @click="toggle">
      <slot />
    </div>
    <div
      v-show="visible"
      ref="target"
      class="elder-dropdown__content"
      @click="closeOnClick && toggle()"
    >
      <slot name="dropdown" :close="toggle"></slot>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
  props: {
    placement: {
      type: String,
      default: 'bottom-end',
    },
    closeOnClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
      instance: null,
    }
  },
  methods: {
    toggle: function() {
      this.visible = !this.visible
      this.instance.update()
    },
    clickAway: function(e) {
      if (!this.$el.contains(e.target)) this.toggle()
    },
  },
  watch: {
    visible: function(val) {
      if (val) window.addEventListener('click', this.clickAway)
      else window.removeEventListener('click', this.clickAway)
    },
  },
  mounted: function() {
    this.instance = createPopper(this.$refs.element, this.$refs.target, {
      placement: this.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    })
  },
  beforeDestroy: function() {
    if (this.instance) this.instance.destroy()
  },
}
</script>

<style lang="scss">
.elder-dropdown {
  @import './variables.scss';

  position: relative;
  display: flex;

  &__trigger {
    display: inherit;
  }

  &__content {
    box-shadow: 0 5px 30px -5px rgba(0, 0, 0, 0.2);
    border-radius: $border-radius;
    overflow: hidden;
    font-size: 0.8em;

    display: flex;
    flex-direction: column;
    background-color: white;

    & > * {
      border-radius: 0;
      border: none;
      text-align: left;
    }
  }
}
</style>
