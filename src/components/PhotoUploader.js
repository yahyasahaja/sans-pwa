import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import styles from './css/photo-uploader.module.scss'

@observer
class PhotoUploader extends Component {
  @observable file = null
  id = Date.now()

  render() {
    let {
      image,
      label = 'Image'
    } = this.props

    return (
      <div className={styles.image} >
        <input 
          style={{display: 'none'}}
          type="file" 
          name={this.id} 
          id={this.id} 
          onChange={e => {
            if (e.target.files.length > 0) {
              this.file = e.target.files[0]
              this.props.onChange && this.props.onChange(e.target.files[0])
            }
          }}
        />
        {image && (
          <div
            className={styles.title}
          >
            <div className={styles.label} >{label}</div>
            <div 
              onClick={() => {
                this.file = null
                this.props.onChange && this.props.onChange(null)
              }}
              className={`mdi mdi-close ${styles.close}`}  
            />
          </div>
        )
        }
        <label htmlFor={this.id} className={styles.img} >
          {
            this.file || image
            ? (
              <img src={image} alt=""/>
            )
            : (
              <div className={styles.placeholder}>
                <span className={`mdi mdi-camera-image ${styles.icon}`} />
                <span className={styles.text} >Upload {label}</span>
              </div>
            )
          }
        </label>
      </div>
    )
  }
}

export default PhotoUploader