import React from 'react'
import { Link } from 'react-router-dom'

export default function TitleWithBackLink(props) {
   const { title, back_link, back_link_name, link_style } = props;

   return (
      <div>
         <Link to={back_link} style={link_style}>{back_link_name}</Link>
         &nbsp;&gt;&nbsp;
         <span>{title}</span>
      </div>
   );
}