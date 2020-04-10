import React, { Component } from 'react';
import Contact from './Contact';

class Table extends Component {

  deleteContact(id) {
    this.props.onDelete(id);
  }

  updateContact(contact) {
    this.props.updateContact(contact);
  }

  constructor(props){
    super(props);

    this.state = {
      login: true
    };
  }

  render() {
    //console.log(this.props.display);
    let display;

    if (this.props.display) {

      display = this.props.display.map((display, index) => {

        return (
          <Contact key={index} count={index} contact={display} updateContact={this.updateContact.bind(this)} onDelete={this.deleteContact.bind(this)} />
        );
      });
    }
    return (
      <div className="Table">
        <table>
          <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Relationship</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
          </thead>
          <tbody>
            {display}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
