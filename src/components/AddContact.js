import React, { Component } from 'react';
var uuid = require('uuid');
class AddContact extends Component {

  constructor() {
    super();
    this.state = {
      newContact: [],
      addContactForm: false,
      nameError: false,
      phoneError: false,
      emailError: false
    }
    this.addNewContact = this.addNewContact.bind(this);
    this.cancelAddContact = this.cancelAddContact.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  static defaultProps = {
    relationship_types: ['', 'Self', 'Acquaintance', 'Co-Worker', 'Coach', 'Friend', 'Parent', 'Sibling', 'Spouse', 'Teacher', 'Other Relative']
  }

  validateInput(input, format) {
    let valid = input.search(format);
    return (valid === 0 ? true : false);
  }

  validateName(event) {
    let input = event.target.value;
    let format = /^[-'\w\s]+$/;

    let valid = this.validateInput(input, format);

    if (valid) {
      this.setState({
        nameError: false
      });
    }
    else {
      this.setState({
        nameError: true
      });
    }

  }

  validatePhone(event) {
    let input = event.target.value;
    if (input !== '') {

      let format = /^[\d()\s-]+$/;

      let valid = this.validateInput(input, format);

      if (valid) {
        this.setState({
          phoneError: false
        })
      }
      else {
        this.setState({
          phoneError: true
        })
      }
    }
    else {
      this.setState({
        phoneError: false
      })
    }

  }

  validateEmail(event) {
    let input = event.target.value;
    if (input !== '') {

      let format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})$/;

      let valid = this.validateInput(input, format);

      if (valid) {
        this.setState({
          emailError: false
        });
      }
      else {
        this.setState({
          emailError: true
        });
      }
    }
    else {
      this.setState({
        emailError: false
      });
    }
  }

  handleSubmit(e) {
    if (this.refs.name.value === '') {
          alert('Name is a required field.');
    }
    else {
      let nameError = this.state.nameError;
      let phoneError = this.state.phoneError;
      let emailError = this.state.emailError;

      if (nameError || phoneError || emailError) {
        return;
      }
      else {
        //form validates, submit data:
        this.setState({
          newContact: {
            id: uuid.v1(),
            name: this.refs.name.value,
            relationship: this.refs.relationship.value,
            phone: this.refs.phone.value,
            email: this.refs.email.value
          }
        }, () => {
            this.setState({
              addContactForm: false
            });
            this.resetForm();
            //console.log("new contact: " + this.state.newContact.name)
            this.props.addContact(this.state.newContact);
        });
      }
    }
    e.preventDefault();
  }

  addNewContact() {
    this.setState({
      addContactForm: true
    });
  }

  cancelAddContact(e) {
    this.setState({
      addContactForm: false
    }, () => {
      this.resetForm();
    });
    e.preventDefault();
  }

  resetForm() {
    this.refs.name.value = '';
    this.refs.relationship.value = '';
    this.refs.phone.value = '';
    this.refs.email.value = '';
  }

  render() {
      //console.log("total contacts: ", this.props.total);

      let relationship_type_options = this.props.relationship_types.map(relationship_type => {
        return <option key={relationship_type} value={relationship_type}>{relationship_type}</option>
      });
      return(
       <div>
          <div className={this.state.addContactForm ? 'hide' : 'show'}>
            <button className="add-contact-button" onClick={this.addNewContact}>Add Contact</button>
          </div>
          <div className={this.state.addContactForm ? 'show' : 'hide'}>
            <h3>Add Contact</h3>
            <form className="add-contact-form" onSubmit={this.handleSubmit.bind(this)}>
              <div>
                <label>Name: </label>
                <input type="text" ref="name" onChange={this.validateName.bind(this)} maxLength="60" />
                <p className={this.state.nameError ? 'error' : 'hide'}>Name is invalid. Must be alphabetical.</p>
              </div>
              <div>
                <label>Relationship: </label>
                <select ref="relationship">
                  {relationship_type_options}
                </select>
              </div>
              <div>
                <label>Phone: </label>
                <input type="text" ref="phone" onChange={this.validatePhone.bind(this)} maxLength="14" />
                <p className={this.state.phoneError ? 'error' : 'hide'}>Phone is invalid. Must be numerical.</p>
                <p className={this.state.phoneNumbersError ? 'error' : 'hide'}>Phone is invalid. Must contain 10 numbers.</p>
              </div>
              <div>
                <label>Email: </label>
                <input type="text" ref="email" onBlur={this.validateEmail.bind(this)} maxLength="60" />
                <p className={this.state.emailError ? 'error' : 'hide'}>Email is invalid. Must contain '@' and domain extension.</p>
              </div>
              <input type="submit" className="add-contact-button" value="Add Contact" />
              <button className="cancel-add-contact" onClick={this.cancelAddContact}>Cancel</button>
            </form>

        </div>
     </div>

      );
  }
}

export default AddContact;
