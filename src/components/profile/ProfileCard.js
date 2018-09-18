import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import classNames from 'classnames'
import Avatar from '@material-ui/core/Avatar'
import PhoneIcon from '@material-ui/icons/ContactPhone'

function ProfileCard(props) {
  const { classes, user } = props
  const avatar = user.picture
    ? user.picture
    : "/images/default-avatar.png"

  return (
    <Card elevation={0}>
      <CardContent>
        <div className={classes.row}>
          <Avatar
            alt={ user.name }
            src={ avatar }
            className={classes.avatar}
          />
        </div>
        <div className={classes.content}>
          <Typography variant="title" gutterBottom>
            { user.name }
          </Typography>
          <Typography variant="body1" gutterBottom>
            { user.bio }
          </Typography>
          {
            !user.keepPhonePrivate &&
            <div className={classes.phone}>
              <PhoneIcon className={ classes.phoneIcon }/>
              <Typography variant="body2" gutterBottom>
                { user.phone }
              </Typography>
            </div>
          }
          <Typography variant="caption">
            { user.username }
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

ProfileCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

const styles = theme => ({
  content: {
    paddingTop: 10
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
    border: '2px solid ' + theme.palette.secondary.main,
    width: 80,
    height: 80,
  },
  phoneIcon: {
    fontSize: 18,
    marginTop: 3,
    marginRight: 5,
    color: theme.palette.secondary.main
  },
  phone:{
    display: 'flex',
    marginTop: 4
  }
})

export default withStyles(styles)(ProfileCard)