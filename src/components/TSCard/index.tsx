import React from 'react'
import {
   createStyles,
   withStyles,
   Theme,
} from '@material-ui/core'
import classnames from 'classnames'


function TeenSpotCard(props) {
   const { children, classes, color, className, style } = props

   const card_classname = classnames(classes.root, classes[color], className)

   return (
      <div className={card_classname} style={style}>
         {React.Children.map(children, child => {
            // console.log("child.type.displayName", child.type.displayName )

            if ((child.type.displayName || '') === 'TSCardHeader') {
               return React.cloneElement(child, {
                  className: classnames(classes[color], child.props.className)
               })
            }
            else if ((child.type.displayName || '') === 'TSCardContentLight') {
               return React.cloneElement(child, {
                  className: classnames(classes[`${color}_light`], child.props.className)
               })
            }
            else if ((child.type.displayName || '') === 'TSCardContentVeryLight') {
               return React.cloneElement(child, {
                  className: classnames(classes[`${color}_very_light`], child.props.className)
               })
            }

            return child
         })}
      </div>
   )
}

TeenSpotCard.defaultProps = {
   color: 'teal'
}

function dumb(theme) {
   const colors = ['green', 'orange', 'blue', 'red', 'teal']
   const keys = {
      teal: 'primary',
      red: 'error',
   }

   const whatever = {}
   colors.forEach(color_key => {
      const color = keys[color_key] || color_key;

      whatever[color_key] = {
         borderColor: theme.palette[color].main,
         backgroundColor: theme.palette[color].main,
      }

      whatever[`${color_key}_light`] = {
         backgroundColor: theme.palette[color].light,
      }

      whatever[`${color_key}_very_light`] = {
         backgroundColor: theme.palette[color].very_light,
      }
   })

   return whatever
}

export default withStyles((theme: Theme) => {
   return createStyles({
      root: {
         boxShadow: '2px 2px 5px rgba(0,0,0,0.15)',
         borderWidth: '1px',
         borderStyle: 'solid',
      },
      ...dumb(theme)
   })
})(TeenSpotCard)