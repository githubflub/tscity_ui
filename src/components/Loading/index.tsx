import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import classnames from 'classnames'

import './Loading.scss'

function Loading(props) {
   const { absolute } = props

   const loading_classname = classnames({
      "teenspot_loading_spinner": true, 
      "teenspot_loading_spinner__absolute": !!absolute, 
   })

   return (
      <div className={loading_classname}>
         <div className="teenspot_loading_spinner_top">
            <CircularProgress color="primary" size="60px" thickness={2.7} />
         </div>
         <div className="teenspot_loading_spinner_bottom" />
      </div>
   )
}

export default Loading