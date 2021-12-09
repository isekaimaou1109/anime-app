import React from 'react'
import axios from 'axios' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCommentAlt, faEye } from '@fortawesome/free-solid-svg-icons'
import randToken from 'rand-token'

import ContentLayout from './content'
import Comment from '../layout/comments'

import contentCss from '../styles/content.module.scss'

function MainContent({ title }) {
  const [content, setContent] = React.useState(false)
  React.useEffect(() => {
    if(title == 'TRENDING NOW') {
      var query = `
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
        setContent(response.data.data.listAnime.data)
      }).catch(() => console.log('cannot fetch'))
    }

    if(title == 'POPULAR SHOWS') {
      var query = `
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
      var variables = { type: 'top' }
      
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
        setContent(response.data.data.listAnime.data)
        return false;
      }).catch(() => console.log('cannot fetch'))
    }

    return false
  }, [])

  return <div className={contentCss["content-item"]}>
    {/* item 1 */}
    <div className={contentCss["content-title-wrapper"]}>
      <div className={contentCss["content-title"]}>
        <span>{title}</span>
      </div>

      <div className={contentCss["view-all"]}>
        <a href='/categories' style={{ color: 'white' }}>
          <strong>VIEW ALL</strong>
          <FontAwesomeIcon style={{
            marginRight: 15,
            marginLeft: 10
          }} icon={faChevronRight} />
        </a>
      </div>
    </div>
    
    <div className={contentCss["view-content"]}>
      {
        content && content.map(item => {
          return <a key={randToken.generate(8)} href={`/detail/anime/${item.name}`}>
            <div className={contentCss["card-container"]}>
              <div className={contentCss["card-avatar"]}>
                <img src={`${item.imageUri}?type=images&&width=200&&height=288`} />
                {/* <p className="episode">{item.episodes.length} / {item.totalEpisode}</p> */}
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
                  <p className={contentCss["genres-item"]}>Action</p>
                  <p className={contentCss["genres-item"]}>Movie</p>
                </div>
                <h2 className={contentCss["card-name"]}>{item.name.split('-').map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}</h2>
              </div>
            </div>
          </a>
        })
      }
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
                <div style={{ background: `url(${rankingItem.imageUri}?type=images&&width=300&&height=200)` }} className={contentCss["bg"]}></div>
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

    <Comment />
  </div>
}

export default function Content() {
  return <ContentLayout content_1={
    <React.Fragment>
      {["TRENDING NOW", 'POPULAR SHOWS', 'LIVE ACTION'].map(title => {
        return <MainContent title={title} />
      })}
    </React.Fragment>
  } content_2={<SideContent />} className={'content'} />
}