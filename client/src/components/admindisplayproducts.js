import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField, Container, } from '@material-ui/core';
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
    width: 150,
  },
});
class DisplayProduct extends Component {

  constructor() {
    super()
    this.state = {
      products: [],
      productname: '',
      modelno: '',
      open: false,
      errors: '',
    }
    this.handleClose = this.handleClose.bind(this)
    this.onChange = this.onChange.bind(this)
    const cookie = { cookies: localStorage.getItem('jwt') }
    axios.post($links.displayproducts, cookie)
      .then(res => {
        if (res.data.auth) {
          window.location.replace('/')
        }else if(res.data.errors){
          alert(res.data.message)
        }
        else {
          this.setState({ products: res.data.message })
        }
      })
      .catch(error => {
        console.log(error.message)
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
    var { products = [] } = this.state
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="productname"
                  label="Product Name"
                  name="productname"
                  autoFocus
                  autoComplete="productname"
                  value={this.state.productname}
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="modelno"
                  label="Model Number"
                  name="modelno"
                  autoComplete="modelno"
                  value={this.state.modelno}
                  onChange={this.onChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              const userData = {
                productname: this.state.productname,
                modelno: this.state.modelno,
                cookies: localStorage.getItem('jwt')
              }
              await axios.post($links.addproduct, userData)
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
              Add product
          </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
          </Button>
          </DialogActions>
        </Dialog>
        <Container>
        <Grid container justify='flex-end'>
          <Button onClick={() => this.setState({ open: true })}
            variant="contained"
            color="primary" className={classes.order}
          >Add Product</Button>
        </Grid>
        <MaterialTable
          title="Products"
          columns={[
            { title: 'ID', field: 'id', editable: "never", headerStyle: nowrap },
            { title: 'Product Name', field: 'productname', headerStyle: nowrap },
            { title: 'Model Number', field: 'modelno', headerStyle: nowrap },
            { title: 'Created', field: 'create_at', editable: 'never', searchable: false, headerStyle: nowrap },
            { title: 'Total Raw Elements', field: 'rawids', editable: 'never', headerStyle: nowrap, searchable: false },
          ]}
          data={products.map(products => ({
            id: products.id, productname: products.productname, modelno: products.modelno, rawids: products.rawids.length,
            create_at: products.create_at,
          }))}
          actions={[
            {
              icon: 'visibility',
              tooltip: 'View Product Details',
              onClick: (event, rowData) => {
                localStorage.setItem('product_id', rowData.id)
                this.props.history.push('/admin/productdetails')
              }
            }
          ]}
          editable={{
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...products];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  this.setState({ products: [...dataDelete] });
                  const userData = {
                    id: oldData.id,
                    cookies: localStorage.getItem('jwt')
                  }
                  axios.post($links.deleteproduct, userData)
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
            pageSize: 10
          }
          }
        />
</Container>
      </div>

    );
  }
}

export default withStyles(useStyles)(DisplayProduct)
