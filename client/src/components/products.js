import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, CssBaseline, Typography, Button, CardActions, CardContent, Card } from '@material-ui/core';
import axios from 'axios'
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

class AddMaterials extends Component {
    constructor() {
        super()
        this.state = {
            products: [],
            notfound: '',
        }
        var displaytype = {
            cookies: localStorage.getItem('jwt')
        }
        axios.post($links.displayproducts, displaytype)
            .then(res => {
                if (res.data.errors === true) {
                    alert(res.data.message)
                    window.location.replace('/')
                }
                if (res.data.errors === false) {
                    if (res.data.message[0] === undefined) {
                        this.setState({ notfound: "No Products Found" })
                    } else {
                        this.setState({ products: res.data.message })
                    }
                } else {
                    this.setState({ errors: res.data.message, open1: true })

                }
            })
            .catch(err => {
                this.setState({ notfound: "No Products Found" })
            }
            )
    }

    render() {
        const { classes } = this.props
        const { products = [] } = this.state
        console.log(this.state.notfound)
        return (
            <Container>
                <CssBaseline />
                <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        {this.state.errors}
                    </Alert>
                </Snackbar>
                <Grid container spacing={3}>
                    {products.map(products => (
                        <Grid item xs={12} sm={4} key={products.id}>
                            <Card className={classes.root} >
                                <CardContent>
                                    <Typography className={classes.Typography} align="left">
                                        <b>Product ID: </b>{products.id}
                                    </Typography>
                                    <Typography align="left" className={classes.Typography}>
                                        <b>Product Name:</b> {products.productname}</Typography>
                                    <Typography className={classes.Typography} align="left">
                                        <b>Created On: </b> {products.create_at}</Typography>
                                    <Typography className={classes.Typography} align="left">
                                        <b>Materials Required: </b> {products.rawids.length}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button color="primary" onClick={() => {
                                        localStorage.setItem('product_id', products.id)
                                        this.props.history.push('/admin/productdetails')
                                    }}
                                    >View Product</Button>
                                </CardActions>
                            </Card>
                        </Grid>

                    ))
                    }
                </Grid>
                <Typography variant="h2" style={{ marginTop: 100 }}>{this.state.notfound}</Typography>
            </Container>
        )
    }
}
export default withStyles(useStyles)(AddMaterials)
