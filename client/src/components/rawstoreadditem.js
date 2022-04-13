import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, CssBaseline, Typography, TextField, Button, MenuItem, FormControl, Select, InputLabel } from '@material-ui/core';
import axios from 'axios'
import { Autocomplete } from '@material-ui/lab'
import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import $links from './variable'

const useStyles = (theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class AddItem extends Component {
    constructor() {
        super()
        this.state = {
            quantity: 1,
            unit: 1,
            rawmaterials: [],
            rawmaterialname: '',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        var displaytype = {
            alldetails: false,
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
                        rawmaterials: res.data.message
                    })
                }
            })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit = async (e) => {
        e.preventDefault()
        const user = {
            rawmaterialname: this.state.rawmaterialname,
            quantity: this.state.quantity,
            unit: this.state.unit,
            cookies: localStorage.getItem('jwt')
        }
        await axios.post($links.addrawmaterial, user)
            .then(res => {
                if (res.data.errors === false) {
                    alert(res.data.message)
                    this.props.history.push('/rawstore/dashboard')
                } else {
                    this.setState({ errors: res.data.message, open: true })
                }
            })
    }
    render() {
        const { classes } = this.props
        const { rawmaterials = [] } = this.state
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        {this.state.errors}
                    </Alert>
                </Snackbar>
                <div className={classes.paper}>

                    <Typography component="h1" variant="h5">
                        Add Raw Material
              </Typography>
                    <form className={classes.form} onSubmit={this.onSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={rawmaterials}
                                    onChange={(event, newValue) => {
                                        if (!newValue) {
                                            this.setState({ rawmaterialname: '' });
                                        } else {
                                            this.setState({ rawmaterialname: newValue.rawmaterialname });
                                        }
                                    }}
                                    getOptionLabel={(option) => option.rawmaterialname}
                                    renderInput={(params) => <TextField {...params} label="Existing Item Name Suggestion" variant="outlined" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Item Name"
                                    name="rawmaterialname"
                                    autoFocus
                                    autoComplete="rawmaterialname"
                                    value={this.state.rawmaterialname}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Unit Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={this.state.unit}
                                        name="unit"
                                        onChange={this.onChange}
                                        label="Unit Type"
                                    >
                                        <MenuItem value={1}>Number</MenuItem>
                                        <MenuItem value={1000}>Kilo Number</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Add Raw material
                </Button>
                    </form>
                </div>
            </Container>
        )
    }
}
export default withStyles(useStyles)(AddItem)
