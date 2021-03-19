import React from "react";
import { BrowserRouter as Router } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {Route} from 'react-router-dom'
import {Switch} from 'react-router-dom'
import SendersContainer from './containers/SendersContainer'
import ReceiversContainer from './containers/ReceiversContainer'
//import ReceiversContainer from './containers/ReceiversContainer'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

class App extends React.Component {
    render () {
      return (
            <div className="App">
                <Container className="p-5">
                    <Jumbotron fluid>
                        <Container>
                            <Router>
                                <Link to="/sender">Sender</Link>
                                <Link to="/receiver">Receiver</Link>
                                <Route path="/sender" component={SendersContainer} />  
                                <Route path="/receiver" component={ReceiversContainer} />
                            </Router>  
                        </Container>  
                    </Jumbotron>              
                </Container>
            </div>           
      );
    }
  }
  
export default App