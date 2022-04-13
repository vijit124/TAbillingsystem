import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Home, ExitToApp, RemoveCircleOutlineOutlined, People, LocalShipping, AddCircleOutlineOutlined, CropFree, Dashboard, LineWeight, Assessment } from '@material-ui/icons'
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import $links from '../variable'
const drawerWidth = 240;

const useStyles = ((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,

  },
  Typography: {
    marginTop: 8,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'white'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(0) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

class PersistentDrawerLeft extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      display: 'flex',
      userdashboard: '',
      hidden1: 'none',
      hidden2: 'none',
      hidden3: 'none',
    }
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleDrawerClose = this.handleDrawerClose.bind(this)
    var displaytype = {
      cookies: localStorage.getItem('jwt'),
    }
    axios.post($links.authlogin, displaytype)
      .then(res => {
        if (res.data.auth) {
          window.location.replace('/')
        }
        else if (res.data.errors === false) {
          var type = res.data.type
          switch (type) {
            case 'admin':
              this.setState({ hidden1: 'inline' })
              break;
            case 'rawstore':
              this.setState({ hidden2: 'inline' })
              break;
            case 'production':
              this.setState({ hidden3: 'inline' })
              break;
            default:
              console.log('error')

          }
          this.setState({ userdashboard: res.data.message })
        } else {
          this.setState({ errors: res.data.message })
        }
      })
  }
  handleDrawerOpen = () => {
    this.setState({ open: true, display: 'none' });
  };
  handleLogout = async () => {
    localStorage.clear()
    alert("Logged out")
    window.location.replace('/')

  }
  handleDrawerClose = () => {
    this.setState({ open: false, display: 'flex', });
  };
  render() {
    const { classes } = this.props
    const theme = this.props

    return (
      <div className={classes.root} id="printPageButton">
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar>
            <IconButton
              color="default"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" className={classes.title} component={NavLink} to={this.state.userdashboard} >
              <img src="http://51.158.109.251:3000/logo.svg" alt="logo" width="230"></img>
            </Typography>
            <Button color="default" onClick={this.handleLogout} size="large" ><b>Logout</b></Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List component="nav" aria-label="main mailbox folders">
              <ListItem button component={NavLink} to={this.state.userdashboard}>
                <ListItemIcon>
                  <Home />
                  <Typography style={{ display: this.state.display, marginLeft: -13 }} variant="caption" className={classes.Typography}>Dashboard</Typography>
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <div style={{ display: this.state.hidden1 }}>
              <ListItem button component={NavLink} to="/admin/goods">
                <ListItemIcon>
                  <Dashboard />
                  <Typography style={{ display: this.state.display, marginLeft: -3 }} variant="caption" className={classes.Typography}>Goods</Typography>
                </ListItemIcon>
                <ListItemText primary="Goods" />
              </ListItem>
              <ListItem button component={NavLink} to="/admin/orders">
                <ListItemIcon>
                  <LocalShipping />
                  <Typography style={{ display: this.state.display, marginLeft: -4 }} variant="caption" className={classes.Typography}>Orders</Typography>
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItem>
              <ListItem button component={NavLink} to="/admin/users">
                <ListItemIcon>
                  <People />
                  <Typography style={{ display: this.state.display, marginLeft: -3 }} variant="caption" className={classes.Typography}>Users</Typography>
                </ListItemIcon>
                <ListItemText primary="Display Users" />
              </ListItem>
            </div>
            <div style={{ display: this.state.hidden2 }}>
              <ListItem button component={NavLink} to="/rawstore/additem">
                <ListItemIcon>
                  <AddCircleOutlineOutlined />
                  <Typography style={{ display: this.state.display, marginLeft: -10 }} variant="caption" className={classes.Typography}>Add Item</Typography>
                </ListItemIcon>
                <ListItemText primary="Add Item to Inventory" />
              </ListItem>
              <ListItem button component={NavLink} to="/rawstore/outitem">
                <ListItemIcon>
                  <RemoveCircleOutlineOutlined />
                  <Typography style={{ display: this.state.display, marginLeft: -13 }} variant="caption" className={classes.Typography}>Out Items</Typography>
                </ListItemIcon>
                <ListItemText primary="Out Items" />
              </ListItem>
            </div>
            <div style={{ display: this.state.hidden3 }}>
              <ListItem button component={NavLink} to="/production/working">
                <ListItemIcon>
                  <Assessment />
                  <Typography style={{ display: this.state.display, marginLeft: -9 }} variant="caption" className={classes.Typography}>Working</Typography>
                </ListItemIcon>
                <ListItemText primary="Working Flow" />
              </ListItem>
              <ListItem button component={NavLink} to="/production/barcode">
                <ListItemIcon>
                  <LineWeight style={{ transform: 'rotate(270deg)' }} />
                  <Typography style={{ display: this.state.display, marginLeft: -10, lineHeight: 0.9 }} variant="caption" align="center" className={classes.Typography}>Generate<br />Barcode</Typography>
                </ListItemIcon>
                <ListItemText primary="Generate Barcode" />
              </ListItem>
            </div>
            <ListItem button component={NavLink} to="/barcode">
              <ListItemIcon>
                <CropFree />
                <Typography style={{ display: this.state.display, marginLeft: -7, lineHeight: 0.9 }} variant="caption" align="center" className={classes.Typography}>Scan<br />Barcode</Typography>
              </ListItemIcon>
              <ListItemText primary="Scan Barcode" />
            </ListItem>
            <ListItem button onClick={this.handleLogout} >
              <ListItemIcon>
                <ExitToApp />
                <Typography style={{ display: this.state.display, marginLeft: -7 }} variant="caption" className={classes.Typography}>Log Out</Typography>
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />

        </main>
      </div>
    );
  }
}
export default withStyles(useStyles)(PersistentDrawerLeft)