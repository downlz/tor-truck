<template>
  <div class="Network">
  <h1>Create new Network</h1>
    <input
      type="text"
      name="location"
      v-model = "location"
      placeholder="Enter Location Name" />
      <input
        type="text"
        name="Address"
        v-model = "address"
        placeholder="Node Address" />
        <input
          type="text"
          name="coords"
          v-model = "coords"
          placeholder="coords" />
        <br>
        <div class="error" v-html="error" />
        <br>
        <button @click=addNetwork()> Add Node </button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'newDrivers',
  data () {
    return {
      location: '',
      address: '',
      coords: '',
      error: null
    }
  },
  methods: {
    async addNetwork () {
      try {
        const response = await AuthenticationService.addNetwork({
          location: this.location,
          address: this.address,
          coords: this.coords
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
