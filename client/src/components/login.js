import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios';
import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import $links from './variable'
import { Paper } from '@material-ui/core';
//import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
        TECH ACHIEVER PVT. LTD. {new Date().getFullYear()}
        </Typography>
    );
}

const useStyles = theme => ({
    paper: {
        paddingRight: theme.spacing(5),
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(5),
        paddingBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    formControl: {
        marginTop: theme.spacing(2),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),

    },
})

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errors: '',
            open: false,
            token: '',
            Select: 'admin',

        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleClose = this.handleClose.bind(this)
        axios.post($links.authlogin, { cookies: localStorage.getItem('jwt') })
            .then(res => {
                if (res.data.errors === false) {
                    this.props.history.push(res.data.message)
                }
                else {
                    this.setState({ errors: res.data.message, open: true })
                }
            })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleClose(e, reason) {
        if (reason === 'clickaway') {
            return
        }
        this.setState({ open: false })
    }
    onSubmit = async (e) => {
        e.preventDefault()
        const user = {
            email: this.state.username,
            password: this.state.password,
        }
        await axios.post($links.login, user)
            .then(res => {
                if (res.data.errors === false) {
                    localStorage.setItem('jwt', res.data.jwt)
                    this.props.history.push(res.data.message)
                } else {
                    this.setState({ errors: res.data.message, open: true })
                }
            })
    }

    render() {
        const { classes } = this.props
        return (
            <div id="login">
                <Container component="main" style={{ maxWidth: 500, paddingTop: 140 }}>
                    <CssBaseline />
                    <Paper elevation={3}>
                        <div className={classes.paper}>
                            <img src='logo.svg' alt="logo.svg" width='300'></img>
                            <Snackbar open={this.state.open} autoHideDuration={3000} onClose={this.handleClose}>
                                <Alert onClose={this.handleClose} severity="error">
                                    {this.state.errors}
                                </Alert>
                            </Snackbar>
                            <form className={classes.form} onSubmit={this.onSubmit}>

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={this.state.username}
                                    onChange={this.onChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                                {/*}  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">User Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={this.state.Select}
                                        name="Select"
                                        onChange={this.onChange}
                                        label="User Type"
                                    >
                                        <MenuItem value='admin'>Admin</MenuItem>
                                        <MenuItem value='rawstore'>Raw Store</MenuItem>
                                        <MenuItem value='production'>Production</MenuItem>
                                        <MenuItem value='quality'>Quality Control</MenuItem>
                                        <MenuItem value='stockmanager'>Stock Manager</MenuItem>
                                    </Select>
                                </FormControl>
        */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign In
          </Button>
                            </form>
                            <Box mt={3}>
                                <Copyright />
                            </Box>
                        </div>

                    </Paper>
                </Container>
            </div>
        );
    }
}
export default withStyles(useStyles)(Login)
