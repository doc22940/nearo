import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ProfileMenu from './ProfileMenu'
import Hidden from '@material-ui/core/Hidden'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '@material-ui/core/IconButton'
import LoginIcon from '@material-ui/icons/Fingerprint'
import InputAdornment from '@material-ui/core/InputAdornment'
import CloseIcon from '@material-ui/icons/Close'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'
import classnames from 'classnames'

import { styles } from './TopnavStyles'
import Locator from 'components/shared/locator/Locator'

@inject('navStore')
@inject('appStore')
@inject('usersStore')
@inject('routing')
@inject('postsStore')
@observer
class TopNav extends React.Component {
  @computed get address() {
    return this.props.navStore.navInfo.locInfo.address
  }

  handleChange = name => event => {
    const navInfo = this.props.navStore.navInfo
    navInfo.searchTerm = event.target.value
    this.props.navStore.setNavInfo(navInfo)
  }

  handleClearSearch = () => this.props.navStore.navInfo.searchTerm = ''

  goToLogin = () => this.props.routing.push(this.props.usersStore.isSignedIn()? '/profile' : '/login')

  handleNav = () => this.props.routing.push('/')

  render() {
    const { classes, usersStore, appStore, navStore, postsStore } = this.props

    return (
      <div>
        <AppBar elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="inherit" onClick={this.handleNav}>
              <span className={classes.logo}>Nearo</span>
            </Typography>
            <TextField
              className={classnames(classes.right, classes.left, classes.searchInput2)}
              placeholder="Search"
              type="text"
              value={ navStore.navInfo.searchTerm }
              onChange={this.handleChange('searchInput')}
              InputLabelProps={{
                shrink: true,
                className: classes.bootstrapFormLabel,
              }}
              InputProps={{
                disableUnderline: true,
                classes: {
                  input: classes.bootstrapInput,
                },
                endAdornment: (
                  navStore.navInfo.searchTerm.length > 0 && <InputAdornment position="end">
                    <IconButton
                      style={{backgroundColor: 'rgba(255,255,255,0)'}}
                      aria-label="Clear Search"
                      onClick={this.handleClearSearch}
                    >
                      { <CloseIcon style={{width: 22, height: 22}}/> }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Locator address={this.address} name="gobal-location" />
            <span className={ classes.flex } />
            {
              !appStore.loading && !usersStore.isSignedIn() &&
              <div>
                <Hidden smDown={true}>
                  <Button onClick={ this.goToLogin } variant="outlined" className={classes.loginBtn}
                    aria-label="Sign Up"
                  >
                    Login
                  </Button>
                  <Button onClick={ this.goToLogin } variant="outlined" className={classes.signupBtn}
                    aria-label="Sign Up"
                  >
                    Sign Up
                  </Button>
                </Hidden>
                <Hidden mdUp={true}>
                  <IconButton onClick={ this.goToLogin } className={classes.fingerPrint} aria-label="Login">
                    <LoginIcon />
                  </IconButton>
                </Hidden>
              </div>
            }
            {
              !appStore.loading &&
              usersStore.isSignedIn() && <ProfileMenu/>
            }
          </Toolbar>
          {
            (appStore.loading || postsStore.loading) &&
            navigator.onLine === true &&
            <LinearProgress />
          }
        </AppBar>
      </div>
    )
  }
}

TopNav.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TopNav)
