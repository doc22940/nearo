import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { observer, inject } from 'mobx-react'

import GoBackPage from '../../components/gobackpage/GoBackPage'
import Profile from '../../components/profile/Profile'

@inject('usersStore')
@observer
class ProfilePage extends Component {
  render () {
    const { classes } = this.props
    return <GoBackPage children={ <Profile /> } />
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
}

const styles = theme => ({
  container: {
    height: '100vh',
  }
})

export default withStyles(styles)(ProfilePage)
