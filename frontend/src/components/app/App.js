import React, { Component } from 'react';
import ImgGrabber from '../ImgGrabber/ImgGrabber';
import ToDos from './Todos';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="">
        <ToDos />
        <ImgGrabber />
      </div>
    );
  }
}

export default App;
