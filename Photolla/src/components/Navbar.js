import React, { Component } from 'react';
import logo from '../images/Logo.png'
import search from '../images/search.png'
import icon from '../images/CharmanderProfilePhoto.png'

class Navbar extends Component {

  render() {
    return (
      <nav>
        <div className="nav-left">
          <img src ={logo} className="logo" onClick={() => this.props.loadprofile("", "")}/>
        </div>
        <div className="nav-right"></div>
          <div className="search-box">
            <img src={search}/>
            <input type="text" placeholder="Search" id="searchbar" onKeyDown={this.props.onKeyDown}/>
          </div>
          <div className="nav-right">
            <small>{this.props.account}</small>
          </div>
          <div className="nav-user-icon online">
            <img src={icon}/>
          </div>
      </nav>
    );
  }
}

export default Navbar;
