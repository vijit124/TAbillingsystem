import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import {
    Grid, Button, DialogActions, TextField, DialogContent, DialogTitle, Dialog, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import axios from 'axios';
import $links from './variable'

const useStyles = (theme) => ({
    order: {
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: 150,
    },
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

class RawStore extends Component {

    constructor() {
        super()
        this.state = {
            goods: [],
            barcode: '',
            id: '',
            printothers: [],
            open: false,
            status: 0,
            batch: '',
            lookup: {},
            remarks: '',
        }
        this.handleClose = this.handleClose.bind(this)
        this.onChange = this.onChange.bind(this)
        var displaytype = {
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.admingoods, displaytype)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                } else if (res.data.errors) {
                    alert(res.data.message)
                } else {
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
        var printothers = []
        var { goods = [] } = this.state
        return (
            <div className={classes.root}>
                <Dialog open={this.state.open} fullWidth maxWidth="sm" onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit Good</DialogTitle>
                    <DialogContent style={{ height: 300 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    disabled
                                    fullWidth
                                    value={this.state.id}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Barcode"
                                    variant="outlined"
                                    fullWidth
                                    name="barcode"
                                    onChange={this.onChange}
                                    value={this.state.barcode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Batch"
                                    variant="outlined"
                                    fullWidth
                                    name="batch"
                                    onChange={this.onChange}
                                    value={this.state.batch}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={this.state.status}
                                        name="status"
                                        onChange={this.onChange}
                                        label="Status"
                                    >
                                        <MenuItem value={0}>Production</MenuItem>
                                        <MenuItem value={1}>Quality Control</MenuItem>
                                        <MenuItem value={2}>Delivered</MenuItem>
                                    </Select>
                                </FormControl>
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
                                barcode: this.state.barcode,
                                batch: this.state.batch,
                                status: this.state.status,
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
                            title="Goods"
                            columns={[
                                { title: 'ID', field: 'id', cellStyle: { width: '1%', whiteSpace: 'nowrap' } },
                                { title: 'Product Name', field: 'productname', lookup: this.state.lookup, cellStyle: { width: '10%', whiteSpace: 'nowrap' }, headerStyle: nowrap },
                                { title: 'Batch', field: 'batch', cellStyle: { width: '5%', whiteSpace: 'nowrap' }, headerStyle: nowrap },
                                { title: 'Barcode', field: 'barcode', headerStyle: nowrap, cellStyle: { width: '10%', whiteSpace: 'nowrap' } },
                                { title: 'Production Started', field: 'create_at', headerStyle: nowrap, cellStyle: { width: '10%', whiteSpace: 'nowrap' } },
                                { title: 'Last Updated', field: 'updated', headerStyle: nowrap, cellStyle: { width: '10%', whiteSpace: 'nowrap' } },
                                { title: 'Status', field: 'status', headerStyle: nowrap, cellStyle: nowrap, lookup: { 0: 'Production', 1: 'Quality Control', 2: 'Delivered' } },
                                { title: 'Remarks', field: 'remarks', headerStyle: nowrap, cellStyle: { whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 300 } }
                                , {
                                    title: 'Edit', field: 'edit', headerStyle: nowrap, render: rowData => (
                                        <div>

                                            <Button variant="contained" color="secondary" size="small"
                                                onClick={() => {
                                                    this.setState({ open: true, barcode: rowData.barcode, batch: rowData.batch, id: rowData.id, status: rowData.status, remarks: rowData.remarks })
                                                }}
                                            >Edit</Button>
                                        </div>
                                    )
                                },
                            ]}
                            data={goods.map(goods => (
                                {
                                    id: goods.id, productname: goods.product_id, batch: goods.batch,
                                    barcode: goods.barcode, create_at: goods.create_at, updated: goods.updated,
                                    status: goods.status, remarks: goods.remarks ? goods.remarks : 'No Remarks', edit: goods.id
                                }))}
                            options={{
                                search: false,
                                pageSize: 10,
                                selection: true,
                                padding: 'dense',
                                actionsColumnIndex: -1,
                            }}
                            actions={[
                                {
                                    tooltip: 'Print the barcodes again',
                                    icon: 'print',
                                    onClick: (evt, data) => {
                                        var nameArray = printothers.map(function (el) { return el.barcode; });
                                        var strinarray = JSON.stringify(nameArray)
                                        localStorage.setItem('printbarcodes', strinarray)
                                        this.props.history.push('/production/barcode')
                                    }
                                }
                            ]}
                            onSelectionChange={(rows) => {
                                printothers = rows
                            }}
                        />
                    </Grid>
                </Grid>
                <br />
            </div >
        );
    }
}
export default withStyles(useStyles)(RawStore)