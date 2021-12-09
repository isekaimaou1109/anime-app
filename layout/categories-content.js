import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faChevronRight, faCommentAlt, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import randToken from 'rand-token'
import { useRouter } from 'next/router'

import ContentLayout from './content'
import contentCss from '../styles/content.module.scss'

function MainContent({ data, totalPages }) {
  const [isToggle, setToggle] = React.useState(false)

  return <div className={contentCss["content-item"]}>
    {/* item 1 */}
    <div className={contentCss["content-title-wrapper"]}>
      <div className={contentCss["content-title"]}>
        <span>Categories</span>
      </div>

      <div onClick={event => setToggle(!isToggle)} className={contentCss['selection']}>
        <p className={contentCss['selection-title']}>Thể loại</p>

        <div style={{ display: isToggle ? 'block' : 'none' }} className={contentCss['selection-body']}>
          <a href='http://localhost:3000/categories?g=drama&&p=1' className={contentCss['selection-option']}>
            <div>Drama</div>
          </a>
          <a href="http://localhost:3000/categories?g=fantasy&&p=1" className={contentCss['selection-option']}>
            <div>Fantasy</div>
          </a>
          <a href='http://localhost:3000/categories?g=shounen&&p=1' className={contentCss['selection-option']}>
            <div>Shounen</div>
          </a>
          <a href='http://localhost:3000/categories?g=life&&p=1' className={contentCss['selection-option']}>
            <div>Life</div>
          </a>
          <a href='http://localhost:3000/categories?g=scientific&&p=1' className={contentCss['selection-option']}>
            <div>Scientific</div>
          </a>
          <a href='http://localhost:3000/categories?g=adventure&&p=1' className={contentCss['selection-option']}>
            <div>Adventure</div>
          </a>
        </div>
      </div>
    </div>
    
    {/* item 2 */}
    <div className={contentCss["view-content"]}>
      {
        data.map(item => {
          return <a key={randToken.generate(8)} href={`/detail/anime/${item.name}`}>
            <div className={contentCss["card-container"]}>
              <div className={contentCss["card-avatar"]}>
                <img src={`${item.imageUri}?type=images&&width=200&&height=288`} />
                <p className={contentCss["episode"]}>{item.currentEpisode} / {item.totalEpisode}</p>
                <p className={contentCss["views"]}>
                  <span>11</span>
                  <FontAwesomeIcon style={{
                    marginLeft: 5
                  }} icon={faCommentAlt} />
                </p>
                <p className={contentCss["eyes"]}>
                  <span>{`${item.views}`.slice(0,4) + '.'.repeat(3)}</span>
                  <FontAwesomeIcon icon={faEye} />
                </p>
              </div>
      
              <div className={contentCss["card-info"]}>
                <div className={contentCss["genres-container"]}>
                  {
                    item.genres.slice(0,2).map(g => {
                      return <span className={contentCss["genres-item"]}>{g[0].toUpperCase() + g.slice(1, g.length)}</span>
                    })
                  }
                </div>
                <h2 className={contentCss["card-name"]}>{item.name.split('-').map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}</h2>
              </div>
            </div>
          </a>
        })
      }
    </div>

    <div className={contentCss['pagination-container']}>
      <FontAwesomeIcon style={{ border: '3px dashed white' }} icon={faChevronLeft} />
  
      {
        totalPages.map(page => {
          return <div key={randToken.generate(8)} className={contentCss['pagination-item']}>
            <a style={{ color: 'white' }} href={`http://localhost:3000/categories?p=${page}`}>{page}</a>
          </div>
        })
      }

      <FontAwesomeIcon style={{ border: '3px dashed white' }} icon={faChevronRight} />
    </div>
  </div>
}

function SideContent() {
  const [topRanking, setRanking] = React.useState(false)
  React.useEffect(() => {
    const query = `
      query Query($type: String) {
        listAnime(type: $type) {
          data {
            name
            vietnameseName
            views
            totalEpisode
            currentEpisode
            imageUri
          }
        }
      }
    `
    const variables = {
      type: "top"
    }

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
      setRanking(response.data.data.listAnime.data)
    }).catch(() => console.log('cannot fetch'))

    return false
  }, [])

  if(!topRanking) {
    return null
  }

  return <div className={contentCss["content-item"]}>
    <div className={contentCss["content-title-wrapper"]}>
      <div className={contentCss["content-title"]}>
        <span>TOP VIEWS</span>
      </div>

      <ul className={contentCss["rank"]}>
        <li className={contentCss["rank-item"]}>Total</li>
      </ul>
    </div>

    <div className={contentCss["content-view"]}>
      {
        topRanking && topRanking.map(rankingItem => {
          return (
            <div key={randToken.generate(8)} className={contentCss["card-container"]}>
              <div className={contentCss["card-avatar"]}>
                <div style={{ background: `url(${rankingItem.imageUri}?type=images&&width=200&&height=288)` }} className={contentCss["bg"]}></div>
                <p className={contentCss["episode"]}>{rankingItem.currentEpisode} / {rankingItem.totalEpisode}</p>
                <p className={contentCss["eyes"]}>
                  <span>{rankingItem.views}</span>
                  <FontAwesomeIcon icon={faEye} />
                </p>
                <h2 className={contentCss["card-name"]}>
                  {rankingItem.name.split('-').map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}
                </h2>
              </div>
            </div>
          )
        })
      }
    </div>
  </div>
}

export default function CategoriesContent({ data, totalPages }) {
  return <ContentLayout content_1={<MainContent data={data} totalPages={totalPages} />}
   content_2={<SideContent />} className={'content'} />
}