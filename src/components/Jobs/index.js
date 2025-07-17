import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobCard from '../JobCard'
import ProfileData from '../ProfileData'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

class Jobs extends Component {
  state = {
    selectedEmploymentTypes: [],
    activeSalaryRangeId: '',
    userInput: '',
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const jwtToken = Cookies.get('jwt_token')
    const {selectedEmploymentTypes, activeSalaryRangeId, userInput} = this.state

    const employmentTypesQuery = selectedEmploymentTypes.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesQuery}&minimum_package=${activeSalaryRangeId}&search=${userInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        id: job.id,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  toggleEmploymentType = employmentTypeId => {
    this.setState(prevState => {
      const {selectedEmploymentTypes} = prevState
      let updatedEmploymentTypes

      if (selectedEmploymentTypes.includes(employmentTypeId)) {
        updatedEmploymentTypes = selectedEmploymentTypes.filter(
          id => id !== employmentTypeId,
        )
      } else {
        updatedEmploymentTypes = [...selectedEmploymentTypes, employmentTypeId]
      }

      return {selectedEmploymentTypes: updatedEmploymentTypes}
    }, this.getJobsList)
  }

  onClickSalaryRangeId = id => {
    this.setState({activeSalaryRangeId: id}, this.getJobsList)
  }

  renderNoJobsView = () => (
    <div className="noJobsView-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-found"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderGetJobsList = () => {
    const {jobsList, apiStatus} = this.state

    // Show loader while fetching data
    if (apiStatus === 'PROGRESS') {
      return this.renderLoader()
    }

    // Show "No Jobs Found" view if no jobs exist
    if (!jobsList || jobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`} className="job-link">
              <JobCard jobData={job} />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  onChangeUserInput = event => {
    this.setState({userInput: event.target.value})
  }

  onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  onClickRetry = () => {
    this.getJobsList()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="filure-img"
      />
      <h1>Oops! Something went wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={this.onClickRetry}
        type="button"
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderApiStatusCalls = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderGetJobsList()
      default:
        return null
    }
  }

  render() {
    const {selectedEmploymentTypes, userInput} = this.state
    return (
      <div className="Jobs-background-container">
        <Header />
        <div className="jobs-and-sorting-container">
          <div className="sorting-container">
            <ProfileData />
            <hr className="sorting-horizontal-line" />
            <h1 className="ul-heading">Type of Employment</h1>
            <ul className="employmentTypesList-ul">
              {employmentTypesList.map(eachOption => (
                <li className="ul-listItem" key={eachOption.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachOption.employmentTypeId}
                    value={eachOption.employmentTypeId}
                    checked={selectedEmploymentTypes.includes(
                      eachOption.employmentTypeId,
                    )}
                    onChange={() =>
                      this.toggleEmploymentType(eachOption.employmentTypeId)
                    }
                  />
                  <label htmlFor={eachOption.employmentTypeId}>
                    {eachOption.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="heading-salary-range">Salary Range</h1>
            <ul className="salaryRangesList-ul">
              {salaryRangesList.map(range => (
                <li key={range.id}>
                  <label
                    onClick={() =>
                      this.onClickSalaryRangeId(range.salaryRangeId)
                    }
                    style={{cursor: 'pointer'}}
                  >
                    <input type="radio" name="salary" value={range.id} />
                    {range.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobsList-and-searchInput-BG-container">
            <div className="job-search-input-container">
              <input
                placeholder="Search"
                type="search"
                className="jobs-search-element"
                onChange={this.onChangeUserInput}
                value={userInput}
                onKeyDown={this.onKeyDownSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="job-search-bar"
                onClick={this.getJobsList}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-Container">{this.renderApiStatusCalls()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
