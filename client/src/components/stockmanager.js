import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import {
    Grid, Button, DialogActions, TextField, DialogContent, DialogTitle, Dialog,
} from '@material-ui/core';
import axios from 'axios';
import $links from './variable'

const useStyles = (theme) => ({

    root: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: 70,
            marginRight: 5
        },
    },
    Card: {
        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.4)',
        borderRadius: 5
    },
    button: {
        margin: theme.spacing(0, 0, 2, 2)
    }
});
class QualityControl extends Component {

    constructor() {
        super()
        this.state = {
            goods: [],
            id: '',
            open: false,
            lookup: {},
            remarks: ''
        }
        this.handleClose = this.handleClose.bind(this)
        this.onChange = this.onChange.bind(this)
        var displaytype = {
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.stockdashboard, displaytype)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                } else if (res.data.errors) {
                    alert(res.data.message)
                } else  {
                    this.setState({ goods: res.data.message, lookup: res.data.lookup })
                } 
            })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleClose = () => {
        this.setState({ open: false })
    };
    render() {
        const nowrap = { whiteSpace: 'nowrap' }
        const { classes } = this.props
        var { goods = [] } = this.state
        return (
            <div className={classes.root}>
                <Dialog open={this.state.open} fullWidth maxWidth="sm" onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit Good</DialogTitle>
                    <DialogContent style={{ height: 200 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    disabled
                                    fullWidth
                                    value={this.state.id}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    label="Remarks"
                                    multiline
                                    rows={3}
                                    name="remarks"
                                    fullWidth
                                    onChange={this.onChange}
                                    value={this.state.remarks}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async () => {
                            const good = {
                                id: this.state.id,
                                remarks: this.state.remarks
                            }
                            await axios.post($links.updategood, good)
                                .then(res => {
                                    if (res.data.errors === false) {
                                        alert(res.data.message)
                                        window.location.reload()
                                    } else {
                                        alert(res.data.message)
                                    }
                                })
                        }} color="primary">Submit</Button>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Grid container >
                    <Grid item xs={12} sm={12}>
                        <MaterialTable style={{ borderRadius: 15, borderBottom: '3px solid #f0bc11', borderTop: '3px solid #4cc42d', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.4)' }}
                            title="Delivered Items"
                            columns={[
                                { title: 'ID', field: 'id', cellStyle: { width: '1%', whiteSpace: 'nowrap' } },
                                { title: 'Product Name', field: 'productname', lookup: this.state.lookup, cellStyle: { width: '10%', whiteSpace: 'nowrap' }, headerStyle: nowrap },
                                { title: 'Batch', field: 'batch', cellStyle: { width: '7%', whiteSpace: 'nowrap' }, headerStyle: nowrap },
                                { title: 'Barcode', field: 'barcode', headerStyle: nowrap, cellStyle: { width: '10%', whiteSpace: 'nowrap' } },
                                { title: 'Production Started', field: 'create_at', headerStyle: nowrap, cellStyle: { width: '1%', whiteSpace: 'nowrap' } },
                                { title: 'Delivered Updated', field: 'updated', headerStyle: nowrap, cellStyle: { width: '1%', whiteSpace: 'nowrap' } },
                                { title: 'Remarks', field: 'remarks', headerStyle: nowrap, cellStyle: { whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 400 } },
                            ]}
                            data={goods.map(goods => (
                                {
                                    id: goods.id, productname: goods.product_id, batch: goods.batch,
                                    barcode: goods.barcode, create_at: goods.create_at,
                                    status: goods.status, remarks: goods.remarks ? goods.remarks : 'No Remarks', updated: goods.updated
                                }))}
                            actions={[
                                {
                                    icon: 'edit',
                                    tooltip: 'Edit',
                                    onClick: (event, rowData) => {
                                        this.setState({ open: true, id: rowData.id, remarks: rowData.remarks })
                                    }
                                }
                            ]}
                            options={{
                                search: false,
                                pageSize: 10,
                                actionsColumnIndex: -1,
                                padding: 'dense'
                            }}
                        />
                    </Grid>
                </Grid>
                <br />
            </div >
        );
    }
}
export default withStyles(useStyles)(QualityControl)