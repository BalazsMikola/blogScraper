import React, { Component } from 'react';

class ToDos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lastId : 0,
      newItem: '',
      ItemList: [
        {
          id:1,
          name:'walk the dog',
          done:false
        },
        {
          id:2,
          name:'feed the cat',
          done:false
        }
      ]
    }
    this.addNewItem = this.addNewItem.bind(this)
  }

  handleInputType(event) {
    this.setState({
      newItem: event.target.value
    })
    console.log(this.state.newItem);
    
  }

  createList() {
    let listToRender = []
    for(let item in this.state.ItemList){
      listToRender.push(<li style={this.state.ItemList[item].done ? {color:'green'} : {color:'red'}} onClick={ () => this.doneJob(this.state.ItemList[item].id)} key={this.state.ItemList[item].id}>{this.state.ItemList[item].name}</li>) 
    }
    return listToRender
  }

  doneJob(id) {
    let conteiner = this.state.ItemList.map(element => {
      if(element.id === id){
        element.done = !element.done
      }
      return element
    })


    this.setState({
      ItemList: conteiner
      
    })
  }

  addNewItem() {
    let conteiner = this.state.ItemList
    conteiner.push({
      id:this.state.lastId,
      name:this.state.newItem,
      done:false
    })
    this.setState({
      lastId: this.state.lastId++,
      ItemList: conteiner
      
    })
    
  }

  render() {
    return (
      <div className="container">
        <div className="controlField">
          <input 
            type = "text"
            className = ""
            value = {this.state.newItem}
            name="whatToDo"
            onChange = {event => this.handleInputType(event)}
          />
          <button className="button" onClick={this.addNewItem} >Add to the list</button>
        </div>
        <ul className="listOfThingsToDo"> {this.createList()} </ul>
      </div>
    )
  }
}

export default ToDos;