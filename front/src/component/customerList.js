import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

import './hide.css';
export default class CustomerList extends React.Component {
    constructor() {
        super()
        this.state = {
            isInputOn: false,
            isi: ""
        }
    }
    handleBuka = () => {
    this.setState({
        isInputOn: true,
        isi: this.props.name
    });
    };
    handleTutup = (e) => {
        if (e.keyCode === 13||e===13) {
            this.setState({
                isInputOn: false
            });
            window.sessionStorage.setItem("isi", this.state.isi);
            this.props.onEdit()
        }
    };
    handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };
    render() {
        return(
            <div className="card col-sm-12 my-1">
                <div className="card-body row">
                    <div className="col-sm-7">
                    <table>
                        
                        <div class="input-group mb-3">
                        <h1 className={this.state.isInputOn ? 'element-hidden' : 'element-visible'}  style={{ textDecoration: this.props.wes ? "line-through" : "" }}  onClick={this.props.wes ? this.props.onGg : this.props.onWes }>{this.props.name}</h1>
                        <Form.Control type={this.state.isInputOn ? 'text' : 'hidden'}  style={{ textDecoration: this.props.wes ? "line-through" : "" }} size="lg" name="isi" defaultValue={this.state.isi} onChange={this.handleChange}  onKeyUp={(e) => this.handleTutup(e)} />
                            <div class="input-group-append">
                                <Button hidden= {!this.state.isInputOn} size="lg" variant="light" onClick={(e) => this.handleTutup(13)}>✓</Button >
                            </div>
                        </div>

                        <Button  hidden= {this.state.isInputOn} variant="light" onClick={() => this.handleBuka()}>Edit</Button >
                        &nbsp;&nbsp;
                        <Button  hidden= {this.state.isInputOn} variant="light" onClick={this.props.onDrop}>Hapus</Button >
                        </table>
                    </div>
                    <div className="col-sm-2">
                    </div>
                </div>
            </div>
        )
    }
}