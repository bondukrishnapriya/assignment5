import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import SimilarJobItem from '../SimilarJobItem'

import SkillCard from '../SkillCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobsData()
  }

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employmen_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    comapanyWebsiteUrl: data.company_website_url,
    employmentType: data.employmet_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagesPerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobData = async props => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSimilarJobsData = data.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSimilarData(eachSimilarJob),
      )
      this.setState({
        jobData: updatedData,
        similarJobData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="job-item-error-view-container">
      <img src="" alt="failure view" className="job-item-failure-img" />
      <h1 className="job-item-failure-heading-text">
        Opps Something Went wrong
      </h1>
      <p className="job-item-failure-button">
        We cannot seem to find the page you are lookinf for
      </p>
      <button
        type="button"
        id="button"
        className="job-item-failure-button"
        onClick={this.getJobData}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-view-container">
        <div className="job-item">
          <div className="logo-title-location-container">
            <div className="logo-title-conatiner">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="comapany-logo"
              />
              <div className="title-logo-container">
                <h1 className="title-heading">{title}</h1>
                <div className="title-rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating-heading">{rating}</p>
                </div>
              </div>
              <div className="location-package-container">
                <div>
                  <MdLocationOn className="location-icon" />
                  <p className="location">{location}</p>
                </div>
                <div>
                  <BsFillBriefcaseFill className="breif-case-icon" />
                  <p className="employment-type">{employmentType}</p>
                </div>
              </div>
              <p className="package-heading">{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="des-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="visit-heading">
                Visit
              </a>
              <BiLinkExternal className="visit-icons" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="heading-skills">Skills</h1>
          <ul className="skill-list-container">
            {skills.map(eachSkill => (
              <SkillCard skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div>
            <p>{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-data">Similar Jobs</h1>
        <ul className="simlar-jobs-list">
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobItem
              jobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-view-container">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}
export default JobItemDetails
