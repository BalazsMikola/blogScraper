import React, { Component } from 'react';
import LoadingSpinner from 'react-loader-spinner'

class ImgGrabber extends Component {
  
  constructor() {
    super()
    this.state = {
      inputValue: '1',
      dataFromDb: [],
      loading: false,
      buttonDisabled: false
    }
  }

  createImgTags() {
    return this.state.dataFromDb.map( (link,key=0) => <img src={ link } alt="" key={ key++ }/> )
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value
    })
  }

  getImages = async () => {

    this.setState({ 
      loading: true,
      buttonDisabled: true
    })

    const serverResponse = await fetch(`http://localhost:2999/?page=${this.state.inputValue}`)
    .then(res => res.json())
    .then(res => res)
    .catch(err => {
      throw new Error('Can\'t fetch data from server.' + err)
    })

    this.setState({ 
      dataFromDb : serverResponse.data,
      loading: false,
      buttonDisabled: false
    })
  }

  render() {
    return (
      <div className="componentContainer">
        <div className="control">
          <input 
            type = "number"
            min="1"
            className = ""
            value = {this.state.inputValue}
            onChange = {event => this.updateInputValue(event)}
          />
          <button className="button" onClick={this.getImages} disabled={this.state.buttonDisabled}>Show my pics</button>
          <div className="spinnerContainer">
            {this.state.loading ? <LoadingSpinner type="ThreeDots" className="spinner"/> : null}
          </div>
        </div>
        <div className="images"> {this.createImgTags()} </div>
      </div>
    )
  }
}

export default ImgGrabber;