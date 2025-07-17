import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'

import './index.css'

const JobCard = ({jobData}) => {
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <div className="JobCard-container">
      <div className="logo-position-container">
        <img
          src={companyLogoUrl}
          className="jobCard-company-logo"
          alt="website logo"
        />
        <div className="rating-position-container">
          <h1 className="jobcard-title">{title}</h1>
          <p className="jobCard-rating">
            <FaStar className="jobCard-rating-star-icon" /> {rating}
          </p>
        </div>
      </div>
      <div className="loaction-workType-package-container">
        <div className="loaction-workType-container">
          <p className="jobCard-loaction">
            <MdLocationOn className="jobCard-loaction-icon" /> {location}
          </p>
          <p className="jobCard-worktype">
            <MdWork className="jobCard-workType-icon" />
            {employmentType}
          </p>
        </div>
        <p className="jobCard-package">{packagePerAnnum}</p>
      </div>
      <hr className="jobCard-hr-line" />
      <h1 className="description-heading">Description</h1>
      <p className="jobCard-jobDescription">{jobDescription}</p>
    </div>
  )
}

export default JobCard
