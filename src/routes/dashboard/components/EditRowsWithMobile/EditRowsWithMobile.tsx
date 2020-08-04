import React from 'react';
import EditRows from 'components/EditRows/EditRows'
import { useIsMobile } from 'hooks/useIsMobile'
import TitleWithBackLink from '../TitleWthBackLink/TitleWithBackLink';

export type EditRowsWithMobileProps = {
   rows: React.ReactNode[]
   title: string;
   color: string;
}

export default function EditRowsWithMobile(props: EditRowsWithMobileProps) {
   const {
      rows,
      title,
      color
   } = props;

   const is_mobile = useIsMobile();

   return (
      <EditRows
         title={is_mobile?
            <TitleWithBackLink
               title={title}
               back_link="/dashboard"
               back_link_name="Dashboard"
               link_style={{ color: 'white' }}
            /> : title
         }
         rows={rows}
         color={color}
      />
   );
}