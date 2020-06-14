import React, {useEffect, useState} from 'react';
import {FiArrowRight, FiArrowLeft} from "react-icons/all";

import './styles.scss';

export default function CarrosselComponent({children, sizeFull, pageStart = 0}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (pageStart) {
      setPage(pageStart);
    }
  }, [pageStart]);

  return (
    <div>

      {sizeFull > window.innerWidth && (
        <>
          <div onClick={page > 0 ? () => setPage(page - 2) : () => null}
               className='arrowCarroselComponent arrowCarroselComponentLeft'>
            {(page * window.innerWidth / 2) > 0 && (
              <FiArrowLeft/>
            )}
          </div>

          <div onClick={
            (page === 0 || (sizeFull - window.innerWidth >= (page * window.innerWidth / 2))) ?
              () => setPage(page + 2) : () => null} className='arrowCarroselComponent arrowCarroselComponentRight'>
            {(page === 0 || (sizeFull - window.innerWidth >= (page * window.innerWidth / 2))) && (
              <FiArrowRight/>
            )}
          </div>
        </>
      )}

      <div className='carroselComponent'
           style={
             {
               left: (page === 0) ? 0 : (page * window.innerWidth / 2) <= 0 ? 0 : (sizeFull - window.innerWidth > (page * window.innerWidth / 2)) ? -(page * window.innerWidth / 2) : -(sizeFull + 50 - window.innerWidth)
             }
           }
      >
        {children}
      </div>
    </div>
  );

}