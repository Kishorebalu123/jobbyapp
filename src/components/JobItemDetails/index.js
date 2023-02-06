import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import SimilarJobs from '../SimilarJobs'
import Skills from '../Skills'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarJobs: [],
    skills: [],
    lifeAtCompany: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
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
      const jobDetails = fetchedData.job_details

      const updatedData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        //     lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        //  skills: jobDetails.skills,
        title: jobDetails.title,
      }
      //    console.log(updatedData)
      const updateSimilarJobs = fetchedData.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      const updateSkills = fetchedData.job_details.skills.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))

      const updateLifeAtCompany = {
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
      }

      this.setState({
        jobDetails: updatedData,
        similarJobs: updateSimilarJobs,
        skills: updateSkills,
        lifeAtCompany: updateLifeAtCompany,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        className=""
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.getJobData} type="button">
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs, skills, lifeAtCompany} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,

      title,
    } = jobDetails

    return (
      <div>
        <div>
          <div>
            <img src={companyLogoUrl} alt="job details company logo" />
            <div>
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
          </div>
          <div>
            <p>{location}</p>
            <p>{employmentType}</p>
            <p>{packagePerAnnum}</p>
          </div>
          <div>
            <h1>Description</h1>
            <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
              Visit
            </a>
          </div>
          <p>{jobDescription}</p>
          <ul>
            <h1>Skills</h1>
            {skills.map(eachSkill => (
              <Skills skill={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1>Life at Company </h1>
          <div>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>

        <div>
          <ul>
            <h1>Similar Jobs</h1>
            {similarJobs.map(eachItem => (
              <SimilarJobs similarJob={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobSection = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderJobDetails()
      case 'FAILURE':
        return this.renderFailureView()
      case 'IN_PROGRESS':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    //   console.log(similarJobs)
    return (
      <div data-testid="loader">
        <Header />
        <div>{this.renderJobSection()}</div>
      </div>
    )
  }
}

export default JobItemDetails
