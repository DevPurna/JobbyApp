import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    jobDetails: null,
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})

    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const jobDetailsData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        title: fetchedData.job_details.title,
        lifeAtCompany: {
          description: fetchedData.job_details.life_at_company.description,
          imageUrl: fetchedData.job_details.life_at_company.image_url,
        },
        skills: fetchedData.job_details.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
      }

      const similarJobsData = fetchedData.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobDetails: jobDetailsData,
        similarJobs: similarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something went wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.fetchJobDetails}
        type="button"
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state

    return (
      <div className="jobDetails-bg-container">
        <div className="jobDetails-container">
          <div className="logo-position-container">
            <img
              src={jobDetails.companyLogoUrl}
              className="jobCard-company-logo"
              alt="job details company logo"
            />
            <div className="rating-position-container">
              <h1 className="jobcard-title">{jobDetails.title}</h1>
              <p className="jobCard-rating">
                <FaStar className="jobCard-rating-star-icon" />
                {jobDetails.rating}
              </p>
            </div>
          </div>
          <div className="loaction-workType-package-container">
            <div className="loaction-workType-container">
              <p className="jobCard-loaction">
                <MdLocationOn className="jobCard-loaction-icon" />
                {jobDetails.location}
              </p>
              <p className="jobCard-worktype">
                <MdWork className="jobCard-workType-icon" />
                {jobDetails.employmentType}
              </p>
            </div>
            <p className="jobCard-package">{jobDetails.packagePerAnnum}</p>
          </div>
          <hr className="jobCard-hr-line" />
          <div className="description-visit-link-container">
            <h1 className="description-heading">Description</h1>
            <div className="anchor-element-container">
              <a
                href={jobDetails.companyWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-link-text"
              >
                Visit <FaExternalLinkAlt />
              </a>
            </div>
          </div>
          <p className="jobCard-jobDescription">{jobDetails.jobDescription}</p>
          <h3>Skills</h3>
          <ul className="skills-ul">
            {jobDetails.skills.map(eachSkill => (
              <li className="skills-listItem" key={eachSkill.name}>
                <img alt={eachSkill.name} src={eachSkill.imageUrl} />
                <p className="skills-name-text">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <div className="life-at-company-container">
            <div>
              <h2>Life at Company</h2>
              <p>{jobDetails.lifeAtCompany.description}</p>
            </div>
            <img
              src={jobDetails.lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-comapny-image"
            />
          </div>
        </div>
        <h2>Similar Jobs</h2>
        <ul className="similarJobs-ul">
          {similarJobs.map(job => (
            <li className="similarJobs-listItem" key={job.id}>
              <img
                className="similarjob-company-logo"
                src={job.companyLogoUrl}
                alt="similar job company logo"
              />
              <div>
                <h1>{job.title}</h1>
                <p>
                  <FaStar className="jobCard-rating-star-icon" /> {job.rating}
                </p>
              </div>
              <h3>Description</h3>
              <p>{job.jobDescription}</p>
              <div>
                <p>
                  <MdLocationOn className="jobCard-loaction-icon" />
                  {job.location}
                </p>
                <p>
                  <MdWork className="jobCard-workType-icon" />
                  {job.employmentType}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderApiStatusCalls = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderJobDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        {this.renderApiStatusCalls()}
      </div>
    )
  }
}

export default withRouter(JobDetails)
