import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import logo from '../images/Logo.png'
import search from '../images/search.png'
import icon from '../images/CharmanderProfilePhoto.png'

class Navbar extends Component {

  render() {
    return (
      /*<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          Photolla
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
            { this.props.account
              ? <img
                className='ml-2'
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>*/
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
