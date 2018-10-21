import Api from '@/services/Api'

export default{
  register (credentials) {
    return Api().post('register', credentials)
  },
  Allocations (credentials) {
    return Api().get('Trip/idhere/status/123345', credentials)
  },
  Drivers (credentials) {
    return Api().post('Drivers', credentials)
  }
}
// AuthenticationService.register({
//   email: ' test@abc.com',
//   password: '123456'
// })
