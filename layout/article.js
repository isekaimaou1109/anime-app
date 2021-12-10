import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import { useResize } from '../utils/useResize'

import articleCss from '../styles/article.module.scss'

export default function Article() {
  const [newContent, setFreshContent] = React.useState([])
  const carouselRef = React.createRef()
  const dimension = useResize(carouselRef)
  const [screen] = React.useState(dimension)
  var [count, setCount] = React.useState(0)

  React.useEffect(() => {

    var query = `
      query Query($type: String) {
        listAnime(type: $type) {
          data {
            name
            vietnameseName
            description
            genres
            imageUri
          }
        }
      }
    `
    var variables = { type: 'newest' }
    
    const data = {
      query,
      variables
    }

    const options = {
      method: 'POST',
      data: data,
      url: 'http://localhost:3000/graphql',
    };

    axios(options).then(response => {
      setFreshContent(response.data.data.listAnime.data.slice(0,3))
      return ;
    }).catch(() => console.log('cannot fetch'))
  }, [])

  const clickPreviousButton = function(event) {
    event.preventDefault()

    if(count < 0) {
      setCount(0)
    }

    return false
  }

  const clickNextButton = function(event) {
    event.preventDefault()

    count++
    setCount(count)

    for(let i = 0; i < carouselRef.current.children.length; i++) {
      if(count !== i) {
        carouselRef.current.children[i].setAttribute('data-active', false)
      } else {
        carouselRef.current.children[count].setAttribute('data-active', true)
      }

      if(count == 2) {
        count = 0
        carouselRef.current.children[count].setAttribute('data-active', true)
      }
  
    }

    return false
  }

  return <section id={articleCss.article} className='align'>
    <div onClick={event => clickPreviousButton(event)} className={articleCss.button} id={articleCss.previous}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
    
    <div onClick={event => clickNextButton(event)} className={articleCss.button} id={articleCss.next}>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>

    <div ref={carouselRef} className={articleCss["item-container"]}>
      {
        newContent.map(ct => {
          return <div data-active={false} style={{ 
            background: `url(${ct.imageUri}?type=images&&width=300&&height=500)`,
            backgroundSize: 'cover',
            transform: count * -500,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }} className={articleCss.item}>
            <p className={articleCss.genre}>Adventure</p>
            <div className={articleCss["anime-info"]}>
              <h1 className={articleCss.name}>{ct.name.replace(/\-+/gm, ' ')}</h1>
              <p className={articleCss.description}>{ct.description}</p>
            </div>
            <div className={articleCss["btn-container"]}>
              <button className={articleCss.btn}>
                <span>WATCH NOW</span>
              </button>
              <FontAwesomeIcon style={{
                padding: '0px 10px'
              }} className='icon' icon={faChevronRight} />
            </div>
          </div>
        })
      }
    </div>

    <ul id={articleCss["carousel-container"]}>
      <li className={articleCss["carousel-item-button"]}></li>
      <li className={articleCss["carousel-item-button"]}></li>
      <li className={articleCss["carousel-item-button"]}></li>
    </ul>
  </section>
}