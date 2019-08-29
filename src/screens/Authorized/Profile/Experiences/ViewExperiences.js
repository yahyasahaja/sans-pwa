import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import Chip from '@material-ui/core/Chip'
import moment from 'moment'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import MDIcon from '../../../../components/MDIcon'
import profileState from '../profileState'
import ViewRoute from '../../../../components/ViewRoute'

const Container = styled.div`
  display: block;
  padding: 20px;

  .more-info {
    margin-top: 20px;
  }
  
  .main {
    display: flex;

    .main-info {
      display: block;
      margin-left: 20px;

      .position {
        font-size: 20pt;
        font-weight: 300;
      }

      .company {
        font-size: 15pt;
      }
    }

    .image {
      width: 150px;
      height: 150px;
      border: 5px solid white;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 1px 8px 11px 0px #00000038;
      background: white;

      span {
        height: 100%;
        display: block !important;

        img {
          height: 100%;
        }
      }
    }
  }
`

let experience = {
  company: "company",
  description: "description",
  endDate: "2019-07-29T08:10:23.263+0000",
  location: "Osaka, Japan",
  position: "Software Developer",
  skills: [{skillName: "Java"}],
  startAt: "2019-07-29T08:10:23.261+0000",
}

@observer
class ViewExperiences extends Component {
  @observable experience = null
  @observable isFetchingExperience = false

  componentDidMount() {
    this.fetchExperience()
  }

  fetchExperience() {
    // console.log(this.props.location.state)

    let { location: { state } } = this.props
    if (state && state.experience) {
      this.experience = state.experience
      return
    } else {
      this.isFetchingExperience = true
    }

    try {
      this.experience = experience

      this.isFetchingExperience = false
    } catch (err) {
      this.isFetchingExperience = false
      console.log('ERROR WHILE FETCHING EXPERIENCE', err)
    }
  }

  render() {
    if (!this.experience) return <div>Loading</div>

    let ex = this.experience

    return (
      <ViewRoute 
        onSubmit={this.onSubmit}
        isLoading={profileState.isUpdatingGeneralProfile}
        title="Edit Profile" 
        backPath="/customers/profile"
        close={close => this.close = close} >
        <Container>
          <div className="main" >
            <div className="image" >
              <LazyLoadImage
                alt="cover"
                placeholderSrc="/images/flat-pp.jpg"
                src={ex.companyLogoUrl} 
              />
            </div>

            <div className="main-info" >
              <div className="position" >{ex.position}</div>
              <div className="company" >{ex.company}</div>
              <div className="location" ><MDIcon icon="map-marker" /> {ex.location}</div>
            </div>
          </div>
          <div className="more-info" >
            <div className="date" >
              {moment(ex.startAt).calendar()} - {moment(ex.endDate).calendar()}
            </div>
            
            <div className="description" >{ex.description}</div>
            <h3>Skills</h3>
            <div className="skills" >
              {ex.skills && ex.skills.map((s, i) => (
                <Chip
                  key={i}
                  label={s.skillName}
                  color="primary"
                  style={{margin: '0 5px'}}
                />
              ))}
            </div>
          </div>
        </Container>
      </ViewRoute>
    )
  }
}

export default ViewExperiences