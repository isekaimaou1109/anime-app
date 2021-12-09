import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'

import { modal } from '../features/modal-status/modal'
import { process } from '../features/form/form'
import navCss from '../styles/nav.module.scss'

export default function Nav() {
  const dispatcher = useDispatch()
  const [isHidden, setDropdownAppearance] = React.useState(false)
  const [width, setWidth] = React.useState(typeof window !== "undefined" && window.innerWidth)
  const listRef = React.createRef()
  const isLogin = useSelector(state => state.process.isLogined)
  const username = useSelector(state => state.process.username)
  const clientId = useSelector(state => state.process.clientId)
  const avatarUri = useSelector(state => state.process.avatarUri)

  React.useEffect(() => {
    window.addEventListener('resize', function() {
      setWidth(window.innerWidth)
    })
  }, [width])

  const onAnimeSearch = function(event) {
    event.preventDefault()
    dispatcher(modal(true))
    return false
  }

  const onClick = function(event) {
    event.preventDefault()
    if(isHidden) {
      listRef.current.classList.add('hidden')
      listRef.current.animate([
        { height: '168px', opacity: 1 },
        { height: '0px', opacity: 0 }
      ], {
        iterations: 1,
        duration: 1000
      })
    } else {
      listRef.current.classList.add('hidden')
      listRef.current.classList.remove('hidden')
      listRef.current.animate([
        { height: '0px', opacity: 0 },
        { height: '168px', opacity: 1 }
      ], {
        iterations: 1,
        duration: 1000
      })
    }
    setDropdownAppearance(!isHidden)
    return false
  }

  return <nav className='align' id={navCss.nav}>
    <a href='/' className={navCss['image-align']}>
      <img src="/static/logo.png" alt="xx" />
    </a>

    <div id={navCss.menu}>
      <div onClick={(event) => onClick(event)} id={navCss.dropdown}>
        {
          isLogin && username ? <img
            src={`${avatarUri}?type=avatar&&width=32&&height=32`}
            className={navCss.border}
            alt="XXX"
            width={32}
            height={32}
          /> : <React.Fragment>
            <span className={navCss.title}>Menu</span>
            <FontAwesomeIcon icon={faBars} style={{ marginLeft: 5 }} />
          </React.Fragment>
        }
      </div>

      <ul className={width <= 992 ? 'hidden' : ''} ref={listRef} id={navCss.list}>
        <a href='/'>
          <li className={navCss['list-item']}>
            <span className={navCss['title']}>Homepage</span>
          </li>
        </a>

        <li className={navCss['list-item']}>
          <span className={navCss['title']}>
            Categories
            <FontAwesomeIcon style={{
              marginLeft: 10,
              marginTop: 2
            }} icon={faChevronDown} />
          </span>

          <ul id={navCss['sublist']}>
            <a href='/categories'>
              <li className={navCss['sublist-item']}>
                <span className={navCss['title']}>Categories</span>
              </li>
            </a>

            <a href='/anime-detail'>
              <li className={navCss['sublist-item']}>
                <span className={navCss['title']}>Anime Details</span>
              </li>
            </a>

            <a href='/anime-watching'>
              <li className={navCss['sublist-item']}>
                <span className={navCss['title']}>Anime Watching</span>
              </li>
            </a>

            <a href='/blog'>
              <li className={navCss['sublist-item']}>
                <span className={navCss['title']}>Blog Details</span>
              </li>
            </a>
          </ul>
        </li>

        <a href='/blog'>
          <li className={navCss['list-item']}>
            <span className={navCss['title']}>Our Blog</span>
          </li>
        </a>

        <a href='/contact'>
          <li className={navCss['list-item']}>
            <span className={navCss['title']}>Contacts</span>
          </li>
        </a>

        {
          isLogin ? <React.Fragment>
            <a onClick={() => dispatcher(process({
              type: 'LOGIN',
              isLogined: false,
              username: null,
              clientId: null,
              avatarUri: null
            }))} href='/logout'>
              <li className={navCss['list-item']}>
                <span className={navCss['title']}>Logout</span>
              </li>
            </a>

            <a href={`/dashboard/${clientId}`}>
              <li className={navCss['list-item']}>
                <span className={navCss['title']}>Dashboard</span>
              </li>
            </a>
          </React.Fragment> : ''
        }
      </ul>
    </div>

    <div className={navCss['icon-container']}>
      <FontAwesomeIcon style={{ padding: '20px 10px' }} onClick={(event) => onAnimeSearch(event)} icon={faSearch} />
      {
        isLogin && username ? '' : <a href='/signin'>
          <FontAwesomeIcon style={{ padding: '20px 10px' }} icon={faUser} />
        </a>
      }
    </div>
  </nav>
}