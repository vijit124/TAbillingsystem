import { Button } from '@material-ui/core';
import React, { Component } from 'react'
import QRCode from "react-qr-code";
export default class Qrcode extends Component {
    constructor() {
        super()
        this.state = {
            delay: 100,
            result: localStorage.getItem('qrcode'),
        }
    }
    render() {

        return (
            <div style={{ marginTop: 100 }}>
                {this.state.result ? <QRCode value={this.state.result} level="Q" size="275" /> : ''}
                <br />
                <p style={{ fontSize: 40 }}>QR Code : {this.state.result ? this.state.result : 'No QR Code'}</p>
                <Button id="printPageButton" variant="outlined" style={{ margin: 20 }} onClick={() => window.print()}>Print</Button>
            </div>
        )
    }
}