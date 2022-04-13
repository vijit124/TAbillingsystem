import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import {
    Grid, Container,
} from '@material-ui/core';
import axios from 'axios';
import $links from './variable'
import { Link } from 'react-router-dom';

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
});
class RawStore extends Component {

    constructor() {
        super()
        this.state = {
            productdetails: [],
        }
        var displaytype = {
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.productiondashboard, displaytype)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                }
                else if (res.data.errors) {
                    alert(res.data.message)
                }
                else {
                    this.setState({ productdetails: res.data.message })
                }
            })
    }

    render() {
        const nowrap = { whiteSpace: 'nowrap' }
        var { productdetails = [] } = this.state
        return (
            <div>
                <Container>
                    <Grid container spacing={3} >
                        <Grid item xs={12} sm={12}>
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
                    </Grid>
                    <br />
                </Container>
            </div >
        );
    }
}
export default withStyles(useStyles)(RawStore)
