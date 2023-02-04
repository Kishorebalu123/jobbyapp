import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobCard'
import FilterJobs from '../FilterJobs'
import './index.css'

const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    activeEmploymentType: '',
    activeSalaryRange: '',
    jobsList: [],
    profileDetails: [],
    profileApiStatus: profileApiStatusConstants.initial,
    jobsApiStatus: jobsApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobsApi()
    this.getProfileApi()
  }

  getProfileApi = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      //  console.log(fetchedData)
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }

    //  console.log(fetchedData.profile_details)
  }

  getJobsApi = async () => {
    this.setState({jobsApiStatus: jobsApiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const {activeEmploymentType, activeSalaryRange, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    //   console.log(fetchedData)
    if (response.ok) {
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      //   console.log(updatedData)
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: jobsApiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderGetJobs = () => {
    const {jobsList} = this.state
    return (
      <ul>
        {jobsList.map(eachJob => (
          <JobCard jobCard={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div>
      <h1>failure</h1>
    </div>
  )

  renderProfileFailureView = () => (
    <div>
      <h1>profilefailure</h1>
    </div>
  )

  renderJobsSection = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case 'SUCCESS':
        return this.renderGetJobs()

      case 'FAILURE':
        return this.renderFailureView()
      case 'IN_PROGRESS':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileSection = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case 'SUCCESS':
        return this.renderGetProfile()

      case 'FAILURE':
        return this.renderProfileFailureView()
      case 'IN_PROGRESS':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderGetProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div>
        <img src={profileImageUrl} alt="" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getFilteredJobs = () => {
    const {jobsList, searchInput} = this.state
    const filteredJobs = jobsList.filter(
      each => each.title.toLowerCase() === searchInput.toLowerCase(),
    )
    this.setState({jobsList: filteredJobs}, this.getJobsApi)
  }

  changeEmploymentType = activeEmploymentType => {
    this.setState({activeEmploymentType}, this.getJobsApi)
  }

  changeSalaryRange = activeSalaryRange => {
    this.setState({activeSalaryRange}, this.getJobsApi)
  }

  render() {
    const {searchInput, activeEmploymentType, activeSalaryRange} = this.state
    //  console.log(searchInput)
    return (
      <>
        <Header />
        <div className="bg-card">
          <div className="bg-profile">
            <div>{this.renderProfileSection()}</div>
            <hr className="line" />

            <FilterJobs
              activeEmploymentTypeId={activeEmploymentType}
              activeSalaryRangeId={activeSalaryRange}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
            />
          </div>
          <div className="bg-jobs">
            <div>
              <input
                onChange={this.onChangeInput}
                value={searchInput}
                type="search"
                placeholder="Search"
                className="search-input"
              />
              <button
                onClick={this.getFilteredJobs}
                type="button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.renderJobsSection()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
