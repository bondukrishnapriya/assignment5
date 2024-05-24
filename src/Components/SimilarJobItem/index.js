import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    rating,
    title,
    location,
  } = jobDetails
  return (
    <li className="similar-job-item">
      <div className="logo-title-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="comapny-logo"
        />
        <div>
          <h1>{title}</h1>
        </div>
        <div>
          <BsStarFill />
          <p>{rating}</p>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <MdLocationOn />
      <p>{location}</p>
      <div>
        <BsFillBriefcaseFill />
        <p>{employmentType}</p>
      </div>
    </li>
  )
}
export default SimilarJobItem
