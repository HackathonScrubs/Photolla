import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    if (this.props.creators[this.props.creatorID - 1] === undefined) {
      return (
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <h2>Setup Account</h2>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this.props.setup(this.name.value, this.bio.value)
                }} >
                  <div className="form-group mr-sm-2">
                      <br></br>
                        <input
                          id="name"
                          type="text"
                          ref={(input) => { this.name = input }}
                          className="form-control"
                          placeholder="Enter your name..."
                          required />
                    </div>
                    <div className="form-group mr-sm-2">
                      <br></br>
                        <input
                          id="bio"
                          type="text"
                          ref={(input) => { this.bio = input }}
                          className="form-control"
                          placeholder="Enter your bio..."
                          required />
                    </div>
                    <p>&nbsp;</p>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">Finish</button>
                </form>
              </div>
            </main>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <h2>Share Image</h2>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = this.imageDescription.value
                  this.props.uploadImage(description)
                }} >
                  <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                    <div className="form-group mr-sm-2">
                      <br></br>
                        <input
                          id="imageDescription"
                          type="text"
                          ref={(input) => { this.imageDescription = input }}
                          className="form-control"
                          placeholder="Image description..."
                          required />
                    </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
                </form>
                <p>&nbsp;</p>
                { this.props.creators.map((creator, key) => {
                  return(
                    <div className="card mb-4" key={key} >
                      <div className="card-header">
                        <small className="text-muted">{creator.creatorName}</small>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item">
                          <p className="text-center">
                            <img src=
                              {this.props.images[creator.creatorAddress].length === 0
                              ? `data:image/png;base64,${creator.defaultProfile}`
                              : `https://ipfs.infura.io/ipfs/${this.props.images[creator.creatorAddress][this.props.images[creator.creatorAddress].length - 1][1]}`
                              }
                              style={{ maxWidth: '420px'}}
                            />
                          </p>
                          <p>{creator.bio}</p>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>
      );
    }
  }
}

export default Main;
