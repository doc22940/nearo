import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import { observer, inject } from 'mobx-react'
import Helmet from 'react-helmet-async'

import PostActions from '../postcard/PostActions'
import MapCard from '../map/MapCard'
import ProfileCard from '../profile/ProfileCard'
import About from '../About'
import { db } from '../commons/firebase/firebase'
import { currentPath, capitalize } from '../commons/utils'
import { placeHolder } from './PlaceHolder'
import { postContent } from './PostContent'
import { styles } from './PostViewStyles'

@inject('usersStore')
@inject('postsStore')
@inject('bookmarksStore')
@inject('notificationsStore')
@observer
class SinglePostContainer extends Component {
  state = {
    post: {},
    user: {}
  }

  componentDidMount () {
    const postRef = db.collection('posts').doc(currentPath(2))
    postRef.get()
    .then(result => {
      if (result.exists && !result.data().deleted) {
        const post = result.data()
        post.id = result.id
        this.setState({post: post})
        this.loadUser(post.userId)
      } else {
        // throw 404
      }
    }).catch(error => {
      console.error('Unable to fetch post information', error)
    })
  }

  loadUser = userId => {
    const userRef = db.collection('users').doc(userId)
    userRef.get()
    .then(user => {
      if (user.exists) {
        this.setState({user: user.data()})
      }
    }).catch(error => {
      console.error('Unable to fetch user information', error)
    })
  }

  handleSold = (post) => this.setState({post: post})

  render() {
    const { classes } = this.props
    const { post, user } = this.state

    const leftColumn = (post) => {
      return <div>
        { post.id ? postContent(post, classes) : placeHolder() }
        {
          post.id &&
          <PostActions post={ this.state.post }
            className={classes.top20}
            url={ "https://nearo.co/posts/" + post.id }
          />
        }
      </div>
    }

    const rightColumn = (post) => <div>
      <ProfileCard user={ user }/>
      <Hidden xsDown={true}>
        <br />
      </Hidden>
      {
        post._geoloc &&
        <div>
          <MapCard center={ post._geoloc }/>
          <Hidden xsDown={true}>
            <br />
          </Hidden>
        </div>
      }
      {/*<Hidden smDown={true}>
        <Ads className={classes.bottom20}/>
        <br />
      </Hidden>*/}
      <About/>
      <Hidden xsDown={true}>
        <br />
      </Hidden>
    </div>

    return (
      <div>
        {
          <Helmet>
            <title>Nearo - { capitalize(post.category) }</title>
          </Helmet>
        }
        <Hidden xsDown={true}>
          <div className={classes.top20} />
        </Hidden>
        <Grid
          container
          direction="row"
          justify="center"
          spacing={16}
          >
            <Grid item sm={10} md={5} xs={12}>
              <Hidden smUp={true}>
                <Grid item style={{backgroundColor: '#fff', padding: 15}}>
                  { leftColumn(post)}
                </Grid>
              </Hidden>
              <Hidden xsDown={true}>
                <Grid item style={{backgroundColor: '#fff', padding: 10}}>
                  { leftColumn(post)}
                </Grid>
              </Hidden>
              <Hidden smUp={true}>
                <Divider />
                { rightColumn(post) }
              </Hidden>
            </Grid>
            <Hidden xsDown={true}>
              <Grid item sm={10} md={3} xs={12}>
                { rightColumn(post) }
              </Grid>
            </Hidden>
        </Grid>
      </div>
    )
  }
}

SinglePostContainer.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SinglePostContainer)
