import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
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
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const FilterJobs = props => {
  const {changeEmploymentType, changeSalaryRange} = props
  const renderFilterEmploymentType = () => {
    const {activeEmploymentTypeId} = props
    return employmentTypesList.map(employmentType => {
      const onClickEmploymentType = () =>
        changeEmploymentType(employmentType.employmentTypeId)
      const employmentClassName =
        activeEmploymentTypeId === employmentType.employmentTypeId
          ? `active-employment`
          : ''

      return (
        <li
          key={employmentType.employmentTypeId}
          onClick={onClickEmploymentType}
        >
          <input
            className={employmentClassName}
            type="checkBox"
            id={employmentType.label}
          />
          <label htmlFor={employmentType.label}>{employmentType.label}</label>
        </li>
      )
    })
  }

  const renderFilterSalaryRange = () => {
    const {activeSalaryRangeId} = props

    return salaryRangesList.map(salary => {
      const onClickSalaryRange = () => changeSalaryRange(salary.salaryRangeId)
      const salaryClassName =
        activeSalaryRangeId === salary.salaryRangeId ? `active-salary` : ``
      return (
        <li key={salary.salaryRangeId} onClick={onClickSalaryRange}>
          <input
            className={salaryClassName}
            value={salary.salaryRangeId}
            type="radio"
            name="salary"
            id={salary.salaryRangeId}
          />
          <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
        </li>
      )
    })
  }

  const renderEmploymentType = () => (
    <div>
      <h1>Type of Employment </h1>
      <ul>{renderFilterEmploymentType()}</ul>
    </div>
  )

  const renderSalaryRange = () => (
    <div>
      <h1>Salary Range</h1>
      <ul>{renderFilterSalaryRange()}</ul>
    </div>
  )

  return (
    <div>
      {renderEmploymentType()}
      {renderSalaryRange()}
    </div>
  )
}
export default FilterJobs
