<template>
  <div class="wrapper" :class="[{'nav-open': $sidebar.showSidebar}, {'rtl': $route.meta.rtlActive}]">
    <notifications></notifications>
    <side-bar>
      <user-menu></user-menu>
      <mobile-menu></mobile-menu>
      <template slot-scope="props" slot="links">

        <sidebar-item :link="{name: 'Dashboard', icon: 'dashboard', path: '/dashboard'}">
        </sidebar-item>

        <sidebar-item :link="{name: 'Manage Trip', icon: 'departure_board'}">
          <sidebar-item :link="{name: 'Schedule Dispatch', path: '/fleet/scheduledispatch'}"></sidebar-item>
          <sidebar-item :link="{name: 'Active Trips', path: '/fleet/activetrips'}"></sidebar-item>
          <sidebar-item :link="{name: 'Trip History', path: '/fleet/triphistory'}"></sidebar-item>
          <sidebar-item :link="{name: 'Edit Trip', path: '/fleet/edittrip'}"></sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{name: 'Fleet', icon: 'local_shipping'}">
          <sidebar-item :link="{name: 'Add Trucks', path: '/fleet/addtrucks'}"></sidebar-item>
          <sidebar-item :link="{name: 'Preferred Routes', path: '/fleet/preferredroutes'}"></sidebar-item>
          <sidebar-item :link="{name: 'Load Material Dispatch', path: '/fleet/materialdispatch'}"></sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{name: 'Fleet Pool', icon: 'swap_vertical_circle', path: '/dashboard'}">
          <sidebar-item :link="{name: 'Raise a demand', path: '/fleet/raisedemand'}"></sidebar-item>
          <sidebar-item :link="{name: 'Offer Fleet', path: '/fleet/offerfleet'}"></sidebar-item>
        </sidebar-item>


                <sidebar-item :link="{name: 'Pages', icon: 'image'}">
                  <sidebar-item :link="{name: 'Pricing', path: '/pricing'}"></sidebar-item>
                  <sidebar-item :link="{name: 'RTL Support', path: '/pages/rtl'}"></sidebar-item>
                  <sidebar-item :link="{name: 'Timeline', path: '/pages/timeline'}"></sidebar-item>
                  <sidebar-item :link="{name: 'Login', path: '/login'}"></sidebar-item>
                  <sidebar-item :link="{name: 'Register', path: '/register'}"></sidebar-item>
                  <sidebar-item :link="{name: 'Lock Screen', path: '/lock'}"></sidebar-item>
                  <sidebar-item :link="{name: 'User Profile', path: '/pages/user'}"></sidebar-item>
                </sidebar-item>
                
        <sidebar-item :link="{name: 'Components', icon: 'apps'}">
          <sidebar-item :link="{name: 'Buttons', path: '/components/buttons'}"></sidebar-item>
          <sidebar-item :link="{name: 'Grid System', path: '/components/grid-system'}"></sidebar-item>
          <sidebar-item :link="{name: 'Panels', path: '/components/panels'}"></sidebar-item>
          <sidebar-item :link="{name: 'Sweet Alert', path: '/components/sweet-alert'}"></sidebar-item>
          <sidebar-item :link="{name: 'Notifications', path: '/components/notifications'}"></sidebar-item>
          <sidebar-item :link="{name: 'Icons', path: '/components/icons'}"></sidebar-item>
          <sidebar-item :link="{name: 'Typography', path: '/components/typography'}"></sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{name: 'Forms', icon: 'content_paste'}">
          <sidebar-item :link="{name: 'Regular Forms', path: '/forms/regular'}"></sidebar-item>
          <sidebar-item :link="{name: 'Extended Forms', path: '/forms/extended'}"></sidebar-item>
          <sidebar-item :link="{name: 'Validation Forms', path: '/forms/validation'}"></sidebar-item>
          <sidebar-item :link="{name: 'Wizard', path: '/forms/wizard'}"></sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{name: 'Tables', icon: 'grid_on'}">
          <sidebar-item :link="{name: 'Regular Tables', path: '/table-list/regular'}"></sidebar-item>
          <sidebar-item :link="{name: 'Extended Tables', path: '/table-list/extended'}"></sidebar-item>
          <sidebar-item :link="{name: 'Paginated Tables', path: '/table-list/paginated'}"></sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{name: 'Maps', icon: 'place'}">
          <sidebar-item :link="{name: 'Google Maps', path: '/maps/google'}"></sidebar-item>
          <sidebar-item :link="{name: 'Full Screen Maps', path: '/maps/full-screen'}"></sidebar-item>
          <sidebar-item :link="{name: 'Vector Maps', path: '/maps/vector-map'}"></sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{name: 'Widgets', icon: 'widgets', path: '/widgets'}"></sidebar-item>

        <sidebar-item :link="{name: 'Charts', icon: 'timeline', path: '/charts'}"></sidebar-item>

        <sidebar-item :link="{name: 'Calendar', icon: 'date_range', path: '/calendar'}"></sidebar-item>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <div :class="{content: !$route.meta.hideContent}" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar'
  import 'perfect-scrollbar/css/perfect-scrollbar.css'

  function hasElement (className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar (className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './Extra/MobileMenu.vue'
  import UserMenu from './Extra/UserMenu.vue'
  import {SlideYDownTransition, ZoomCenterTransition} from 'vue2-transitions'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
      UserMenu,
      SlideYDownTransition,
      ZoomCenterTransition
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    mounted () {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('sidebar-wrapper');
        initScrollbar('main-panel');

        docClasses.add('perfect-scrollbar-on')
      } else {
        docClasses.add('perfect-scrollbar-off')
      }
    }
  }

</script>
<style lang="scss">
  $scaleSize: .95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }
  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }
  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }
  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>
