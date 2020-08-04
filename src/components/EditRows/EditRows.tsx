import React from 'react';
import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
import TSCardContentVeryLight from 'components/TSCard/components/TSCardContentVeryLight';
import TSCardContentLight from 'components/TSCard/components/TSCardContentLight';

function EditRows(props) {
   const { rows, color, title } = props;

   return (
      <TSCard color={color}>
         <TSCardHeader>{title || <React.Fragment>&nbsp;</React.Fragment>}</TSCardHeader>
         {rows.map((row, i) => {
            if (i % 2 === 0) {
               return <TSCardContentVeryLight key={i}>{rows[i]}</TSCardContentVeryLight>
            }

            return <TSCardContentLight key={i}>{rows[i]}</TSCardContentLight>
         })}
      </TSCard>
   )
}

EditRows.defaultProps = {
   rows: [],
}

export default EditRows