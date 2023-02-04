import './index.css'

const SimilarJobs = props => {
  const {similarJob} = props
  const {companyLogoUrl, title, rating, jobDescription} = similarJob

  return (
    <li>
      <div>
        <div>
          <img src={companyLogoUrl} alt="" />
          <div>
            <p>{title}</p>
            <p>{rating}</p>
          </div>
        </div>
        <p>Description</p>
        <p>{jobDescription}</p>
      </div>
    </li>
  )
}
export default SimilarJobs
