import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobCard} = props
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    packagePerAnnum,
    location,
    jobDescription,
    employmentType,
  } = jobCard

  return (
    <Link to={`/jobs/${id}`}>
      <li>
        <div>
          <div>
            <img src={companyLogoUrl} alt="company logo" />
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
          <hr />
          <p>Description</p>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobCard
