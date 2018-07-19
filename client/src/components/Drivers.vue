<template>
  <div class="Drivers">
  <h1>Add New Drivers</h1>
    <input
      type="text"
      name="drivername"
      v-model = "drivername"
      placeholder="Enter Driver Name" />
      <input
        type="text"
        name="phone"
        v-model = "Phone"
        placeholder="Mobile No" />
        <input
          type="text"
          name="address"
          v-model = "address"
          placeholder="Address" />
          <input
            type="text"
            name="baselocation"
            v-model = "baselocation"
            placeholder="Select Baselocation" />
            <input
              type="text"
              name="lastservedlocation"
              v-model = "lastservedlocation"
              placeholder="last Served Location" />
              <input
                type="text"
                name="zones"
                v-model = "zones"
                placeholder="Select Zones" />
                <input
                  type="text"
                  name="preferrednodes"
                  v-model = "preferrednodes"
                  placeholder="Preferred Nodes" />
                <input
                  type="text"
                  name="workTimes"
                  v-model = "workTimes"
                  placeholder="Working Times" />
        <br>
        <div class="error" v-html="error" />
        <br>
        <button @click=addDrivers()> Add Drivers </button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'newDrivers',
  data () {
    return {
      drivername: '',
      phone: '',
      address: '',
      baselocation: '',
      lastservedlocation: '',
      zones: '',
      preferrednodes: '',
      workTimes: '',
      error: null
    }
  },
  methods: {
    async newDrivers () {
      try {
        const response = await AuthenticationService.newDrivers({
          drivername: this.drivername,
          phone: this.phone,
          address: this.address,
          baselocation: this.baselocation,
          lastservedlocation: this.lastservedlocation,
          zones: this.zones,
          preferrednodes: this.preferrednodes,
          workTimes: this.workTimes
        })
        console.log(response.data)
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
