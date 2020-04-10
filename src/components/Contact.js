import React, { Component } from 'react';
class Contact extends Component {

  static defaultProps = {
    relationship_types: ['', 'Self', 'Acquaintance', 'Co-Worker', 'Coach', 'Friend', 'Parent', 'Sibling', 'Spouse', 'Teacher', 'Other Relative']
  }

  deleteContact(id) {
    let decision = window.confirm('Are you sure you want to delete this contact?');
    //console.log(decision);
    if (decision) {
      this.props.onDelete(id);
    }
    else {
      return;
    }
  }

  editContact(id, person_name, person_relationship, person_phone, person_email) {
    //console.log(id + ", " + person_name + ", " + person_relationship + ", " + person_phone + ", " + person_email);
    this.setState({
      active: true,
      selectedContact: {
        selectedId: id,
        selectedName: person_name,
        selectedRelationship: person_relationship,
        selectedPhone: person_phone,
        selectedEmail: person_email
      }
    });
  }

  validateInput(input, format) {
    let valid = input.search(format);
    return (valid === 0 ? true : false);
  }

  updateName(event) {
    let input = event.target.value;
    let format = /^[A-Za-z\s]+$/;

    let valid = this.validateInput(input, format);

    if (valid) {
      this.setState({
        userInputName: event.target.value,
        nameError: false
      });
    }
    else {
      this.setState({
        nameError: true
      });
    }

  }

  updateRelationship(event) {
    this.setState({
      userInputRelationship: event.target.value
    });
  }

  updatePhone(event) {
    let input = event.target.value;

    if (input !== '') {

      let format = /^[\d()\s-]+$/;
      let valid = this.validateInput(input, format);

      if (valid) {
        this.setState({
          userInputPhone: input,
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
        userInputPhone: null,
        phoneError: false
      })
    }

  }

  updateEmail(event) {
    let input = event.target.value;

    if (input !== '') {

      let format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})$/;
      let valid = this.validateInput(input, format);

      if (valid) {
        this.setState({
          userInputEmail: input,
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
        userInputEmail: null,
        emailError: false
      });
    }
  }

  assignValue(inputValue, selectedValue) {
    let dataValue;

    if (inputValue === '') {
      dataValue = selectedValue;
    }
    else {
      dataValue = inputValue;
    }

    return dataValue;

  }

  checkForChanges(inputValue, selectedValue) {
    if (inputValue !== selectedValue) {
      return true;
    }
    else {
      return false;
    }
  }

  saveContact() {
    let nameError = this.state.nameError;
    let phoneError = this.state.phoneError;
    let emailError = this.state.emailError;

    if (nameError || phoneError || emailError) {
      return;
    }
    else {
      //Form validates, send data:
      let userName = this.assignValue(this.state.userInputName, this.state.selectedContact.selectedName);
      let userRelationship = this.assignValue(this.state.userInputRelationship, this.state.selectedContact.selectedRelationship);
      let userPhone = this.assignValue(this.state.userInputPhone, this.state.selectedContact.selectedPhone);
      let userEmail = this.assignValue(this.state.userInputEmail, this.state.selectedContact.selectedEmail);

      let nameChange = this.checkForChanges(userName, this.state.selectedContact.selectedName);
      let relationshipChange = this.checkForChanges(userRelationship, this.state.selectedContact.selectedRelationship);
      let PhoneChange = this.checkForChanges(userPhone, this.state.selectedContact.selectedPhone);
      let EmailChange = this.checkForChanges(userEmail, this.state.selectedContact.selectedEmail);

      if (nameChange || relationshipChange || PhoneChange || EmailChange) {
        //change made:
        let selectedId = this.state.selectedContact.selectedId;

        this.setState({
          active: false,
          finalEdit: {
            id: selectedId,
            name: userName,
            relationship: userRelationship,
            phone: userPhone,
            email: userEmail
          }
        }, () => {
          this.props.updateContact(this.state.finalEdit);
        });


      }

      this.clearSelection();

    }

  }

  clearSelection() {
    this.setState({
      active: false,
      selectedContact: {
        selectedId: 0,
        selectedName: '',
        selectedRelationship: '',
        selectedPhone: '',
        selectedEmail: ''
      }
    });
  }

  constructor(props){
    super(props);

    this.state = {
      active: false,
      selectedContact: {
        selectedId: 0,
        selectedName: '',
        selectedRelationship: '',
        selectedPhone: '',
        selectedEmail: ''
      },
      userInputId: 0,
      userInputName: '',
      userInputRelationship: '',
      userInputPhone: '',
      userInputEmail: '',
      finalEdit: [],
      nameError: false,
      phoneError: false,
      emailError: false
    }
    this.checkForChanges = this.checkForChanges.bind(this);
    this.assignValue = this.assignValue.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  render() {
    //console.log(this.props.contact);

    let relationship_type_options = this.props.relationship_types.map(relationship_type => {
      return <option key={relationship_type} value={relationship_type}>{relationship_type}</option>
    });

    let count = this.props.count + 1;

    let id = this.props.contact.id;
    let selected_person = this.state.selectedContact.selectedId;

    let person_name = this.props.contact.name;
    let person_relationship = this.props.contact.relationship;
    let person_phone = this.props.contact.phone;
    let person_email = this.props.contact.email;

    let action_button;
    let remove_cancel;

    if (selected_person === id) {
      let selectedName = this.state.selectedContact.selectedName;
      let selectedRelationship = this.state.selectedContact.selectedRelationship;
      let selectedPhone = this.state.selectedContact.selectedPhone;
      let selectedEmail = this.state.selectedContact.selectedEmail;

      person_name = <div>
                    <input type="text" id="name" defaultValue={selectedName} onBlur={this.updateName.bind(this)} maxLength="60" />
                      <p className={this.state.nameError ? 'error' : 'hide'}>Name is invalid. Must be alphabetical.</p>
                    </div>;
      person_relationship = <select id="relationship" defaultValue={selectedRelationship} onChange={this.updateRelationship.bind(this)}>
                              {relationship_type_options}
                            </select>;
      person_phone =  <div>
                        <input type="text" id="phone" defaultValue={selectedPhone} onBlur={this.updatePhone.bind(this)} maxLength="14" />
                        <p className={this.state.phoneError ? 'error' : 'hide'}>Phone is invalid. Must be numerical.</p>
                      </div>;
      person_email =  <div>
                        <input type="email" id="email" defaultValue={selectedEmail} onBlur={this.updateEmail.bind(this)} maxLength="60" />
                        <p className={this.state.emailError ? 'error' : 'hide'}>Email is invalid. Must contain '@' and domain extension.</p>
                      </div>;
      action_button = <button type="button" className="save-button" onClick={this.saveContact.bind(this)}>Save</button>;
      remove_cancel = <button type="button" className="cancel-button" onClick={this.clearSelection.bind(this)}>Cancel</button>;
    }
    else {
      action_button = <button type="button" className="edit" onClick={this.editContact.bind(this, id, person_name, person_relationship, person_phone, person_email)}>Edit</button>;
      remove_cancel = <button type="button" className="remove-contact" onClick={this.deleteContact.bind(this, this.props.contact.id)}>Delete</button>;
    }

    return (
      <tr id={id} className={this.state.active ? 'Contact active' : 'Contact'}>
        <td><b>{count}</b></td>
        <td>{person_name}</td>
        <td>{person_relationship}</td>
        <td>{person_phone}</td>
        <td>{person_email}</td>
        <td>
          {action_button}
          {remove_cancel}
        </td>
      </tr>
    );
  }
}

export default Contact;
