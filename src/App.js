import React, {Component} from 'react';
import Table from './components/Table';
import Authentication from './components/Authentication';
import AddContact from './components/AddContact';
import './App.css';
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyBddqWm8VKcmy84OFPeXhSTOPS5HUDSOC4",
    authDomain: "contacts-table-98f5d.firebaseapp.com",
    databaseURL: "https://contacts-table-98f5d.firebaseio.com",
    projectId: "contacts-table-98f5d",
    storageBucket: "contacts-table-98f5d.appspot.com",
    messagingSenderId: "233056327620"
};

firebase.initializeApp(config);
class App extends Component {

  gotData(data) {

      let people = [];
      let contacts = data.val();
      if (contacts === null) {
        return;
      }
      else {
        let keys = Object.keys(contacts);
        //console.log(keys);
        for (let i = 0; i < keys.length; i++) {
          let k = keys[i];
          let id = contacts[k].id;
          let name = contacts[k].name;
          let relationship = contacts[k].relationship;
          let phone = contacts[k].phone;
          let email = contacts[k].email;
          //console.log(" name: " + name + " relationship: " + relationship + " phone: " + phone + " email: " + email);
          people.push({
            id: id,
            name: name,
            relationship: relationship,
            phone: phone,
            email: email
          });
        }
        this.setState({
          display: people
        })
      }

  }

  login(authenticated, error) {
    this.setState({
      authenticated,
      error
    })
  }

 componentWillMount() {

   this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
     if (user) {
       this.setState({
         authenticated: true,
         loading: false
       }, () => {
         var database = firebase.database();
         var ref = database.ref('ContactsTable');
         ref.on('value', this.gotData);
       });

     }
     else {
       this.setState({
         authenticated: false,
         loading: false
       });
     }
   });

 }

 componentWillUnmount() {
   this.removeAuthListener();
 }

 orderContacts(display) {
   for (let i = 0; i < display.length; i++) {

       // Find the minimum in the list[i..list.length-1]
       let currentMin = display[i]['name'];
       let currentMinIndex = i;

       for (let j = i + 1; j < display.length; j++) {

           if (currentMin > display[j]['name']) {
               currentMin = display[j];
               currentMinIndex = j;
           }
       }

       // Swap list[i] with list[currentMinIndex] if necessary;
       if (currentMinIndex !== i) {
           display[currentMinIndex] = display[i];
           display[i] = currentMin;
       }
   }
   return display;
 }

 handleUpdateContact(contact) {
   let display = this.state.display;

   //remove old contact:
   let id = contact.id;
   let index = display.findIndex(x => x.id === id);
   display.splice(index, 1);
   this.setState({display});

   //add new contact:
   display.push(contact);

   //sort contact by name in ascending order:
   display = this.orderContacts(display);

   this.setState({
     display
   });
   //console.log(contact.id);

   firebase.database().ref('ContactsTable/'+contact.id).set({
           id: contact.id,
           name: contact.name,
           relationship: contact.relationship,
           phone: contact.phone,
           email: contact.email
   });

}

 handleAddContact(contact) {
   //console.log("contact: " + contact);
   let display = this.state.display;
   display.push(contact);

   this.setState({
     display
   });
   //console.log(display[display.length - 1]['id']);

   firebase.database().ref('ContactsTable/'+contact.id).set({
           id: contact.id,
           name: contact.name,
           relationship: contact.relationship,
           phone: contact.phone,
           email: contact.email
   });

   //console.log(display);
 }

 handleDeleteContact(id) {
   let display = this.state.display;
   let index = display.findIndex(x => x.id === id);
   display.splice(index, 1);
   this.setState({display});

   firebase.database().ref('ContactsTable/'+id).remove();

 }

 logout() {
   firebase.auth().signOut().then((user) => {
     this.setState({
       authenticated: false
     });
   });
 }

 constructor(props){
   super(props);

   this.state = {
     authenticated: false,
     error: '',
     loading: true,
     display: []
   };
   this.login = this.login.bind(this);
   this.orderContacts = this.orderContacts.bind(this);
   this.gotData = this.gotData.bind(this);
 }


  render(){
    let loading = this.state.loading;
    let loggedIn = this.state.authenticated;

    if (loading === true) {
      return (
        <div className="loading">
          <h5>Loading ...</h5>
        </div>
      );
    }
    else {
      let authenticated = this.props.authenticated;
      let error = this.props.error;
      let display;

      if (loggedIn) {
            display = <div className="main-container">
                          <h1>Contact List</h1>
                          <button className="logout-button" onClick={this.logout.bind(this)}>Log out</button>
                          <AddContact total={this.state.display.length}
                          addContact={this.handleAddContact.bind(this)} />

                          <Table title="Nick Romano&rsquo;s Contacts"
                          loggedIn={this.state.login}
                          updateContact={this.handleUpdateContact.bind(this)}
                          onDelete={this.handleDeleteContact.bind(this)}
                          display={this.state.display}
                          />
                      </div>;
      }
      else {
            return (
              display = <Authentication login={this.login.bind(this, authenticated, error)} />
            )
      }
      return(
        <div>
          {display}
        </div>
      );
    }


  }
}

export default App;
