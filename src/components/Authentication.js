import React, {Component} from 'react';
import '../App.css';
import eye_open from '../assets/eye-open-icon.png';
import eye_closed from '../assets/eye-closed-icon.png';
var firebase = require('firebase');


class Authentication extends Component {

  login(event) {
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);

    //handle login promise:
      promise.then(user => {

          this.setState({
            authenticated: true,
            error: ''
          }, () => {
            this.props.login(this.state.authenticated, this.state.error);
          });

      });

      promise.catch(e => {
        var error = e.message;
        this.setState({
          error
        }, () => {
          this.props.login(this.state.authenticated, this.state.error)
        });
      });

 }

 showPassword(event) {
   this.setState({
     showPassword: !this.state.showPassword
   })
 }

 updatePassword() {
   let password = this.refs.password.value;

   this.setState({
     password
   })

 }

 constructor(props){
   super(props);

   this.state = {
     authenticated: false,
     error: '',
     loading: true,
     display: [],
     password: '',
     showPassword: false
   };
   this.login = this.login.bind(this);
 }


  render(){

      return(
                  <div className="main-container">
                    <h1>Contact List</h1>
                    <h3>Login</h3>
                    <div>
                    <input id="email" ref="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <input id="password" ref="password" type={this.state.showPassword ? 'text' : 'password'} onChange={this.updatePassword.bind(this)} placeholder="Enter your password" />
                      <button onClick={this.showPassword.bind(this)}>
                        <img src={this.state.showPassword ? eye_open : eye_closed} alt={this.state.showPassword ? 'Hide Password' : 'Show Password'} title={this.state.showPassword ? 'Hide Password' : 'Show Password'}/>
                      </button>
                    </div>
                    <div>
                      <button onClick={this.login} className="login">Log In</button>
                    </div>
                    <div>
                    <div>
                      <p className={this.state.error ? 'show error' : 'hide' }>{this.state.error}</p>
                    </div>
                    </div>
                  </div>
      );
    }

}

export default Authentication;
