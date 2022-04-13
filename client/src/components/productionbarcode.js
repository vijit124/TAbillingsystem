import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, Container, Typography, TextField, Button,
} from '@material-ui/core';
import axios from 'axios';
import $links from './variable'
import Barcode from 'react-barcode'
import { Autocomplete } from '@material-ui/lab';

const useStyles = (theme) => ({

    root: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: 70,
        },
    },
    Card: {
        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.4)',
        borderRadius: 5
    },
    submit: {
        marginTop: 9
    },
});
class RawStore extends Component {

    constructor() {
        super()
        this.state = {
            lastbarcode: '',
            barcodes: [],
            product_id: '',
            startbarcode: '',
            quantity: 1,
            batch: [],
            hidden1: 'inline',
            hidden2: 'none',
            batchnumber: '',
            products: [],
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        var lastbarcodes = JSON.parse(localStorage.getItem('printbarcodes'))
        var iflastbarcode = {}
        if (lastbarcodes) {
            iflastbarcode = { barcodes: lastbarcodes, hidden1: 'none', hidden2: 'inline' }
        }
        var displaytype = {
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.goodsdetails, displaytype)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                } else if (res.data.errors) {
                    alert(res.data.message)
                } else {
                    var obj = Object.assign({}, {
                        lastbarcode: res.data.lastbarcode, products: res.data.products,
                        batch: res.data.batch,
                    }, iflastbarcode)
                    localStorage.removeItem('printbarcodes')
                    this.setState(obj)
                    if (res.data.startbarcode) {
                        this.setState({
                            startbarcode: res.data.startbarcode
                        })
                    }
                }
            })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit = async (e) => {
        e.preventDefault()
        const userData = {
            startbarcode: this.state.startbarcode,
            quantity: this.state.quantity,
            batch: this.state.batchnumber,
            product_id: this.state.product_id,
            cookies: localStorage.getItem('jwt')
        }

        await axios.post($links.productionaddgoods, userData)
            .then(res => {

                if (res.data.errors === false) {
                    alert(res.data.message)
                    this.setState({ barcodes: res.data.barcodes, hidden1: 'none', hidden2: 'inline' })
                    setTimeout(() => {
                        window.print();
                    }, 1000);
                } else {
                    alert(res.data.message)
                }
            })
    }
    render() {
        const { classes } = this.props
        const { batch = [] } = this.state
        const { products = [] } = this.state
        const { barcodes = [] } = this.state
        return (
            <div>
                <div style={{ display: this.state.hidden1 }}>
                    <Container>
                        <Typography variant="h3">Last BarCode is {this.state.lastbarcode}</Typography><br />
                        <form className={classes.form} onSubmit={this.onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item sm={3} xs={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={products}
                                        onChange={(event, newValue) => {
                                            if (!newValue) {
                                                this.setState({ product_id: '', startbarcode: '' });
                                            } else {
                                                axios.post($links.startbarcode, { product_id: newValue.id })
                                                    .then(res => {
                                                        if (res.data.errors === false) {
                                                            if (res.data.startbarcode) {
                                                                this.setState({ startbarcode: res.data.startbarcode })
                                                            } else {
                                                                this.setState({ startbarcode: newValue.modelno })
                                                            }
                                                        } else {
                                                            alert(res.data.message)
                                                        }
                                                    })
                                                this.setState({ product_id: newValue.id });
                                            }
                                        }}
                                        getOptionLabel={(option) => 'Product ID: ' + option.id + ' | Product Name: ' + option.productname}
                                        renderInput={(params) => <TextField {...params} label="Select Product" autoFocus variant="outlined" fullWidth />}
                                    />
                                </Grid>
                                <Grid item sm={3} xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Barcode Start From"
                                        name="startbarcode"
                                        value={this.state.startbarcode}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                                <Grid item sm={3} xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Quantity"
                                        name="quantity"
                                        InputProps={{
                                            type: 'Number'
                                        }}
                                        placeholder='Enter Quantity'
                                        value={this.state.quantity}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                                <Grid item sm={3} xs={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={batch}
                                        getOptionLabel={(option) => 'Batch Number: ' + option.batch}
                                        onChange={(event, newValue) => {
                                            if (!newValue) {
                                                this.setState({ batchnumber: '' });
                                            } else {
                                                this.setState({ batchnumber: newValue.batch });
                                            }
                                        }}
                                        name="customer"
                                        renderInput={(params) => <TextField {...params} label="Select Batch Number" variant="outlined" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >Submit</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Container>
                </div>
                <div style={{ display: this.state.hidden2 }}>
                    <Grid container spacing={1} style={{ backgroundColor: '#f0f0f2', margin: 5 }}>
                        {barcodes.map(barcodes => (
                            <Grid item sm={3} xs={3} key={barcodes.id} >
                                <Typography style={{ lineHeight: 0.99, fontSize: 14 }}><b>Do not remove<br />Identification Code</b></Typography>
                                <Barcode value={barcodes} fontSize={15} marginTop={2} marginBottom={15} format="CODE128B" height={50} width={1} />
                            </Grid>

                        ))
                        }
                    </Grid>
                </div >
            </div>
        );
    }
}
export default withStyles(useStyles)(RawStore)
