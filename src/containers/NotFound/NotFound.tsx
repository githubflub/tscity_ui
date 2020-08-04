import React, { useEffect } from 'react'
import TwoThirdsUp from 'components/TwoThirdsUp/TwoThirdsUp'
import { getRandomInt } from 'utils/getRandomInt'

import './NotFound.scss'

export default function NotFound(props) {
   const content = [
      <React.Fragment>
         <span className="line">{`Whatever you're looking for,`}</span>
         <br />
         <span className="line">{`I hope you find it.`}</span>
      </React.Fragment>,

      <React.Fragment>
         <span className="line">{`What do you mean, `}</span>
         <span className="line">{`you don't have it?!`}</span>
         <br />
         <span className="line">{`Gimmie NOW!!! `}</span>
         <span className="line">{`(╯°□°）╯︵ ┻━┻`}</span>
      </React.Fragment>
   ]

   const index = getRandomInt(0, content.length - 1);

   return (
      <div className="teenspot_app_layout__page NotFound">
         <div className="teenspot_app_layout__page_container">
            <TwoThirdsUp>
               <div>
                  {content[index]}
               </div>
            </TwoThirdsUp>
         </div>
      </div>
   )
}