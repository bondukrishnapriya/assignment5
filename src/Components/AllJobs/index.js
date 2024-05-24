import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {AiOutLineSearch} from 'react-icons/ai'

import Header from './Header'

import JobItem from '..JobItem'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time',
   employmentTypeId: 'FULL TIME'},
  {
    label: 'Part Time',
    employmentTypeId: 'PART TIME',
  },
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {salaryRangeId: '40000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkBoxInput: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
  }
  componentDidMount = () => {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }
  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },

      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)
    if (responseProfile.ok === true) {
      const data = [await responseProfile.json()]
      const updatedData = data.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedData,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } 
    else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }
  onGetJobDetails = async () => {
    this.setState({apiJobsStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkBoxInput, radioInput, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employement_type=${checkBoxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsData: updatedJobsData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } 
    else {
      this.setState({
        apiJobsStatus: apiJobsStatusConstants.failure,
      })
    }
  }
  onGetRadioInput = event => {
    this.setState({radioInput: event.taget.id}, this.onGetJobDetails)
  }
  onGetInputOption = event => {
    const {checkBoxInputs} = this.state
    const inputNotInList = checkBoxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } 
    else {
      const filteredData = checkBoxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState
        ({
          checkBoxInputs: filteredData,
        },
        this.onGetJobDetails)
      
    }
  }
  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} className="profile-icon" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p>{shortBio}</p>
        </div>
      )
    }
    return null
  }
  onRetryProfile = () => {
    this.onGetProfileDetails()
  }
  onGetProfileFailureView = () => (
    <div className="failure-button">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        retry
      </button>
    </div>
  )
  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeaDots" color="#ffffff" height="50" width="50" />
    </div>
  )
  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      default:
        return null
    }
  }
  onRetryJobs = () => {
    this.onGetJobDetails()
  }
  onGetJobsFailureView = () => (
    <div className="failure-view">
      <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view" className="jobs-failure-img" />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="failure=description">
        We cannot seem to page you re looking or
      </p>
      <button
        className="jobs-button"
        onClick={this.getJobs}
        data-testid="button"
      >
        Retry
      </button>
    </div>
  )
   onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length > 0
    return noJobs ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsData.map(job => (
            <JobItem jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="n--jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs.Try other filters
        </p>
      </div>
    )}
    onRenderJobsStatus=()=>{
      const {apiJobsStatus}=this.state
      switch(apiJobsStatus){
        case apiJobsStatusConstants.success:
          return this.onGetJobsView()
        case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
        case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
        default:
        return null
        }
      }

    }
    onGetCheckBoxesView=()=>(
      <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem=>(
        <li key={eachItem.employmentId}>
        <input className="input" id={eachItem.employmentId} type="checkbox" onChange={this.onGetInputOption}/>
        <label className="label" htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}</ul>
    )
    onGetRadioButtonsView=()=>{
      <ul className="radio-button-container">{salaryRangesList.map(eachItem=>(<li key={eachItem.salaryRangeId}>
      <input type="radio" name="option" id={eachItem.salaryRangeId} onChange={this.onGetRadioOption}/>
      <label className="label" htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label></li>))}</ul>
    }
    onGetSearchInput=()=>{
      this.setState({searchInput:event.target.value})
   }
   onSubmitSearchInput=()=>{
    this.onGetJobDetails()
   }
   onEnterSearchInput=event=>{
    if(event.key==="Enter"){
      this.onGetJobDetails()
    }
   }
  render() {
    const {searchInput}=this.state
      return(
        <>
        <Header/>
        <div className="all-jobs-container">
        {this.onRenderProfileStatus()}
        <hr className="hr-line"/>
        <h1 className="text">Type of Employment</h1>
        {this.onGetCheckBoxesView()}
        <hr/>
        {this.onGetRadioButtonsView()}
        </div>
        <div className="jobs-container">
        <input type="search" value={searchInput} placeholdeer="Search" onChange={this.onGetSearchinput} onKeyDown={this.onEnterSearchInput}/>
        <button data-testid="button" type="button" className="search-input" onClick={this.onSubmitSearchInput}>
        <AiOutLineSearch className="search-icon"/></button></div>
        {this.onRenderJobsStatus()}
        </>
      )
    }
 } 
  export default AllJobs 
  
  
  
   
  

