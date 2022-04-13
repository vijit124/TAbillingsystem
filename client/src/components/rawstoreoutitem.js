import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import {
    Grid, Container,
    Button, TextField
} from '@material-ui/core';
import axios from 'axios';
import $links from './variable'
import { Autocomplete } from '@material-ui/lab';
import { Link } from 'react-router-dom';


const useStyles = (theme) => ({
    order: {
        marginTop: theme.spacing(1)
    }
});
class RawStore extends Component {

    constructor() {
        super()
        this.state = {
            product_id: '',
            productname: '',
            products: [],
            quantity: 1,
            batch: '',
            start_date: new Date().toISOString().slice(0, 10),
            rawmaterials: [],
            productdetails: [],
            open: false,
            display: 'none'
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        axios.post($links.displayoutitem, { cookies: localStorage.getItem('jwt') })
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                }
                else if (res.data.errors) {
                    alert(res.data.message)
                } else {
                    this.setState({
                        productdetails: res.data.productdetails,
                        products: res.data.products,
                    })
                }
            })
    }
    handleClose = () => {
        this.setState({ open: false })
    };
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit = async (e) => {
        e.preventDefault()
        const user = {
            productname: this.state.productname,
            quantity: this.state.quantity,
            batch: this.state.batch,
            product_id: this.state.product_id,
            start_date: new Date(this.state.start_date).toLocaleDateString('en-GB'),
            cookies: localStorage.getItem('jwt')
        }
        await axios.post($links.addorder, user)
            .then(res => {
                console.log(res.data.message)
                if (res.data.errors === false) {
                    alert(res.data.message)
                    window.location.reload()
                } else {
                    alert(res.data.message)
                }
            })
    }
    render() {
        const nowrap = { whiteSpace: 'nowrap' }
        const { classes } = this.props
        var { rawmaterials = [] } = this.state
        var { products = [] } = this.state
        var { productdetails = [] } = this.state
        return (
            <div>
                <Container>
                    <form onSubmit={this.onSubmit}>
                        <Grid container spacing={3} >
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={products}
                                    onChange={(event, newValue) => {
                                        if (!newValue) {
                                            this.setState({ product_id: '', display: 'none', productname: '' });
                                        } else if (newValue) {
                                            axios.post($links.ingredients, { product_id: newValue.id })
                                                .then(res => {
                                                    if (res.data.errors === false) {
                                                        console.log(res.data.message)
                                                        this.setState({ product_id: newValue.id, productname: newValue.productname, display: 'inline', rawmaterials: res.data.message })
                                                    } else {
                                                        alert(res.data.message)
                                                    }
                                                })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.productname}
                                    renderInput={(params) => <TextField {...params} label="Select Product" autoFocus variant="outlined" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        type: 'Number'
                                    }}
                                    label="Quantity"
                                    name="quantity"
                                    value={this.state.quantity}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Batch Number"
                                    name="batch"
                                    autoComplete="batch"
                                    value={this.state.batch}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    variant="outlined"
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    name="start_date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={this.state.start_date}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button onClick={() => this.setState({ open: true })}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className={classes.order}>create order</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <br />

                    <div style={{ display: this.state.display }}>
                        <MaterialTable style={{ borderRadius: 15, borderBottom: '3px solid #f0bc11', borderTop: '3px solid #4cc42d', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.4)' }}
                            title=""
                            columns={[
                                { title: 'ID', field: 'id' },
                                { title: 'Rawmaterial Name', field: 'rawmaterialname' },
                                { title: 'Quantity Per Unit', field: 'qty', cellStyle: nowrap, headerStyle: nowrap },
                                { title: 'Quantity available', field: 'quantity', cellStyle: nowrap, headerStyle: nowrap },
                                { title: 'Max by this', field: 'max', headerStyle: nowrap, cellStyle: nowrap },

                            ]}
                            data={rawmaterials.map(rawmaterials => (
                                {
                                    id: rawmaterials.id, rawmaterialname: rawmaterials.rawmaterialname,
                                    qty: rawmaterials.qty, quantity: rawmaterials.quantity,
                                    max: Math.floor(rawmaterials.quantity / rawmaterials.qty)
                                }))}

                            options={{
                                search: false,
                                pageSize: 10,
                                actionsColumnIndex: -1,

                            }}
                        />
                        <br /><br />
                    </div>
                    <Grid item xs={12}>
                        <MaterialTable style={{ borderRadius: 15, borderBottom: '3px solid #f0bc11', borderTop: '3px solid #4cc42d', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.4)' }}
                            title="Orders Created"
                            columns={[
                                { title: 'ID', field: 'id' },
                                { title: 'Product Name', field: 'productname', cellStyle: nowrap, headerStyle: nowrap },
                                { title: 'Batch', field: 'batch', cellStyle: nowrap, headerStyle: nowrap },
                                { title: 'Start On', field: 'start_date', headerStyle: nowrap, cellStyle: nowrap },
                                { title: 'Quantity', field: 'quantity', headerStyle: nowrap, cellStyle: nowrap },
                                { title: 'Quantity Left', field: 'quantity_left', headerStyle: nowrap, cellStyle: nowrap },
                                {
                                    title: 'QR Code', field: 'qrcode', headerStyle: nowrap, cellStyle: nowrap, render: rowData => (
                                        <div>
                                            <Link onClick={() => {
                                                localStorage.setItem('qrcode', rowData.qrcode)
                                                const win = window.open("/displayqrcode", "_blank");
                                                win.focus();
                                            }}
                                            >{rowData.qrcode}</Link>
                                        </div>
                                    )
                                },
                            ]}
                            data={productdetails.map(productdetails => (
                                {
                                    id: productdetails.id, mobile: productdetails.mobile,
                                    productname: productdetails.productname, batch: productdetails.batch,
                                    start_date: productdetails.start_date, quantity: productdetails.quantity,
                                    quantity_left: productdetails.quantity_left, qrcode: productdetails.qrcode
                                }))}
                            options={{
                                pageSize: 10,
                                actionsColumnIndex: -1,

                            }}
                        />
                    </Grid>
                    <br />
                </Container>
            </div >
        );
    }
}
export default withStyles(useStyles)(RawStore)
