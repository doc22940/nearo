import React, { Component } from 'react'
import firebase from 'firebase/app'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import LinearProgress from '@material-ui/core/LinearProgress'
import Hidden from '@material-ui/core/Hidden'
import extract from 'find-hashtags'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import PostIcon from '@material-ui/icons/AddCircleOutline'
import { observer, inject } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

import { getCategories } from '../commons/categories'
import { db } from '../commons/firebase/firebase'
import UploaderButton from './UploaderButton'
import { styles } from './PostPanelStyles'
import { imageURL, ellip } from '../commons/utils'
import LocatorMobile from '../locator/LocatorMobile'

@inject('notificationsStore')
@inject('postsStore')
@inject('navStore')
@inject('usersStore')
@observer
class PostPanel extends Component {
  state = {
    body: '',
    loading: false,
    category: 'news',
    locInfo: null,
    media: [],
  }

  updateBody = e => this.setState({body: e.target.value})

  getCategoryInText = text => {
    const tags = extract(text)
    const categories = getCategories()

    let results = []

    for (var i = 0; i < categories.length; i++) {
      if (tags.join().toLowerCase().includes(categories[i].ref)) {
          results.push(categories[i].ref)
      }
    }

    return results.length > 0 ? results[results.length - 1] : 'news'
  }

  getPrice = (text) => {
    const prices = text.replace(',','').split(' ').filter(v => v.startsWith('$'))
    const cleanNumbers = prices.join(' ').replace(/\$/g, ' ').split(' ')
    const results = cleanNumbers.filter(price => !isNaN(price))
    return results.length > 0 ? Number(results[results.length - 1]) : 0
  }

  clearUI = () => {
    this.setState({body: ''})
    this.setState({loading: false})
    this.setState({expanded: false})
    this.setState({media: []})
  }

  async createPost (body, locInfo) {
    if (!this.props.usersStore.isSignedIn()) {
      this.props.notificationsStore.showMustLogin()
      return
    }
    this.setState({loading: true})

    const post = {
      category: this.getCategoryInText(this.state.body),
      author: this.props.usersStore.currentUser.name,
      userId: this.props.usersStore.currentUser.id,
      body: body,
      likes: 0,
      locText: locInfo.address,
      price: this.getPrice(this.state.body),
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      _geoloc: locInfo.latLng,
      deleted: false,
      media: this.state.media,
      avatar: this.props.usersStore.currentUser.picture
    }

    try {
      const docRef = await db.collection('posts').add(post)
      post.id = docRef.id
      this.props.postsStore.addNewPost(post)
      this.props.postsStore.hidePostDialog()
      this.clearUI()
    } catch(error) {
      console.error("Error adding document: ", error)
      this.clearUI()
    }
  }

  handleOnUploadStart = () => this.setState({loading: true})

  async handleLocationChange (address) {
    console.log('address', address)
    const results = await geocodeByAddress(address)
    const latLng = await getLatLng(results[0])
    const locInfo = {}
    locInfo.address = address
    locInfo.latLng = latLng
    this.setState({locInfo: locInfo})
  }

  handleCreate = () => {
    const locInfo = this.state.locInfo
      ? this.state.locInfo
      : this.props.navStore.navInfo.locInfo
    this.createPost(this.state.body, locInfo)
  }

  render() {
    const { classes, fullScreen, postsStore } = this.props
    this.updateBody = this.updateBody.bind(this)

    const showCounter = () => {
      if (254 - this.state.body.length < 20) {
        return true
      }
      return false
    }

    const addressLabel = () => {
      const locInfo = this.state.locInfo
        ? this.state.locInfo
        : this.props.navStore.navInfo.locInfo

      return <Typography variant="caption"
        style={{textTransform: 'capitalize', marginLeft: 5, marginBottom: 5}}>
         Nearby  "{ ellip(locInfo.address, 20) }"
      </Typography>
    }

    return (
      <React.Fragment>
        <Hidden smUp={true}>
          <IconButton onClick={ postsStore.openPostDialog }
            aria-label="Add New Publication">
            <PostIcon className={classes.addIcon}/>
          </IconButton>
        </Hidden>
        <Hidden xsDown={true}>
          <Button onClick={ postsStore.openPostDialog }
            variant="flat" className={classes.newPostBtn}
            size="small"
            aria-label="Add New Publication"
          >
            New Post
          </Button>
        </Hidden>
        <Dialog
          fullScreen={ fullScreen }
          open={ this.props.postsStore.isPostDialogOpen() }
          onClose={ this.props.postsStore.hidePostDialog }
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">New Post</DialogTitle>
          <Divider />
          <DialogContent className={ classes.details } >
            <TextField
              value={ this.state.body }
              onChange={ this.updateBody }
              multiline
              rows={4}
              fullWidth
              autoFocus
              InputProps={{
                inputProps: {
                  maxLength: 254,
                },
                disableUnderline: true,
                classes: {
                  root: classes.customTFRoot,
                  input: classes.customTFInput,
                },
              }}
              InputLabelProps={{
                shrink: false,
                className: classes.customTFLabel,
              }}
            />
            <div className={classes.counter} style={{
              position: 'absolute',
              top: 0,
              right: 0,
              marginTop: 67,
              marginRight: 5
            }}>
              { showCounter() &&
                <Typography variant="caption">
                  {this.state.body.length - 254}
                </Typography>
              }
            </div>
          </DialogContent>

          { this.state.media.length > 0 &&
            <div>
              <Hidden xsDown={true}>
                <div style={{ padding: 10, paddingBottom: 0 }}>
                  <img alt="Post media" style={{ width: 100 }} src={ imageURL({media: this.state.media}) }/>
                  <div/>
                  <Button onClick={ () => this.setState({media: []}) }
                    style={{width: 100, borderRadius: 0}}
                    className={classes.button} size="small">Remove</Button>
                </div>
              </Hidden>
              <Hidden smUp={true}>
                <div style={{ padding: 10 }}>
                  <Chip
                    avatar={<Avatar src={ imageURL({media: this.state.media}) } />}
                    label="Remove"
                    onDelete={ () => this.setState({media: []}) }
                    variant="outlined"
                  />
                </div>
              </Hidden>
            </div>
          }

          { addressLabel() }

          <Divider />

          { this.state.loading && <LinearProgress discolor="secondary" /> }

          <DialogActions style={{ padding: 12, paddingRight: 20 }}>
            <UploaderButton
              onUploadStart={this.handleOnUploadStart}
              onUploadSuccess={(filename) => {
                this.setState({loading: false})
                // This will later serve as a way to add multiple resources
                const media = [{
                  filename: filename
                }]
                this.setState({media: media})
              }}
              onError={() => {
                  this.props.notificationsStore.showNotification('Unable to upload image. Try again later')
                  this.setState({loading: false})
              }}
              />
            <LocatorMobile label="Select a location for your post" iconColor="#546E7A" onLocationChange={address => this.handleLocationChange(address)}/>
            <span className={ classes.flex }/>
            <Button onClick={ () => { this.clearUI(); this.props.postsStore.hidePostDialog() }}
              className={ classes.button } size="small">Cancel</Button>
            <Button className={ classes.button } disabled={!this.state.body || this.state.loading } onClick={ () => this.handleCreate() } variant="outlined" size="small" color="primary">
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

PostPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
}

export default withMobileDialog({breakpoint: 'xs'})(withStyles(styles)(PostPanel))
