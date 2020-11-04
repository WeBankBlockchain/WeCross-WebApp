const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  transactionID: state => state.transaction.transactionID,
  XAPaths: state => state.transaction.paths
}
export default getters
