<template>
  <div class="Allocate">
  <h1>Allocate Drivers</h1>
    <input
      type="text"
      name="source"
      v-model = "source"
      placeholder="Select Source" />
      <input
        type="test"
        name="destination"
        v-model = "destination"
        placeholder="Select Destination" />
        <br>
        <button @click=Allocations()> Find Drivers </button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'Allocations',
  data () {
    return {
      source: '',
      destination: ''
    }
  },
  methods: {
    async Allocations () {
      const response = await AuthenticationService.Allocations({
        source: this.source,
        destination: this.destination
      })
      console.log(response.data)
    }
  }
}
</script>
