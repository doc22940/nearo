import React from 'react'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import ExitIcon from '@material-ui/icons/ExitToApp'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { styles } from './TopnavStyles'

@inject('usersStore')
@withRouter
@observer
class ProfileMenu extends React.Component {
  state = {
    anchorEl: null,
  }

  handleClick = event => this.setState({ anchorEl: event.currentTarget })

  handleClose = () => this.setState({ anchorEl: null })

  render() {
    const { anchorEl } = this.state
    const { classes, usersStore } = this.props
    const user = usersStore.currentUser

    return (
      <div>
        <Button
          style={{ marginLeft: 5 }}
          size="small"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick} color="inherit" aria-label="Open Profile Menu">
          { user && <Avatar className={classes.avatar}
            style={{height: 35, width: 35}}
            alt={user.name}
            src={user.picture}  /> }
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={ () => this.props.history.push('/profile') } >
            <ListItemIcon className={classes.icon} >
              <ExitIcon />
            </ListItemIcon>
            Profile Settings
          </MenuItem>
          <MenuItem onClick={usersStore.doSignOut} >
            <ListItemIcon className={classes.icon} >
              <ExitIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

ProfileMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProfileMenu)
