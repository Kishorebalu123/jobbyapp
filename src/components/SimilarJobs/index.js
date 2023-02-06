import './index.css'

const SimilarJobs = props => {
  const {similarJob} = props
  const {
    location,
    employmentType,
    companyLogoUrl,
    title,
    rating,
    jobDescription,
  } = similarJob

  return (
    <li>
      <div>
        <div>
          <img src={companyLogoUrl} alt="similar job company logo" />
          <div>
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <div>
          <p>{location}</p>
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
