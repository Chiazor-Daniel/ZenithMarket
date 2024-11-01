import React from 'react';

export const GlobalFilter = ( {filter, setFilter, w} ) =>{
  return(
    <div>
      Search : {' '}
      <input className="ml-2 input-search form-control"
        value={filter || ''}  onChange={e => setFilter(e.target.value)} style={{width: !w? "20%": "100%"}}
      />
    </div>
  )
}