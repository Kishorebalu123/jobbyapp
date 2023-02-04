import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {showSubmitError: false, errorMsg: '', username: '', password: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitBtn = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  renderPasswordDetails = () => {
    const {password} = this.state
    return (
      <div>
        <label htmlFor="password">PASSWORD</label>
        <input
          value={password}
          className="password-input"
          type="password"
          id="password"
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  renderUserDetails = () => {
    const {username} = this.state
    return (
      <div>
        <label htmlFor="username">USERNAME</label>
        <input
          className="user-name"
          type="text"
          value={username}
          id="username"
          onChange={this.onChangeUsername}
        />
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <div>
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
          />
        </div>
        <form className="form-control" onSubmit={this.onSubmitBtn}>
          <div>{this.renderUserDetails()}</div>
          <div>{this.renderPasswordDetails()}</div>

          <div>
            <button type="submit">Login</button>
          </div>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
