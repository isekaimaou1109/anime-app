import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faEye, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { DoubleRightOutlined } from '@ant-design/icons';
import { useBeforeunload } from 'react-beforeunload';
import randToken from 'rand-token'
import io from 'socket.io-client'

import { switching } from '../features/dark-light-status/mode'
import { writeHistory } from '../features/history/history'

import Comment from './comments'
import ContentLayout from './content'
import contentCss from '../styles/content.module.scss'

function MainContent({ data, anime }) {
  const dispatcher = useDispatch()
  const switchingStatus = useSelector(state => state.switching.mode)
  const loginStatus = useSelector(state => state.process.isLogined)
  const userClientId = useSelector(state => state.process.clientId)
  const historyAnime = useSelector(state => state.history.follow)
  const [dropdownAccordion, setDropdownAccordion] = React.useState(false)
  const [isLoaded, setLoad] = React.useState(false)
  const [status, setStatus] = React.useState(switchingStatus)
  const descriptionRef = React.createRef()
  const videoRef = React.createRef()
  const onShowDescription = (event) => {
    event.preventDefault()
    if(dropdownAccordion) {
      descriptionRef.current.style.gridTemplateRows = `50px 0px`
      descriptionRef.current.lastElementChild.style.opacity = 0
    } else {
      descriptionRef.current.style.gridTemplateRows = `50px 1fr`
      descriptionRef.current.lastElementChild.style.opacity = 1
    }
    setDropdownAccordion(!dropdownAccordion)
    return false
  }

  const hoverOnButton = function(event) {
    event.preventDefault()
    event.target.style.setProperty("--left", `${event.target.clientWidth}px`);
    event.target.style.setProperty("--opacity", `1`);
    var timeout = setTimeout(() => {
      event.target.style.setProperty("--opacity", `0`);
      clearTimeout(timeout)
    }, 250)
    return false
  }

  const leaveOutButton = function(event) {
    event.preventDefault()
    event.target.style.setProperty("--left", `-6px`);
    event.target.style.setProperty("--opacity", `0`);
    return false
  }

  const onSwitchingStatus = function(event) {
    event.preventDefault()
    dispatcher(switching({
      type: !switchingStatus ? 'LIGHT' : 'DARK',
      mode: !switchingStatus
    }))
    return false
  }

  const onClickExpand = function(event) {
    event.preventDefault()
    dispatcher(writeHistory({
      type: 'RESET'
    }))
    return false
  }

  useBeforeunload((event) => {
    if(videoRef.current?.currentTime <= videoRef.current?.duration - 2) {
      dispatcher(writeHistory({
        type: 'WRITE',
        name: anime[1],
        currentTime: videoRef.current.currentTime,
        createdAt: new Date().toLocaleString()
      }))
      return false
    } else {
      event.preventDefault()
    }
  });

  React.useEffect(() => {
    setLoad(true)

    historyAnime.some(async (history, index) => {
      if(history.name === anime[1]) {
        videoRef.current.play()
        videoRef.current.currentTime = history.currentTime
        await Promise.all([dispatcher(writeHistory({
          type: 'REMOVE',
          start: index
        }))])
        return true;
      }
    })
    return false
  }, [isLoaded])

  const onFollowButton = function(event) {
    event.preventDefault()
    if(!loginStatus) {
      /* chưa đăng nhập mà đòi follow */
      alert('Chưa đăng nhập mà đòi theo dõi là sao?')
    } else {
      console.log(anime[0])
      axios.post(`http://localhost:3000/user/${userClientId}/follow/${anime[0]}`)
           .then(res => {
            if(res.status == 200) {
              window.alert('Bạn đã theo dõi thành công anime này')
            }
           })
           .catch(() => console.log('cannot post follow anime'))
    }
    return false
  }

  return <div className={contentCss['anime-wrapper']}>
    <div className={contentCss['breadcrumb']}>
      {
        ['Home', anime[0].split('-').filter(item => item.trim() !== '').join(' '), (anime[1] ? anime[1] : '')].map((location, index) => {
          return <a key={randToken.generate(8)} style={{ 
            color: 'white',
            marginRight: 5
            }} href={`/${location == 'Home' ? '' : '/detail/anime/' + location.replace(/\s+/gm, '-')}`}
          >
            {location} 
            {
              index !== ['Home', ...anime[0].split('-').filter(item => item.trim() !== '')].length - 1 ? <DoubleRightOutlined /> : '' 
            }
          </a>
        })
      }
    </div>

    <div className={contentCss['anime-information']}>
      {
        anime.length === 2 ? (
          <React.Fragment>
            <video ref={videoRef} onLoadedMetadata={(event) => console.log(videoRef.current.videoWidth)} controls={true} id={contentCss['video']}>
              <source src={`http://localhost:3000/video/${anime[1]}.mp4`} type="video/mp4"></source>
              <noscript>GO and download google chrome now!!</noscript>
            </video>
            <div className={contentCss['video-bar']}>
              <span onMouseLeave={event => leaveOutButton(event)} onMouseEnter={event => hoverOnButton(event)} className={contentCss['video-button']}>
                <a style={{ color: 'white' }} href={`http://localhost:3000/download/${anime[1]}.mp4`}>
                  Download
                </a>
              </span>

              <span onClick={event => onClickExpand(event)} onMouseLeave={event => leaveOutButton(event)} onMouseEnter={event => hoverOnButton(event)} className={contentCss['video-button']}>
                Expand
              </span>

              <span onClick={(event) => onSwitchingStatus(event)} onMouseLeave={event => leaveOutButton(event)} onMouseEnter={event => hoverOnButton(event)} className={contentCss['video-button']}>
                {
                  switchingStatus ? 'DARK' : 'LIGHT'
                }
              </span>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className={contentCss['avatar-container']}>
              <div className={contentCss['anime-avatar']}>
                <img 
                  src={`${data.imageUri}?type=images&&width=200&&height=300`}
                />
              </div>
      
              <div className={contentCss['anime-detail']}>
                <h1 className={contentCss['anime-name'] + ' text'}>
                  {data.name.split('-').map(item => item[0].toUpperCase() + item.slice(1, item.length + 1)).join(' ')} 
                </h1>
                <div className={contentCss['anime-genres']}>
                  Tên khác:
                  <span className={contentCss['other-name'] + ' text'}>
                    {data.vietnameseName}
                  </span>
                </div>
                <div className={contentCss['anime-genres']}>
                  Thể loại: {' '}
                  {
                    data.genres.map(genre => {
                      return <span key={randToken.generate(8)} className={contentCss['genre']}>
                        {genre}
                      </span>
                    })
                  }
                </div>
                <div className={contentCss['anime-genres']}>
                  Kiểu Anime: {' ' + data.animeModel}
                </div>
                <div className={contentCss['anime-genres']}>
                  Được đánh giá: {' ' + data.star}  <FontAwesomeIcon style={{ color: 'yellow', margin: '0px -6px' }} icon={faStar} />
                </div>
                <div className={contentCss['perspective-opinion-container']}>
                  {/* follow button */}
                  <button onClick={event => onFollowButton(event)} className={contentCss['opinion-button']}>
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      }
    </div>

    {
      anime.length === 2 ? '' : (
        <div className={contentCss['anime-description-accordion']} ref={descriptionRef} onClick={(event) => onShowDescription(event)}>
          <FontAwesomeIcon icon={dropdownAccordion ? faChevronDown : faChevronRight} />
          <span className={contentCss['title']}>Nội Dung Chính</span>
          <p className={contentCss['description']}>{data.description}</p>
        </div>
      )
    }

    <div className={contentCss['anime-episodes']}>
      {
        data.episodes.map(episode => {
          return <a href={`/detail/anime/${anime[0]}/${anime[0]}-ep-${episode.episodeNumber}`}>
            <span className={contentCss['episode']} key={randToken.generate(8)}>
              Tập {episode.episodeNumber}
            </span>
          </a>
        })
      }
    </div>

    <Comment style={{
      marginTop: 30,
      padding: 0
    }} animeName={anime[0]} />
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

export default function Content({ data, anime }) {
  return <ContentLayout content_1={<MainContent data={data} anime={anime} />}
   content_2={<SideContent />} className={'anime'} />
}

// React.useEffect(() => {
//   fetch('/api/io').finally(() => {
//     const socket = io()

//     socket.on('connect', () => {
//       console.log('connect')
//       socket.emit('hello')
//     })

//     socket.on('hello', data => {
//       console.log('hello', data)
//     })

//     socket.on('a user connected', () => {
//       console.log('a user connected')
//     })

//     socket.on('disconnect', () => {
//       console.log('disconnect')
//     })
//   })
// }, [])