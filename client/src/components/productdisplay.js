import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, CssBaseline, Button, TextField, Divider, DialogActions, DialogContent, DialogTitle, Dialog } from '@material-ui/core';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import $links from './variable'
import MaterialTable from 'material-table';
import { Autocomplete } from '@material-ui/lab';
const useStyles = (theme) => ({
    products: {
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(0, 0, 0, 4),
        }
    },
    Divider: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'inline',
            margin: theme.spacing(2, 2, 5, 2),
        }
    },
    HorizontalDivider: {
        display: '',
        margin: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        }
    },
});

class AddMaterials extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            productname: '',
            create_at: '',
            rawids: [],
            rawmaterials: [],
            allrawmaterials: [],
            qtyper: '',
            qtyinstock: '',
            rawid: '',
            open: false,
            errors: '',
            opendialog: false,
            editid: '',
            editname: '',
            editqty: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmitProduct = this.onSubmitProduct.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.onSubmitMaterial = this.onSubmitMaterial.bind(this)
        var displaytype = {
            id: localStorage.getItem('product_id'),
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.displayproduct, displaytype)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                } else if (res.data.errors) {
                    this.setState({ errors: res.data.message, open: true })
                } else {
                    this.setState({
                        id: localStorage.getItem('product_id'),
                        productname: res.data.message.productname,
                        create_at: res.data.message.create_at,
                        rawids: res.data.message.rawids,
                        rawmaterials: res.data.rawmaterials,
                        allrawmaterials: res.data.allrawmaterials
                    })
                }
            })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmitProduct = async (e) => {
        e.preventDefault()
        const product = {
            id: this.state.id,
            productname: this.state.productname,
            cookies: localStorage.getItem('jwt')
        }
        await axios.post($links.updateproduct, product)
            .then(res => {
                if (res.data.errors === false) {
                    alert(res.data.message)
                    window.location.reload()
                } else {
                    this.setState({ errors: res.data.message, open: true })
                }
            })
    }
    handleClose = () => {
        this.setState({ opendialog: false })
    };
    onSubmitMaterial = async (e) => {
        e.preventDefault()
        var rawids = {
            id: this.state.rawid,
            qty: this.state.qtyper,
        }
        const product = {
            id: this.state.id,
            rawids: rawids,
            cookies: localStorage.getItem('jwt')
        }

        await axios.post($links.addmaterialtoproduct, product)
            .then(res => {
                if (res.data.errors === false) {
                    alert(res.data.message)
                    window.location.reload()
                } else {
                    this.setState({ errors: res.data.message, open: true })
                }
            })
    }
    render() {
        const { classes } = this.props
        const nowrap = { whiteSpace: 'nowrap' }
        var { rawmaterials = [] } = this.state
        var { allrawmaterials = [] } = this.state
        return (
            <Container>
                <Dialog open={this.state.opendialog} fullWidth maxWidth="sm" onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit {'"' + this.state.editid + '"'} Quantity</DialogTitle>
                    <DialogContent style={{ height: 80 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Material Name"
                                    variant="outlined"
                                    disabled
                                    fullWidth
                                    value={this.state.editname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Quantity per Unit"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        type: "Number"
                                    }}
                                    name="qtyper"
                                    onChange={this.onChange}
                                    value={this.state.editqty}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async () => {
                            const rawmaterial = {
                                product_id: this.state.id,
                                id: this.state.editid,
                                qty: this.state.editqty
                            }
                            await axios.post($links.editmaterialqty, rawmaterial)
                                .then(res => {
                                    if (res.data.errors === false) {
                                        alert(res.data.message)
                                        window.location.reload()
                                    } else {
                                        this.setState({ errors: res.data.message, open: true })
                                    }
                                })
                        }} color="primary">Submit</Button>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>
                <CssBaseline />
                <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        {this.state.errors}
                    </Alert>
                </Snackbar>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={5} className={classes.products}>
                        <form onSubmit={this.onSubmitProduct}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Product ID"
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                        value={this.state.id}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Product Name"
                                        placeholder="Enter Product Name"
                                        variant="outlined"
                                        fullWidth
                                        name="productname"
                                        value={this.state.productname}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Created On"
                                        placeholder="Enter Default Created On"
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                        value={this.state.create_at}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Total Raw Materials"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={this.state.rawids.length}
                                    />
                                </Grid>
                            </Grid>
                            <Button variant="contained" type="submit" color="primary" style={{ margin: 20 }}>Update Product</Button>
                        </form>
                        <Divider className={classes.HorizontalDivider} />
                    </Grid>
                    <Divider orientation="vertical" flexItem className={classes.Divider} />

                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={allrawmaterials}
                                    onChange={(event, newValue) => {
                                        if (!newValue) {
                                            this.setState({ qtyinstock: '', rawid: '' });
                                        } else {
                                            this.setState({ qtyinstock: newValue.quantity, rawid: newValue.id });
                                        }
                                    }}
                                    getOptionLabel={(option) => 'ID: ' + option.id + ' | Material Name: ' + option.rawmaterialname + ' | Quantity: ' + option.quantity}
                                    name="customer"
                                    renderInput={(params) => <TextField {...params} label="Select Raw Material to Add" variant="outlined" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Quantity per Unit"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        type: "Number"
                                    }}
                                    name="qtyper"
                                    onChange={this.onChange}
                                    value={this.state.qtyper}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Quantity in stock"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        type: "Number"
                                    }}
                                    disabled
                                    value={this.state.qtyinstock}
                                />
                            </Grid>
                        </Grid>
                        <Button variant="contained" type="submit" color="primary" style={{ margin: 20 }}>Add Material to product</Button>
                    </Grid>

                </Grid>
                <MaterialTable
                    title="Raw Materials Required to Manufacture this Product"
                    columns={[
                        { title: 'ID', field: 'id', headerStyle: nowrap },
                        { title: 'Raw Material Name', field: 'type', headerStyle: nowrap },
                        { title: 'Quantity', field: 'quantity', headerStyle: nowrap },
                        { title: 'Unit', field: 'person_name', lookup: { 1: 'Number', 1000: 'Kilo Number' }, headerStyle: nowrap },
                        { title: 'Quantities Required', field: 'qty', headerStyle: nowrap },
                        { title: 'Created On', field: 'create_at', headerStyle: nowrap },
                    ]}
                    data={rawmaterials.map(rawmaterial => (
                        {
                            id: rawmaterial.id, quantity: rawmaterial.quantity, rawmaterialname: rawmaterial.rawmaterialname,
                            qty: rawmaterial.qty, create_at: rawmaterial.create_at, unit: rawmaterial.unit
                        }))
                    }
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Change Quantity Required',
                            onClick: (event, rowData) => {
                                this.setState({ editid: rowData.id, editqty: rowData.qty, editname: rowData.rawmaterialname, opendialog: true })
                            }
                        }
                    ]}
                    options={{
                        actionsColumnIndex: 9,
                        sorting: true,
                        pageSize: 10,
                        exportButton: true,
                        padding: 'dense'
                    }}
                />
                <br /><br />
            </Container >
        )
    }
}
export default withStyles(useStyles)(AddMaterials)
