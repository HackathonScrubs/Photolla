import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    if (this.props.creators[this.props.creatorID - 1] === undefined) {
      return (
        <body>
			<div>
				<main role="main" className="container" style={{ maxWidth: '500px' }}>
				<div>
					<p>&nbsp;</p>
					<form id="signup" onSubmit={(event) => {
					event.preventDefault()
					this.props.setup(this.name.value, this.bio.value)
					}} >
						<div className="header">
							<br></br>
							<img src="signup.png" className="icon"/>
							<h2 className="login.text">Sign Up</h2>
							<p>Start your journey as a creator</p>
							<div className="sep"></div>
							<br></br>
							<div class="inputs">
								<input
									id="name"
									type="text"
									ref={(input) => { this.name = input }}
									placeholder="Enter your name..."
									required />
								<input
									id="bio"
									type="text"
									ref={(input) => { this.bio = input }}
									placeholder="Enter your bio..."
									required />
							</div>
                    		<p>&nbsp;</p>
							<button className="submit">Sign Up</button>
						</div>
					</form>
				  </div>
            	</main>
			</div>
		</body>
      );
    } else if (this.props.profileAddress != '') {
      console.log(this.props.profileAddress)
      return (
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
              <div className="content mr-auto ml-auto">
				<img className="icon" src="writer.png"/>
                  <h2 style={{ textAlign: 'center' }}>{this.props.profileName}</h2>
                <p>&nbsp;</p>
                  { this.props.images[this.props.profileAddress].map((image, key) => {
                      return(
                        <div className="card mb-4" key={key}>
                          <div className="card-header" id="creator-header">
                            <p>{image.description}</p>
                          </div>
                          <ul id="imageList" className="list-group list-group-flush">
                            <li className="list-group-item">
                              <p className="text-center">
                                <img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/>
                              </p>
                            </li>
                        <small className="float-left mt-1 text-muted">
                          Endorsement: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(image.imageId)
                            this.props.tipImageOwner(this.props.profileAddress, image.imageId - 1, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                          </ul>
                        </div>
                      )
                    })
                  }
                </div>
            </main>
          </div>
        </div>
      );
    } else {
      return (
        <div className="creator-container">
            <div id="creator-upload">
            	<div className="box">
					<h1>My Profile</h1>
					<p>&nbsp;</p>
					<img src="photo.png" className="icon"/>
					<h2>Post Photo</h2>
					<div className="inputs">
						<form onSubmit={(event) => {
							event.preventDefault()
							const description = this.imageDescription.value
							this.props.uploadImage(description)
							}} >
							<input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
							<br></br><br></br>
							<input
								id="imageDescription"
								type="text"
								ref={(input) => { this.imageDescription = input }}
								placeholder="Image description..."
							required />
							<button className="submit">Upload!</button>
							<br></br>
						</form>
					</div>
            	</div>
			</div>
			<div className="creator-header">
				<div clasName="creator-header-box">
					<img src="research.png" className="icon"/>
					<h2>Discover Creators</h2>
				</div>
			</div>
			<div className="creator-main content">
				{ this.props.creators.map((creator, key) => {
				return(
					<div className="creator-main-box" key={key}>
						<div id="inner-grid">
							<div className="creator-main-name">
								<a className="text-muted" href="#" onClick={() => this.props.loadprofile(creator.creatorAddress, creator.creatorName)}>{creator.creatorName}</a>
							</div>
							<div className="creator-main-image">
								<ul id="imageList" className="list-group list-group-flush">
									<li className="list-group-item">
										<p className="text-center">
										<img src=
										{this.props.images[creator.creatorAddress].length === 0
										? `data:image/png;base64,${creator.defaultProfile}`
										: `https://ipfs.infura.io/ipfs/${this.props.images[creator.creatorAddress][this.props.images[creator.creatorAddress].length - 1]["hash"]}`
										}
										style={{ maxWidth: '250px'}}
										/>
										</p>
									</li>
								</ul>
							</div>
							<div className="creator-main-bio">
								<p>{creator.bio}</p>
							</div>
						</div>
					</div> )})}
				</div>
		</div>
		  );
		}
	  }
	}
export default Main;