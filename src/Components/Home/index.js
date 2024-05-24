import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p>
          Millons of people are seraching for jobs,salary,inforamation,company
          reviews.Findthe job that fits your abilities and potential
        </p>
        <Link to="/jobs">
          <button className="find-jobs-button" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)
export default Home
