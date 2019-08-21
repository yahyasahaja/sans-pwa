import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import { Route } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import GeneralSkeleton from './GeneralSkeleton'
import EditGeneral from './EditGeneral'
import profileState from '../profileState'

const Cover = styled.div`
  display: block;
  height: 200px;

  span {
    height: 100%;
    display: block !important;

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }
`

const Container = styled.div`
  display: block;
  background: white;
  /* border-top: 1px solid #d2d2d2;
  border-bottom: 1px solid #d2d2d2; */

  @media only screen and (min-width: 800px) {
    border-radius: 10px;
    overflow: hidden;
    height: 80vh;
    box-shadow: 1px 1px 10px #0000002b;
    border: 1px solid #e6e6e6;
  }
  
  .not-completed {
    padding: 20px;
    
    .wrapper {
      display: flex;
      text-align: center;
      justify-content: center;
      flex-direction: column;
      padding: 100px;
      border: 2px dashed #e6e6e6;
      border-radius: 30px;

      .text {
        font-size: 15pt;
        font-weight: 300;
        margin: 20px 0;
      }
    }
  }

  .content {
    display: block;
    position: relative;

    .profile-picture-wrapper {
      display: flex;
      margin-top: -75px;
      justify-content: center;
      width: 100%;

      .profile-picture {
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
            width: 100%;
            object-fit: contain;
            object-position: center;
          }
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      top: 75px;
      width: 100%;
    }

    .details {
      text-align: center;
      margin-top: 20px;
      padding-bottom: 20px;

      .name {
        font-size: 18pt;
        color: #34495e;
        font-weight: 300;
      }

      .description {
        font-size: 15pt;
      }

      .others {
        display: block;
      }
    }
  }
`

@observer
class General extends Component {
  @observable isLoading = false
  @observable profile = null
  @observable shouldCompleteProfile = false

  componentDidMount() {
    profileState.fetchProfile()
  }

  renderMobile() {
    return (
      <MediaQuery maxWidth={800} >
        {this.renderProfile()}
      </MediaQuery>
    )
  }

  renderProfile() {
    if (profileState.isFetchingProfile) return (
      <GeneralSkeleton />
    )

    if (!profileState.profile) return(
      <div className="not-completed" >
        <div className="wrapper" >
          <div className="text" >Your Profile hasn't completed yet</div>
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.props.history.push('/company/profile/general/edit')}
            >Complete Profile</Button>
          </div>
        </div>
      </div>
    )

    let { 
      logoUrl, 
      bannerUrl, 
      description,
      email,
      name,
    } = profileState.profile

    return (
      <React.Fragment>
        <Cover>
          <LazyLoadImage
            alt="cover"
            placeholderSrc="/images/flat-cover.jpg"
            src={bannerUrl} 
            effect="blur"
          />
        </Cover>
        <div className="content" >
          <div className="profile-picture-wrapper" >
            <div className="profile-picture" >
              <LazyLoadImage
                alt="profilepicture"
                placeholderSrc="/images/flat-pp.jpg"
                src={logoUrl} 
                effect="blur"
              />
            </div>
          </div>
          <div className="details" >
            <div className="name" >{name}</div>
            <div className="description" >{description}</div>
            <div className="others" >
              <div className="address" >{email}</div>
            </div>
          </div>
          <div className="actions" >
            <IconButton 
              onClick={() => this.props.history.push('/company/profile/general/edit')} 
              size="medium" >
              <EditIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <Container>
        {this.renderProfile()}
        <Route path="/company/profile/general/edit" component={EditGeneral} />
      </Container>
    )
  }
}

export default General