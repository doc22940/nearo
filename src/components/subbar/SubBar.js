import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { observer } from 'mobx-react'

const styles = theme => ({
  filters: {
    backgroundColor: '#f4f4f4',
  },
  button: {
    minHeight: 10,
    minWidth: 10,
    padding: 5,
    textTransform: 'capitalize',
    fontSize: 12,
    color: 'gray'
  },
  flex: {
    flex: 1
  },
  title: {
    color: 'gray'
  }
})

@observer
class SubBar extends Component {

  render() {
    const { classes } = this.props

    return (
      <Toolbar className={classes.filters}>
        <Typography className={classes.title} variant="body1" color="inherit">
          { this.props.postsStore.nbHits } results near  { "\"" + this.props.navStore.address + "\"" }
        </Typography>
        <span className={ classes.flex } />
        <Button onClick={  this.props.postsStore.openPostDialog } variant="flat" className={classes.button}>
          Add Post
        </Button>
      </Toolbar>
    )
  }
}

SubBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SubBar)
