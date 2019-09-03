<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
    <md-card>
      <md-card-header class="md-card-header-icon md-card-header-green">
        <div class="card-icon">
          <md-icon>mail_outline</md-icon>
        </div>
        <h4 class="title">Place a request</h4>
      </md-card-header>

      <md-card-content>
        <md-field v-if="isSubmitted">
          <label v-if="isSubmitted">Source</label>
          <md-input v-model="newUser.name" type="text" v-if="isSubmitted"></md-input>
        </md-field>
        <label v-if="progress">Processing Your Request</label>
        <md-progress-spinner v-if="progress" class="md-accent" md-mode="indeterminate"></md-progress-spinner>
        <md-field v-if="isSubmitted">
          <label v-if="isSubmitted">Destination</label>
          <md-input v-model="newUser.email" type="email" v-if="isSubmitted"></md-input>
        </md-field>
        </md-card-content>
        <md-card-actions md-alignment="left">
          <md-button class="md-success" v-on:click="allocRequest">{{submitButton}}</md-button>
        </md-card-actions>
      </md-card>
      </div>
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
      <time-line plain type="simple" >
        <time-line-item inverted badge-type="danger" v-for="drivers in allocJSON" badge-icon="card_travel">
          <span slot="header" class="badge badge-danger">{{drivers.driverAssigned}}</span>
          <p slot="content">
            Trip Start Time: {{drivers.startTime}} <br>
            Trip End Time: {{drivers.endTime}} <br>
            Starting from {{drivers.routeStart}} to {{drivers.routeEnd}}
          </p>

          <!-- <h6 slot="footer">
            <i class="ti-time"></i>
            11 hours ago via Twitter
          </h6> -->
        </time-line-item>
      </time-line>
    </div>

  </div>
</template>
<script>
  import {TimeLine, TimeLineItem, Badge} from '@/components'
  import AuthenticationService from '@/services/AuthenticationService'
  import axios from 'axios'
  export default {
    components: {
      TimeLine,
      TimeLineItem,
      Badge
    },
    data () {
      return {
        newUser :{},
        isSubmitted : true,
        responsive: false,
        gotDrivers:false,
        submitButton: "Submit",
        message: "Hello World!",
        allocJSON: [],
        name: 'ProgressSpinnerIndeterminate',
        progress : false,
        users: [
              {name: 'Bob'},
              {name: 'Kathy'}
        ],
        cusers :[]
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
      },
      fetchAPIResponse () {
      console.log("test")
    },
    greet (){
      this.progress = true
      console.log("Hello")
    },
    addUser : function(e){
      this.cusers.push({
        name:this.newUser.name,
        email:this.newUser.email,
        contacted:false
      })
      e.preventDefault()
    },
    fetchAPIRequest (val) {
    axios.get('http://localhost:8082/Trip/idhere/status/'+val)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      },
      allocRequest (){
        this.progress = true
        this.isSubmitted = false
        this.submitButton = "Please Wait"
        axios.get('http://localhost:8082/Allocations/Kolkata/destination/Srikakulam/tripdate/1538661556')
        .then((response) => {
          this.progress = false
          this.isSubmitted = true
          this.submitButton = "Submit"
          this.gotDrivers = true
          this.allocJSON = response.data.assignedRouteDrivers
          console.log(response.data.assignedRouteDrivers)
        })
        e.preventDefault()
      },
      deleteUser (user){
      this.cusers.splice(this.cusers.indexOf(user),1)
      }
    },
    // created (){
    //   axios.get('https://jsonplaceholder.typicode.com/users')
    //     .then((response) => {
    //     this.cusers = response.data
    //       console.log(response.data)
    //     })
    // },
    beforeMount(){
      this.fetchAPIResponse(),
      this.fetchAPIRequest('2290')
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
<style lang="scss" scoped>
.md-card .md-card-actions{
  border: none;
}

.md-inline-checkboxes{
  display: inline-flex;

  .md-checkbox{
    margin-top: 15px !important;
  }
}

.md-checkbox,
.md-radio{
  margin-top: 15px;
  margin-bottom: .5rem;
}

.md-checkbox,
.md-radio{
  display: flex;
}

.md-radio /deep/ .md-radio-container{
    margin-left: 5px;
    position: relative;
    left: -3px;
}

.md-form-label + .md-layout-item .md-checkbox:not(:first-child),
.md-form-label + .md-layout-item + .md-layout-item .md-radio:not(:first-child),
.md-form-label + .md-layout-item .md-radio{
  margin-top: 0;
}

.form-control-static{
  margin-top: 6px;
}

.md-progress-spinner {
  margin: 24px;
  text-align: center;
}

</style>
