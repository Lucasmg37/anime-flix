import React, {useEffect, useState} from 'react';
import 'sass/UI.scss';

export default function UIinputTextSelect(props) {

  const [dataFilter, setDataFilter] = useState([]);
  const [selected, setSelected] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setDataFilter(props.data)
  }, [props.data]);

  const select = item => {
    props.onSelect(item);
  };

  const search = value => {

    setShow(true);

    if (!value) {
      setDataFilter(props.data);
      return;
    }

    let data = props.data.filter(item => {
      return item.categoria.toUpperCase().indexOf(value.toUpperCase()) > -1;
    }, value);

    setDataFilter(data);
  };

  return (
    <div onMouseLeave={() => setShow(false)} className='UIinputTextSelect'>
      <input
        onFocus={() => setShow(true)}
        onMouseEnter={() => setShow(true)}
        className={`${props.className}`}
        placeholder={props.placeholder}
        onChange={e => search(e.target.value)}
        value={props.value}
        type={'text'}
      />

      {show && (
        <ul className='scroll-clean'>
          {dataFilter && dataFilter.map(item =>
            (<li key={item.id} onClick={() => select(item)}>{item.categoria}</li>)
          )}
        </ul>
      )}

    </div>
  );
}