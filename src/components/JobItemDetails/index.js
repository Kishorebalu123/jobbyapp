import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import SimilarJobs from '../SimilarJobs'
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
        //   skills: jobDetails.skills,
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

      this.setState({
        jobDetails: updatedData,
        similarJobs: updateSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div>
      <h1>failure</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      //  companyWebsiteUrl,
      employmentType,
      jobDescription,
      //    lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      // skills,
      title,
    } = jobDetails

    return (
      <>
        <div>
          <div>
            <img src={companyLogoUrl} alt="" />
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

          <p>Description</p>
          <p>{jobDescription}</p>
          {/*      <p>Skills</p>
        <p>{skills}</p>
        <div>
          <div>
            <p>Life at Company</p>
            <p>{lifeAtCompany}</p>
          </div>
          <img src={companyWebsiteUrl} alt="" />
        </div>
        */}
        </div>

        <div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobs.map(eachItem => (
              <SimilarJobs similarJob={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </>
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
    return <div>{this.renderJobSection()}</div>
  }
}

export default JobItemDetails
