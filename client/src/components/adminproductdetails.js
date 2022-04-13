import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import axios from 'axios'
import { Button, Container, Divider, Grid, Paper, Typography, CircularProgress, Backdrop, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import $links from './variable';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { Autocomplete } from '@material-ui/lab';
const useStyles = (theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    button: {
        margin: theme.spacing(5, 0, 2),
    },
    Typography: {
        fontSize: 17.5
    },
    link: {
        textDecoration: 'none',
        color: 'grey'
    },
    tables: {
        marginBottom: 50,
        [theme.breakpoints.up('sm')]: {
            marginLeft: 65, marginRight: 5, marginBottom: 50
        }
    },
    TextFields: {
        marginLeft: 20, marginRight: 20
    },
    customerdetails: {
        textAlign: 'left',
        marginLeft: 10,
        [theme.breakpoints.up('sm')]: {
            marginLeft: 50
        },
    }

});
class Productdetails extends Component {

    constructor() {
        super()
        this.state = {
            rawmaterials: [],
            errors: '',
            id: '',
            productname: '',
            modelno: '',
            newrawid: '',
            newqty: 1,
            create_at: '',
            open: false,
            qtyleft: '',
            allrawmaterials: [],
            opencircle: true
        }
        this.handleClose = this.handleClose.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        const product = {
            id: localStorage.getItem('product_id'),
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.productdetails, product)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                }
                else if (res.data.errors === false) {
                    this.setState({
                        rawmaterials: res.data.rawmaterials, id: res.data.message.id, productname: res.data.message.productname,
                        modelno: res.data.message.modelno, create_at: res.data.message.create_at, allrawmaterials: res.data.allrawmaterials,
                        opencircle: false
                    })
                } else { alert(res.data.message) }
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
        const good = {
            id: this.state.id,
            productname: this.state.productname,
            modelno: this.state.modelno,
            cookies: localStorage.getItem('jwt')
        }
        await axios.post($links.updateproduct, good)
            .then(res => {
                if (res.data.errors === false) {
                    alert(res.data.message)
                } else {
                    alert(res.data.message)
                }
            })

    }
    render() {
        const nowrap = { whiteSpace: 'nowrap' }
        const { classes } = this.props
        var { rawmaterials = [] } = this.state
        var { allrawmaterials = [] } = this.state
        return (
            <div>
                <Dialog open={this.state.open} onClose={this.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add Material Details</DialogTitle>
                    <DialogContent style={{ minHeight: 180 }}>
                        <form onSubmit={this.onSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={allrawmaterials}
                                        onChange={(event, newValue) => {
                                            if (!newValue) {
                                                this.setState({ newrawid: '', qtyleft: '' });
                                            } else {
                                                this.setState({ newrawid: newValue.id, qtyleft: newValue.quantity });
                                            }
                                        }}
                                        getOptionLabel={(option) => option.id + ", " + option.rawmaterialname}
                                        renderInput={(params) => <TextField {...params} label="Select Raw Material to Add" variant="outlined" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Quantities Left"
                                        variant="outlined"
                                        disabled
                                        fullWidth
                                        value={this.state.qtyleft}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Quantities per Unit"
                                        placeholder="Enter Quantities per Unit"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            type: "Number"
                                        }}
                                        name="newqty"
                                        value={this.state.newqty}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                            </Grid></form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async () => {
                            const rawids = {
                                id: parseInt(this.state.newrawid),
                                qty: parseInt(this.state.newqty)
                            }
                            const userData = {
                                id: this.state.id,
                                rawids: rawids,
                                cookies: localStorage.getItem('jwt')
                            }
                            await axios.post($links.addmaterialtoproduct, userData)
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
                            Submit</Button>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Container>
                    <Paper elevation={3} style={{ marginBottom: 40 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Button endIcon={<LibraryAddIcon />} variant="outlined" onClick={() => {
                                    this.setState({ open: true })
                                }} style={{ color: 'grey', float: 'right', marginRight: 15, marginTop: 4 }} >Add Material</Button>
                                <Typography variant="h4" className={classes.customerdetails}>Product Details</Typography>
                                <Divider style={{ marginTop: 10 }} />
                            </Grid>
                        </Grid>
                        <br />
                        <Container>
                            <form className={classes.form} onSubmit={this.onSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="ID"
                                            variant="outlined"
                                            disabled
                                            fullWidth
                                            value={this.state.id}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Product Name"
                                            variant="outlined"
                                            fullWidth
                                            autoFocus
                                            name="productname"
                                            onChange={this.onChange}
                                            value={this.state.productname}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Model Number"
                                            variant="outlined"
                                            fullWidth
                                            name="modelno"
                                            onChange={this.onChange}
                                            value={this.state.modelno}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            label="Created On"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            value={this.state.create_at}
                                        />
                                    </Grid>
                                    <Grid item sm={12} xs={12}>
                                        <Button color="primary" type="submit" variant="contained">Submit</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Container>
                    </Paper>
                    <MaterialTable style={{ borderRadius: 15, marginBottom: 50, borderBottom: '3px solid #f0bc11', borderTop: '3px solid #4cc42d', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.4)' }}
                        title="Raw Materials Required"
                        columns={[
                            { title: 'ID', field: 'id', editable: 'never', cellStyle: { width: '1%', whiteSpace: 'nowrap' } },
                            { title: 'Rawmaterial Name', field: 'rawmaterialname', cellStyle: { whiteSpace: 'nowrap' } },
                            { title: 'Quantity Per Unit', field: 'qty', type: 'numeric', cellStyle: nowrap, headerStyle: nowrap },
                            { title: 'Quantity available', field: 'quantity', type: 'numeric', cellStyle: nowrap, headerStyle: nowrap },
                            { title: 'Max by this', field: 'max', type: 'numeric', headerStyle: nowrap, cellStyle: nowrap, editable: 'never' },
                        ]}
                        data={rawmaterials.map(rawmaterials => (
                            {
                                id: rawmaterials.id, rawmaterialname: rawmaterials.rawmaterialname,
                                qty: rawmaterials.qty, quantity: rawmaterials.quantity,
                                max: Math.floor(rawmaterials.quantity / rawmaterials.qty)
                            }))}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Delete User',
                                onClick: (event, rowData) => {
                                    const userData = {
                                        product_id: this.state.id,
                                        id: rowData.id,
                                        cookies: localStorage.getItem('jwt')
                                    }
                                    axios.post($links.removematerial, userData)
                                        .then(res => {
                                            if (res.data.errors === false) {
                                                alert(res.data.message)
                                                window.location.reload()
                                            } else {
                                                alert(this.state.error)
                                            }
                                        })
                                }
                            }
                        ]}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        const dataUpdate = [...rawmaterials];
                                        const index = oldData.tableData.id;
                                        dataUpdate[index] = newData;
                                        this.setState({ rawmaterials: [...dataUpdate] });
                                        var updatedrawmaterials = {}
                                        if (newData.qty !== oldData.qty) {
                                            updatedrawmaterials = {
                                                product_id: this.state.id,
                                                id: newData.id,
                                                qty: parseInt(newData.qty),
                                                rawmaterialname: newData.rawmaterialname,
                                                quantity: newData.quantity,
                                                cookies: localStorage.getItem('jwt')
                                            }
                                        } else {
                                            updatedrawmaterials = {
                                                product_id: this.state.id,
                                                id: newData.id,
                                                rawmaterialname: newData.rawmaterialname,
                                                quantity: newData.quantity,
                                                cookies: localStorage.getItem('jwt')
                                            }
                                        }
                                        console.log(updatedrawmaterials)
                                        axios.post($links.adminupdaterawmaterials, updatedrawmaterials)
                                            .then(res => {
                                                if (res.data.errors === false) {
                                                    alert(res.data.message)
                                                } else {
                                                    this.setState({ errors: res.data.message })
                                                    alert(this.state.errors)
                                                }
                                            })
                                        resolve();
                                    }, 500)
                                }),
                        }}
                        options={{
                            pageSize: 10,
                            actionsColumnIndex: -1,
                            exportButton: true
                        }}
                    />
                </Container>
                <Backdrop className={classes.backdrop} open={this.state.opencircle}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div >

        );
    }
}

export default withStyles(useStyles)(Productdetails)