<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <time-line plain :type="simpleTimeline">
        <time-line-item inverted badge-type="danger" badge-icon="card_travel">
          <badge slot="header" type="danger">Another Title</badge>
          <p slot="content">
            Wifey made the best Father's Day meal ever. So thankful so happy so blessed. Thank you for making my family
            We just had fun with the “future” theme !!! It was a fun night all together ... The always rude Kanye Show
            at 2am Sold Out Famous viewing @ Figueroa and 12th in downtown.</p>

          <h6 slot="footer">
            <i class="ti-time"></i>
            11 hours ago via Twitter
          </h6>
        </time-line-item>
      </time-line>
    </div>
  </div>
</template>
<script>
  import {TimeLine, TimeLineItem, Badge} from '@/components'
  export default {
    components: {
      TimeLine,
      TimeLineItem,
      Badge
    },
    data () {
      return {
        responsive: false
      }
    },
    computed: {
      simpleTimeline () {
        if (this.responsive) {
          return 'simple'
        }
      }
    },
    methods: {
      onResponsiveInverted () {
        if (window.innerWidth < 768){
          this.responsive = true
        } else {
          this.responsive = false
        }
      }
    },
    mounted() {
      this.onResponsiveInverted();
      window.addEventListener('resize', this.onResponsiveInverted)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResponsiveInverted)
    }
  }
</script>
<style>
</style>
