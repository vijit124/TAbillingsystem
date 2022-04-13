import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react'
import Scanner from './Scanner'
import $links from './variable'
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
  button: {
    margin: theme.spacing(0, 0, 2, 2)
  }
});
class Barcode extends Component {
  constructor() {
    super()

    this.state = {
      scanning: false,
      results: [],
      hidden: 'none',
      id: '',
      barcode: '',
      batch: '',
      status: 0
    }
  }
  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {
    axios.post($links.barcoderead, { barcode: result.codeResult.code })
      .then(res => {
        if (res.data.errors === false) {
          this.setState({
            results: result.codeResult.code, scanning: false, hidden: 'inline',
            barcode: res.data.good.barcode, id: res.data.good.batch, status: res.data.good.status
          })
        }
      })

  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <button onClick={this._scan}>
          {this.state.scanning ? 'Stop' : 'Start'}
        </button>
        {this.state.scanning ? <Scanner onDetected={this._onDetected} /> : null}
        <div style={{ display: this.state.hidden, paddingTop: 50 }}>
          <Container style={{ paddingTop: 50 }}>
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
              <Grid item sm={12}>
                <Button onClick={async () => {
                  const good = {
                    id: this.state.id,
                    barcode: this.state.barcode,
                    batch: this.state.batch,
                    status: this.state.status
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
                }} color="primary" variant="contained">Submit</Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    )
  }
}

export default withStyles(useStyles)(Barcode)
