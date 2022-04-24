import React, {Component} from 'react';
import axios from 'axios';
import CustomerList from '../component/customerList'
import { Modal, Form, Button} from 'react-bootstrap';
import { Switch, SwitchLabel, SwitchRadio, SwitchSelection } from './styles.js';

const titleCase = str =>
  str.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

const ClickableLabel = ({ title, onChange, id }) =>
  <SwitchLabel onClick={() => onChange(title)} className={id}>
    {titleCase(title)}
  </SwitchLabel>;

const ConcealedRadio = ({ value, selected }) =>
  <SwitchRadio type="radio" name="switch" checked={selected === value} />;

class ToggleSwitch extends Component {
  state = { selected: this.props.selected };

  handleChange = val => {
    this.setState({ selected: val });
    window.sessionStorage.setItem("terpilih",val)
  };

  selectionStyle = () => {
    return {
      left: `${this.props.values.indexOf(this.state.selected) / 3 * 100}%`,
    };
  };

  render() {
    const { selected } = this.state;
    return (
      <Switch>
        {this.props.values.map(val => {
          return (
            <span>
              <ConcealedRadio value={val} selected={selected} />
              <ClickableLabel title={val} onChange={this.handleChange} />
            </span>
          );
        })}
        <SwitchSelection style={this.selectionStyle()} />
      </Switch>
    );
  }
}
export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            customers: [],
            isModalOpen: false,
            name: "",
            phone: "",
            address: "",
            image : true,
            username: "",
            password: "",
            action: "",
            isi: "",
            filteredCustomer: []
        }
        this.state.filteredCustomer = this.state.customers;
    }
    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    } 
    handleSave = (e) => {
        if(this.state.name!=="")
            if (e.keyCode === 13||e===13) {
                let form = new FormData()
                form.append('name', this.state.name)
                form.append('status', "gong")
                form.append('wes', false)

                
                let url = "http://localhost:8080/store/customer"
                axios.post(url, form)
                .then(res => {
                    this.getCustomer()
                    this.handleClose()
                })
                .catch (err => {
                    console.log(err.message)
                })
                
            }
    }
    handleAdd = () => {
        this.setState({
            isModalOpen: true,
            name: "",
            phone: "",
            address : "",
            username: "",
            image: null,
            password : "",
            action : "insert"
        })
    }
    handleEdit = (customer_id) => {
        let form = new FormData()
        form.append('name', window.sessionStorage.getItem("isi"))
        console.log(customer_id)
        
        let url = "http://localhost:8080/store/customer/"+ customer_id
        axios.put(url, form)
        .then(res => {
            this.getCustomer()
            this.handleClose()
        })
        .catch (err => {
            console.log(err.message)
        })
    }
    nofilter = () => {
        
        let result = this.state.customers.filter((item) => {
            return item.status.toLowerCase().includes("")
        });
        this.setState({
            filteredCustomer: result,
        });
    }
    handleWes = () => {
        
        let result = this.state.customers.filter((item) => {
            return item.status.toLowerCase().includes("wes")
        });
        this.setState({
            filteredCustomer: result,
        });
    }
    handleGg = () => {
        
        let result = this.state.customers.filter((item) => {
            return item.status.toLowerCase().includes("gong")
        });
        this.setState({
            filteredCustomer: result,
        });
    }
    handleDelete = (customer_id) => {
        let url = "http://localhost:8080/store/customer/" + customer_id
        if(window.confirm("hapus?")){
            axios.delete(url)
            .then(res => {
                this.getCustomer()
            })
            .catch (err => {
                console.log(err.message)
            })
        }
    }
    handleUpdateWes = (customer_id) => {
        let form = new FormData()
        form.append('status', "wes")
        form.append('wes', true)

        
        let url = "http://localhost:8080/store/customer/"+ customer_id
        axios.put(url, form)
        .then(res => {
            this.getCustomer()
            this.handleClose()
        })
        .catch (err => {
            console.log(err.message)
        })
    }
    handleUpdateGg = (customer_id) => {
        let form = new FormData()
        form.append('status', "gong")
        form.append('wes', false)

        
        let url = "http://localhost:8080/store/customer/"+ customer_id
        axios.put(url, form)
        .then(res => {
            this.getCustomer()
            this.handleClose()
        })
        .catch (err => {
            console.log(err.message)
        })
    }
    getCustomer = () => {
        let url = "http://localhost:8080/store/customer/"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    customers: res.data.customer.sort((a, b) => a - b).reverse(),
                    filteredCustomer: res.data.customer.sort((a, b) => a - b)
                })
            })
            .catch(err => {
                console.log(err.message)
            })
            
    }
    
    headerConfig=() =>{
        let header = {
            headers: {Authorization: 'Bearer ${this.state.token}'}
        }
        return header
    }
    componentDidMount = () => {
        this.getCustomer()
        this.interval = setInterval(() => this.filter(), 500);
    }
    filter=()=>{
        if(window.sessionStorage.getItem("terpilih")==="kabeh") this.nofilter()
        if(window.sessionStorage.getItem("terpilih")==="wes") this.handleWes()
        if(window.sessionStorage.getItem("terpilih")==="gong") this.handleGg()
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
        console.log("e")
    }
    handleFile = (e) => {
        this.setState({
            image : e.target.files[0]
        })
    }
    render() {
        return (
            <div className="bg">
                <div className="container">
                    <div className='mb-4 mt-4'>
                        <h6>simpel to</h6>
                    </div>
                    <div>
                        <div class="input-group mb-3">
                            <input type="text" name="name" class="form-control" placeholder="rencana?"  onChange={this.handleChange} onKeyUp={(e) => this.handleSave(e)}/>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" onClick={(e) => this.handleSave(13)}>ok</button>
                            </div>
                        </div>
                        <ToggleSwitch values={['kabeh', 'wes', 'gong']} selected="kabeh"/>
                        {this.state.filteredCustomer.map((item, index) => {
                            return(
                            <CustomerList 
                                key={index}
                                name={item.name}
                                status={item.status}
                                wes={item.wes}
                                onWes={() => this.handleUpdateWes(item.customer_id)}
                                onGg={() => this.handleUpdateGg(item.customer_id)}
                                onEdit={() => this.handleEdit(item.customer_id)}
                                onDrop={() => this.handleDelete(item.customer_id)}
                            />
                            )
                        })}
                    </div>
                </div>
                {/* ini Modal*/}
                    <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Form Buku</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={(e) => this.handleSave(e)}>
                            <Modal.Body>
                            <Form.Group className="mb-3" controlId="nama">
                                <Form.Label>Nama</Form.Label>
                                <Form.Control type="text" name="name" placeholder="Masukkan" value={this.state.nama} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>phone</Form.Label>
                                <Form.Control type="text" name="phone" placeholder="Masukkan" value={this.state.phone} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label>alamat</Form.Label>
                                <Form.Control type="text" name="address" placeholder="Masukkan" value={this.state.address} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="usesrname">
                                <Form.Label>username</Form.Label>
                                <Form.Control type="text" name="username" placeholder="Masukkan " value={this.state.username} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Nama</Form.Label>
                                <Form.Control type="text" name="password" placeholder="Masukkan password" value={this.state.password} onChange={this.handleChange} />
                            </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
            </div>
        )
    }
}