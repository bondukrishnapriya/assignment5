import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import SimilarJobs from '../SimilarJobs'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }
  componentDidMount() {
    this.getJobsData()
  }
  getJobData = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiSattus: apiStatusConstants.inProgress})
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
      const data = await response.json()
      const updatedData = [data.job_details].map(eachItem => ({
        comapanyLogoUrl: eachItem.company_logo_url,

        comapanyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employmet_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.image_url,
        },
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
        packagesPerAnnum: eachItem.package_per_annum,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }))
      const updatedSimilarJobDetails = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employmen_type,
        id: data.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobDataDetails: updatedData,
        similarJobData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }
  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    if (jobDataDetails.length >= 1) {
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
      } = jobDataDetails[0]
      return (
        <div className="job-item-container">
          <div className="first-part-container">
            <div className="img-title-container">
              <img
                className="comapny-logo"
                src={companyLogoUrl}
                alt="job details comapny logo"
              />
              <div className="title-rating-container">
                <h1 className="heading">{title}</h1>

                <div className="star-rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating-text">{rating}</p>
                </div>
              </div>
            </div>
            <div>
              <BsFillBriefCaseFill className="breif-case-icon" />
              <p className="employment-type">{employmentType}</p>
            </div>
            <p className="package-heading">{packagePerAnnum}</p>
            <MdLocationOn />
            <p>{location}</p>
            <hr />
            <div className="des-visit-container">
              <h1 className="description-heading">Description</h1>
              <div className="visit-container">
                <a href={companyWebsiteUrl} className="visit-heading">
                  Visit <BiLinkExternal />
                </a>
                <p className="description-name">{jobDescription}</p>
                <h1>Skills</h1>
                <ul>
                  {skills.map(eachItem => (
                    <li className="li-job" key={eachItem.name}>
                      <img src={eachItem.imageUrl} alt="eachItem.name" />
                      <p className="item-name">{eachItem.name}</p>
                    </li>
                  ))}
                </ul>
                <h1>Life at Company</h1>
                <div>
                  <p>{lifeAtCompany.description}</p>
                  <img
                    src={lifeAtCompany.imageUrl}
                    alt="life at company"
                    className="life-at-company-img"
                  />
                </div>
              </div>
            </div>
          </div>
          <ul className="simlar-jobs-list">
            {similarJobsData.map(eachSimilarJob => (
              <SimilarJobs
                similarJobData={eachSimilarJob}
                key={eachSimilarJob.id}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }
  onRetryJobDetailsAgain = () => {
    this.getJobsData()
  }
  renderJobFailureView = () => (
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
        onClick={this.onRetryJobDetailsAgain}
      >
        Retry
      </button>
    </div>
  )
  renderJobLoadingView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )
  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoadingView()
      default:
        return null
    }
  }
  render() {
    retrun(
      <div className="job-details-view-container">
        <Header />
        {this.renderJobDetails()}
      </div>,
    )
  }
}
export default AboutJobItem
