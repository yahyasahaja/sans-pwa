import React, { Component } from 'react'
import styled from 'styled-components'

const FeatureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({white}) => white ? 'white' : 'inherit'};
  margin: 0 30px;
  max-width: 200px;

  .image {
    width: 150px;
    height: 150px;

    img {
      height: 100%;
      filter: ${({white}) => white ? 'brightness(0) invert(1)' : 'none'};
    }
  }

  .title {
    margin-top: 20px;
    font-size: 15pt;
    font-weight: bold;
    text-align: center;
  }

  .desc {
    font-size: 11pt;
    text-align: center;
  }
`

export default class Feature extends Component {
  render() {
    return (
      <FeatureContainer style={this.props.style} white={this.props.white} >
        <div className="image" >
          <img src={this.props.src || '/images/blockchain.png'} alt="" />
        </div>
        <div className="title" >
          {this.props.title || 'Block Chain'}
        </div>
        <div className="desc" >
          {this.props.desc || 'Technology that allows fast and ...'}
        </div>
      </FeatureContainer>
    )
  }
}