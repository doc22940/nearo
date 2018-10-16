import React, { Component, Fragment } from 'react'
import  Fade from '@material-ui/core/Fade'
import { withStyles } from '@material-ui/core/styles'
import { observer, inject } from 'mobx-react'

import BottomNav from '../../components/mobbottomnav/BottomNav'
import TopNav from '../../components/mobtopnav/TopNav'
import Favorites from './favorites.page'
import HomePage from './home.page'
import PostPage from './post.page'
import LocationPage from './location.page'
import ProfilePage from './profile.page'
import LoginPage from './login.page'

@inject('appStore')
@observer
class MobileScreen extends Component {

  render () {
    const { classes, appStore } = this.props
    const hideNav = () => {
      return appStore.currentView() === '/profile' ||
        appStore.currentView() === '/login' ? true : false
    }

    return <Fragment>
      { ! hideNav() &&
        <Fragment>
          <TopNav />
          <div className={ classes.toolbar } />
        </Fragment>
      }

      {
        appStore.isReady() &&
        <Fade in={true} timeout={300}>
            <div>
            { appStore.currentView() === '/' && <HomePage /> }
            { appStore.currentView() === '/posts' && <PostPage /> }
            { appStore.currentView() === '/favorites' && <Favorites /> }
            { appStore.currentView() === '/location' && <LocationPage /> }
            { appStore.currentView() === '/profile' && <ProfilePage /> }
            { appStore.currentView() === '/login' && <LoginPage /> }
          </div>
        </Fade>
      }

      {
        ! hideNav() &&
        <Fragment>
          <div className={ classes.toolbar } />
          <BottomNav />
        </Fragment>
      }
    </Fragment>
  }
}

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
})

export default withStyles(styles)(MobileScreen)