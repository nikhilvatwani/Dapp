import React, { Component } from 'react';
import classes from './Navbar.css';

class Navbar extends Component {

  render() {
    return (
      <header className="header">
        
      <div className="logo">Infinity<small> crafted resumes</small></div>
          <nav>
      <ul>
        { <li>Your address: {this.props.account}</li> }
      </ul>
    </nav>
  </header>

    );
  }
}



export default Navbar;
