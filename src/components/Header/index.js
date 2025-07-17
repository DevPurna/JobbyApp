import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="header-website-logo"
          alt="website logo"
        />
      </Link>
      <ul className="header-routes-container">
        <li>
          <Link to="/" className="header-nav-link">
            <p className="header-link-text">Home</p>
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="header-nav-link">
            <p className="header-link-text">Jobs</p>
          </Link>
        </li>
      </ul>
      <button
        onClick={onClickLogout}
        className="header-logout-btn"
        type="button"
      >
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
