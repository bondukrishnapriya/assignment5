import {Component} from 'react'

import './index.css'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', showSubmitErr: false, errorMsg: ''}

  onChangeUserName = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_Toekn', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitErr: true})
  }

  onSubmitForm = async event => {
    event.prventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitErr, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-webiste-logo"
          />
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              className="username-input-field"
              onChange={this.onChangeUsername}
            />
            <label className="password-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
              className="password-input-field"
            />
            <button className="button-login" type="submit">
              Login
            </button>
            {showSubmitErr && <p className="error-message">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}
export default Login
