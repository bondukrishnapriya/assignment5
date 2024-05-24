import {BsSearch} from 'react-icons/bs'

import ProfileDetails from '../ProfileDetails'

import './index.css'

const FiltersGroup = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }
  const onEnterSearchInput = event => {
    const {getJobs} = props
    if (event.key === 'Enter') {
      getJobs()
    }
  }
  const onRenderSearchInput = () => {
    const {getJobs, searchInput} = props
    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button
          type="button"
          id="searchInput"
          className="search-button-container"
          onClick={getJobs}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }
  const renderTypeOfEmployment = () => {
    const {employmentTypesList} = props
    return (
      <div className="employment-type-list">
        <h1 className="heading">Type of employment</h1>
        <ul className="employe-type-list">
          {employmentTypesList.map(eachEmployeeType => {
            const {changeEmployeeList} = props
            const onSelectEmployeeType = event => {
              changeEmployeeList(event.target.value)
            }
            return (
              <li
                className="employee-item"
                key={eachEmployeeType.employmentTypeId}
                onChange={onSelectEmployeeType}
              >
                <input
                  type="checkbox"
                  id={eachEmployeeType.employmentTypeId}
                  value={eachEmployeeType.employmentTypeId}
                />
                <label>{eachEmployeeType.label}</label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  const renderSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div className="salary-range-container">
        <h1 className="heading">Salaryrange</h1>
        <ul className="salaryrangesList">
          {salaryRangesList.map(eachSalary => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(eachSalary.salaryRangeId)
            }
            return (
              <li
                className="salary-item"
                key={eachSalary.salaryRangeId}
                onClick={onClickSalary}
              >
                <input
                  type="radio"
                  id={eachSalary.salaryRangeId}
                  name="salary"
                  className="chackbox-input"
                />
                <label>{eachSalary.label}</label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  return (
    <div className="filter-group-container">
      {onRenderSearchInput()}
      <ProfileDetails />
      <hr />
      {renderTypeOfEmployment()}
      <hr />
      {renderSalaryRange()}
    </div>
  )
}
export default FiltersGroup
