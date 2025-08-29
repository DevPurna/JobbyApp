import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

class ProfileData extends Component {
  state = {profileData: null, isLoading: true, isError: false}

  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({isLoading: true, isError: false}) // Reset state before fetching

    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(profileApiUrl, options)
      if (response.ok) {
        const profileData = await response.json()
        const updatedData = {
          name: profileData.profile_details.name,
          profileImageUrl: profileData.profile_details.profile_image_url,
          shortBio: profileData.profile_details.short_bio,
        }
        this.setState({profileData: updatedData, isLoading: false})
      } else {
        this.setState({isError: true, isLoading: false})
      }
    } catch (error) {
      this.setState({isError: true, isLoading: false})
    }
  }

  renderFailureView = () => (
    <button
      onClick={this.getProfileData}
      className="retry-button"
      type="button"
    >
      Retry
    </button>
  )

  // eslint-disable-next-line class-methods-use-this
  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileData} = this.state
    return (
      <div className="jobs-profile-container">
        <img src={profileData.profileImageUrl} alt="profile" />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.shortBio}</p>
      </div>
    )
  }

  render() {
    const {isLoading, isError, profileData} = this.state

    if (isLoading) {
      return this.renderLoader()
    }

    if (isError) {
      return this.renderFailureView()
    }

    return profileData ? this.renderProfile() : null
  }
}

export default ProfileData
