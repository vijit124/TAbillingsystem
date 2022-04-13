import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import MaterialTable from 'material-table'
import axios from 'axios'
import $links from './variable'
const useStyles = (theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 60, marginRight: 5
    },
  },
  order: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 150,
  },
});
class UserDisplay extends Component {

  constructor() {
    super()
    this.state = {
      users: [],
      fullname: '',
      email: '',
      password: '',
      type: 'rawstore',
      open: false,
      errors: '',
    }
    this.handleClose = this.handleClose.bind(this)
    this.onChange = this.onChange.bind(this)
    const cookie = { cookies: localStorage.getItem('jwt') }
    axios.post($links.displayuser, cookie)
      .then(res => {
        if (res.data.auth) {
          window.location.replace('/')
        }
        else if (res.data.errors) {
          alert(res.data.message)
        } else {
          this.setState({ users: res.data.message })
        }
      })
  }
  handleClose = () => {
    this.setState({ open: false, texterror: "" })
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    const nowrap = { whiteSpace: 'nowrap' }
    const { classes } = this.props
    var { users = [] } = this.state
    return (
      <div className={classes.root}>
        <Dialog open={this.state.open} onClose={this.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  autoFocus
                  autoComplete="fullname"
                  value={this.state.fullname}
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  autoComplete="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">User Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.type}
                    name="type"
                    onChange={this.onChange}
                    label="User Type"
                  >
                    <MenuItem value='rawstore'>Raw Store</MenuItem>
                    <MenuItem value='production'>Production</MenuItem>
                    <MenuItem value='quality'>Quality Control</MenuItem>
                    <MenuItem value='stockmanager'>Stock Manager</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              const userData = {
                fullname: this.state.fullname,
                email: this.state.email,
                password: this.state.password,
                type: this.state.type,
                cookies: localStorage.getItem('jwt')
              }
              await axios.post($links.adduser, userData)
                .then(res => {
                  if (res.data.errors === false) {
                    alert(res.data.message)
                    window.location.reload()
                  } else {
                    alert(res.data.message)
                  }
                })
            }
            } color="primary">
              Add USer
          </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
          </Button>
          </DialogActions>
        </Dialog>
        <Grid container justify='flex-end'>
          <Button onClick={() => this.setState({ open: true })}
            variant="contained"
            color="primary" className={classes.order}
          >Add User</Button>
        </Grid>
        <MaterialTable
          title="Users"
          columns={[
            { title: 'ID', field: 'id', editable: "never", headerStyle: nowrap },
            { title: 'Full Name', field: 'fullname', headerStyle: nowrap },
            { title: 'email', field: 'email', headerStyle: nowrap },
            { title: 'Password', field: 'password', headerStyle: nowrap, cellStyle: { whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden' } },
            { title: 'User Type', field: 'type', headerStyle: nowrap, lookup: { 'rawstore': 'Raw Store', 'production': 'Production', 'quality': 'Quality Control', 'stockmanager': 'Stock Manager' }, },
            { title: 'Created', field: 'create_at', editable: 'never', searchable: false, headerStyle: nowrap },
            { title: 'Status', field: 'status', editable: 'onUpdate', lookup: { 1: 'Active', 0: 'Blocked' }, headerStyle: nowrap, searchable: false },
          ]}
          data={users.map(users => ({
            id: users.id, fullname: users.fullname, email: users.email, type: users.type,
            password: users.decryptpass, status: users.status, create_at: users.create_at,
          }))}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...users];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  this.setState({ users: [...dataUpdate] });
                  const userData = {
                    id: newData.id,
                    fullname: newData.fullname,
                    email: newData.email,
                    password: newData.password,
                    status: newData.status,
                    type: newData.type,
                    cookies: localStorage.getItem('jwt')
                  }
                  axios.post($links.edituser, userData)
                    .then(res => {
                      if (res.data.errors === false) {
                        alert(res.data.message)
                      } else {
                        this.setState({ errors: res.data.message })
                      }
                    })
                  resolve();
                }, 500)
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...users];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  this.setState({ users: [...dataDelete] });
                  const userData = {
                    id: oldData.id,
                    cookies: localStorage.getItem('jwt')
                  }
                  axios.post($links.deleteuser, userData)
                    .then(res => {
                      if (res.data.errors === false) {
                        alert(res.data.message)
                      } else {
                        this.setState({ errors: res.data.message })
                        alert(this.state.error)
                      }
                    })
                  resolve()
                }, 500)
              }),

          }}
          options={{
            sorting: true,
            actionsColumnIndex: -1,
            padding: 'dense',
            exportButton: true,
          }
          }
        />
      </div>
    );
  }
}
export default withStyles(useStyles)(UserDisplay)
