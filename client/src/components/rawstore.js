import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import {
    Grid, Container,
    Card, CardContent, Typography, Avatar
} from '@material-ui/core';
import axios from 'axios';
import $links from './variable'
import { MenuBook } from '@material-ui/icons'

const useStyles = (theme) => ({
    large1: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        boxShadow: '0 4px 10px 0 rgba(0,0,0,0.4)',
        backgroundColor: '#4cc42d'
    },
    large2: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        boxShadow: '0 4px 10px 0 rgba(0,0,0,0.4)',
        backgroundColor: '#f0bc11'
    },
    large3: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        boxShadow: '0 4px 10px 0 rgba(0,0,0,0.4)',
        backgroundColor: '#f50c23'
    },
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
            less: '',
            between: '',
            more: '',
            errors: '',
            rawmaterials: [],
        }
        var displaytype = {
            alldetails: true,
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.rawstoredashboard, displaytype)
            .then(res => {
                if (res.data.auth) {
                    window.location.replace('/')
                } else if (res.data.errors) {
                    alert(res.data.message)
                } else {
                    this.setState({
                        less: res.data.less, more: res.data.more, between: res.data.between, rawmaterials: res.data.message
                    })
                }
            })
    }

    render() {
        const nowrap = { whiteSpace: 'nowrap' }
        const { classes } = this.props
        var { rawmaterials = [] } = this.state
        return (
            <div>
                <Container>
                    <Grid container spacing={3} >
                        <Grid item xs={12} sm={4}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Grid container >
                                        <Grid item xs={9} sm={9}>
                                            <Typography align="left" variant='subtitle1' color="textSecondary" ><b>ITEMS MORE THAN 1000</b></Typography>
                                            <Typography align="left" variant="h6">{this.state.more}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sm={3}>
                                            <Avatar className={classes.large1}><MenuBook fontSize="large" /></Avatar>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Grid container >
                                        <Grid item xs={9} sm={9}>
                                            <Typography align="left" variant='subtitle1' color="textSecondary" ><b>ITEMS B/W 100 - 1000</b></Typography>
                                            <Typography align="left" variant="h6">{this.state.between}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sm={3}>
                                            <Avatar className={classes.large2}><MenuBook fontSize="large" /></Avatar>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Grid container >
                                        <Grid item xs={9} sm={9}>
                                            <Typography align="left" variant='subtitle1' color="textSecondary" ><b>ITEMS LESS THAN 100</b></Typography>
                                            <Typography align="left" variant="h6">{this.state.less}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sm={3}>
                                            <Avatar className={classes.large3}><MenuBook fontSize="large" /></Avatar>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <MaterialTable style={{ borderRadius: 15, borderBottom: '3px solid #f0bc11', borderTop: '3px solid #4cc42d', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.4)' }}
                                title="Raw Material Inventory"
                                columns={[
                                    { title: 'ID', field: 'id', editable: 'never' },
                                    { title: 'Raw Material Name', field: 'rawmaterialname', cellStyle: nowrap, headerStyle: nowrap },
                                    { title: 'Quantity', field: 'quantity', cellStyle: nowrap, headerStyle: nowrap },
                                    { title: 'Unit', field: 'unit', lookup: { 1: 'Number', 1000: 'Kilo Number' }, headerStyle: nowrap, cellStyle: nowrap },
                                    { title: 'Added On', field: 'create_at', headerStyle: nowrap, editable: 'never', cellStyle: nowrap },
                                ]}
                                data={rawmaterials.map(rawmaterials => (
                                    {
                                        id: rawmaterials.id, rawmaterialname: rawmaterials.rawmaterialname,
                                        quantity: rawmaterials.quantity, unit: rawmaterials.unit, create_at: rawmaterials.create_at
                                    }))}
                                editable={{
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                                const dataUpdate = [...rawmaterials];
                                                const index = oldData.tableData.id;
                                                dataUpdate[index] = newData;
                                                this.setState({ rawmaterials: [...dataUpdate] });
                                                var updatedrawmaterials = {
                                                    id: newData.id,
                                                    rawmaterialname: newData.rawmaterialname,
                                                    quantity: newData.quantity,
                                                    unit: newData.unit,
                                                    cookies: localStorage.getItem('jwt')
                                                }
                                                axios.post($links.updaterawmaterials, updatedrawmaterials)
                                                    .then(res => {
                                                        if (res.data.error === false) {
                                                            alert(res.data.message)
                                                        } else {
                                                            this.setState({ errors: res.data.message })
                                                            alert(this.state.errors)
                                                            window.location.reload(false)
                                                        }
                                                    })
                                                resolve();
                                            }, 500)
                                        }),
                                    onRowDelete: oldData =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                                const dataDelete = [...rawmaterials];
                                                const index = oldData.tableData.id;
                                                dataDelete.splice(index, 1);
                                                this.setState({ rawmaterials: [...dataDelete] });
                                                const userData = {
                                                    id: oldData.id,
                                                    cookies: localStorage.getItem('jwt')
                                                }
                                                axios.post($links.deleterawmaterial, userData)
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
                                    search: false,
                                    pageSize: 10,
                                    actionsColumnIndex: -1,
                                    rowStyle: rowData => {

                                        if (rowData.quantity < 100) {
                                            return { backgroundColor: '#ff6b6b' };
                                        }
                                        else if (rowData.quantity > 99 && rowData.quantity < 1001) {
                                            return { backgroundColor: '#ffe345' };
                                        }
                                        else if (rowData.quantity > 1000) {
                                            return { backgroundColor: '#6be34d' };
                                        }
                                    },
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
