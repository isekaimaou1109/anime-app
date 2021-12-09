import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { modal } from '../features/modal-status/modal'
import { search, data } from '../features/query/search'

export default function Modal() {
  const dispatcher = useDispatch()
  const modalStatus = useSelector(state => state.modal.modalStatus)
  const searchAnimeCurrentValue = useSelector(state => state.searching.value)
  const searchAnimeCurrentData = useSelector(state => state.data.data)

  const onCloseQuery = function(event) {
    event.preventDefault()
    console.log(modalStatus)
    dispatcher(modal(false))
    return false
  }

  const onSelectionQuery = async function(event) {
    console.log(event.keyCode)
    const limitRange = [
      48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,
      85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,
      116,117,118,119,120,121,122,123,8,32
    ]
    if(limitRange.indexOf(event.keyCode) !== -1) {
      event.preventDefault()
      var key = searchAnimeCurrentValue + event.key

      const topLevelAction = () => (dispatch, keyPass, docPass) => {
        return Promise.all([dispatch(search({
          type: 'SEARCH',
          key: keyPass
        })), dispatch(data({
          type: 'PUSH',
          doc: docPass
        }))])
      }

      if(event.keyCode === 8) {
        event.preventDefault()
        fetch(`http://localhost:3000/search?q=${searchAnimeCurrentValue}`)
          .then(response => response.json())
          .then(result => {
            console.log(result)
            topLevelAction()(dispatcher, searchAnimeCurrentValue.slice(0, searchAnimeCurrentValue.length - 1), result).then(endResult => {
              console.log(endResult)
            })
          });
        return false
      }

      fetch(`http://localhost:3000/search?q=${searchAnimeCurrentValue}`)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          topLevelAction()(dispatcher, key, result).then(endResult => {
            console.log(endResult)
          })
        });
      return false
    } else {
      return false
    }
  }

  const cleanUp = function(event) {
    Promise.all([dispatcher(modal(false)), dispatcher(search({
      type: 'SEARCH',
      key: ''
    })), dispatcher(data({
      type: 'PUSH',
      doc: []
    }))])
    return false
  }

  return <div id={modalStatus ? 'modal' : 'closed'}>
    <div id='modal-wrapper'>
      <FontAwesomeIcon icon={faTimesCircle} onClick={(event) => onCloseQuery(event)} />
      <div id='search-container'>
        <input
          onKeyDown={event => onSelectionQuery(event)}
          type='text' 
          name='animename'
          value={searchAnimeCurrentValue}
          placeholder='Please type your anime name...' 
          id='query-anime'
          autoComplete={"off"}
          autoCorrect={"false"}
        />
        <ul id='list-query'>
          {
            searchAnimeCurrentData.map(itemData => {
              return <a onClick={event => cleanUp(event)} href={`http://localhost:3000/detail/anime/${itemData.name.split(' ').filter(item => item !== '').map(item => item.toLowerCase()).join('-')}`}>
                <li className='list-query-item'>
                  <div className='list-avatar'>
                    <img src={`${itemData.imageUri}?type=images&&width=64&&height=64`} />
                  </div>
    
                  <div className='list-anime-title'>
                    <h3 className='text'>{itemData.name}</h3>
                    <pre className='text'>{itemData.vietnameseName}</pre>
                  </div>
                </li>
              </a>
            })
          }
        </ul>
      </div>
    </div>
  </div>
}