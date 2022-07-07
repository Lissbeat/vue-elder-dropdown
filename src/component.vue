<template lang="html">
  <div
    class="elder-dropdown"
    :class="{ 'elder-dropdown--inactive': !instance, 'elder-dropdown--hidden': isEmpty }"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <div class="elder-dropdown__trigger" ref="element" @click="onClick">
      <slot />
    </div>
    <component :is="dropdownWrapper" class="elder-dropdown__wrapper">
      <div
        v-show="visible"
        ref="target"
        class="elder-dropdown__content"
        @click="closeOnClick && toggle()"
      >
        <div class="elder-dropdown__content-box" ref="observer">
          <slot name="dropdown" :close="toggle" :visible="visible"></slot>
        </div>
      </div>
    </component>
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
    trigger: {
      type: String,
      default: 'click',
      enum: ['click', 'hover'],
    },
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    dropdownWrapper: {
      type: [Object, Function, String],
      default: 'div',
    },
  },
  data() {
    return {
      visible: false,
      instance: null,
      isEmpty: false,
      observer: null,
    }
  },
  methods: {
    toggle: function (state) {
      if (state) return this.init()
      if (state === false) return this.destroy()

      if (this.instance) return this.destroy()
      return this.init()
    },
    onClick() {
      if (this.trigger !== 'click') return
      this.toggle()
    },
    onMouseOver: function () {
      if (this.trigger !== 'hover') return
      this.toggle(true)
    },
    onMouseLeave: function () {
      if (this.trigger !== 'hover') return
      this.toggle(false)
    },
    clickAway: function (e) {
      if (!this.$el.contains(e.target)) this.toggle()
    },
    setIsEmpty() {
      this.isEmpty = !Boolean(this.$refs.observer.children.length)
    },
    init() {
      this.visible = true
      setTimeout(() => {
        if (!this.$refs.element || !this.$refs.target) return (this.visible = false)
        this.instance = createPopper(this.$refs.element, this.$refs.target, {
          placement: this.placement,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        })
      }, 0)
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
    this.observer.disconnect()
    this.destroy()
  },
  mounted() {
    this.observer = new MutationObserver(() => {
      this.setIsEmpty()
    })

    this.$nextTick(() => {
      this.setIsEmpty()
      this.observer.observe(this.$refs.observer, { childList: true })
    })
  },
}
</script>

<style lang="scss">
$variables: (
  'border-radius': 3px,
);

@function GetVariable($key) {
  @return var(--vue-elder-#{$key}, map-get($variables, $key));
}

.elder-dropdown {
  position: relative;

  display: flex;

  &--inactive .elder-dropdown__content {
    visibility: hidden;

    pointer-events: none;
  }

  &--hidden {
    display: none;
  }

  &__trigger {
    display: inherit;
    width: 100%;
  }

  &__content {
    font-size: 0.8em;

    position: absolute;
    padding-top: 8px;

    &-box {
      display: flex;
      overflow: hidden;
      flex-direction: column;

      border-radius: GetVariable('border-radius');
      background-color: white;
      box-shadow: 0 5px 30px -5px rgba(0, 0, 0, 0.2);

      & > * {
        text-align: left;

        border: none;
        border-radius: 0px;
      }
    }
  }
}
</style>
