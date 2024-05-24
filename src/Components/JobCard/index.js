import {Link} from 'react-router-dom'

import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobData
  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1>{title}</h1>
          </div>
          <div className="rating-container">
            <BsStarFill />
            <p className="rating">{rating}</p>
          </div>
        </div>
        <div className="location-package-container">
          <div className="loaction-container">
            <MdLocationOn />
            <p>{location}</p>
          </div>
          <div>
            <BsFillBriefcaseFill />
            <p>{employmentType}</p>
          </div>
        </div>
        <p>{packagePerAnnum}</p>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
