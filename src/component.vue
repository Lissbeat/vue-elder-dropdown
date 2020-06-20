<template lang="html">
  <div class="elder-dropdown" :class="{ 'elder-dropdown--inactive': !instance }">
    <div class="elder-dropdown__trigger" ref="element" @click="toggle">
      <slot />
    </div>
    <div
      v-if="visible"
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
    toggle: function () {
      if (this.instance) return this.destroy()
      return this.init()
    },
    clickAway: function (e) {
      if (!this.$el.contains(e.target)) this.toggle()
    },
    init() {
      this.visible = true
      this.$nextTick(() => {
        if (!this.$refs.element || !this.$refs.target) return (this.visible = false)
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
      })
    },
    destroy() {
      if (!this.instance) return
      this.instance.destroy()
      this.instance = null
      this.visible = false
    },
  },
  watch: {
    visible: function (val) {
      if (val) window.addEventListener('click', this.clickAway)
      else window.removeEventListener('click', this.clickAway)
    },
  },
  beforeDestroy() {
    this.destroy()
  },
}
</script>

<style lang="scss">
@import './main.scss';

:root {
  @include GenerateVariables();
}

.elder-dropdown {
  position: relative;
  display: flex;

  &--inactive .elder-dropdown__content {
    pointer-events: none;
    visibility: hidden;
  }

  &__trigger {
    display: inherit;
  }

  &__content {
    position: absolute;
    box-shadow: 0 5px 30px -5px rgba(0, 0, 0, 0.2);
    border-radius: GetVariable('border-radius');
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
