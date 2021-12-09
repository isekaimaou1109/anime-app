import React from 'react'
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSearch, faBellSlash, faTimesCircle, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import CryptoJS from 'crypto-js'
import randToken from 'rand-token'
import { useDispatch, useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone';
import axios from 'axios'

import { process, getClientId } from '../../features/form/form'
import { writeHistory } from '../../features/history/history'

import dashboardCss from '../../styles/dashboard.module.scss'

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function Dashboard({ id }) {
  const histories = useSelector(state => state.history.follow)
  const clientId = useSelector(state => state ? state.process.clientId : '')
  const dispatcher = useDispatch()
  const size = useWindowSize();
  const [profile, setProfile] = React.useState({})
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [files, setFiles] = React.useState([]);
  const returnedValue = (_v_) => _v_
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/gif',
    maxFiles: 1,
    onDrop: imageFiles => {
      if(imageFiles.length == 0) {
        alert('Bạn chỉ có thể thay 1 ảnh 1 lần thôi')
      } else {
        setFiles(imageFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    }
  });
  const [isDelete, setDelete] = React.useState(false)
  const [isHiddenSearch, setHiddenOrNot] = React.useState(true)
  const [isToggleDownSetting, setSetting] = React.useState(false)
  const [followAnime, setAnimeFollow] = React.useState([])
  const searchRef = React.createRef()

  const deleteAccount = function(event) {
    event.preventDefault()
    axios.delete(`http://localhost:3000/user/${id[0]}/delete`).then(response => {
      console.log("delete ok")
      dispatcher(process({
        type: 'LOGIN',
        isLogined: false,
        username: null,
        clientId: null,
        avatarUri: null
      }))
      if(response.status == 200) {
        window.location.replace('http://localhost:3000')
      }
    }).catch(() => console.log('error delete'))
    return false
  }

  const wannaSearchAnime = function(event) {
    event.preventDefault()
    if(!isHiddenSearch) {
      searchRef.current.style.visibility = 'visible'
      searchRef.current.style.width = '300px'
    } else {
      var reference = searchRef.current
      searchRef.current.style.width = '0px'
      var timeout = setTimeout(() => {
        reference.style.visibility = 'hidden'
        clearTimeout(timeout)
      }, 500)
    }
    setHiddenOrNot(!isHiddenSearch)
    return false
  }

  React.useEffect(() => {
    const q = `
      query Query($clientId: String) {
        getUserAnimeFollow(clientId: $clientId) {
          data {
            name
            imageUri
            vietnameseName
          }
        }
      }
    `

    const variables = { clientId: id[0] }

    const data = {
      query: q,
      variables
    }

    axios.post('http://localhost:3000/graphql', data).then(res => {
      setAnimeFollow(res.data.data.getUserAnimeFollow.data.slice(0,5))
    })

    const userQ = `
      query Query($clientId: String) {
        getUserDetail(clientId: $clientId) {
          firstname
          lastname
          username
          salt
          password
          email
          avatarUri
          createdAt
        }
      }
    `

    const _v = { clientId: clientId }

    const _b = {
      query: userQ,
      variables: _v
    }

    axios.post('http://localhost:3000/graphql', _b).then(p => {
      setProfile(p.data.data.getUserDetail)
    }).catch(() => console.log("eno"))
  }, [clientId])

  return <React.Fragment>
    <Helmet>
      {
        id[1] && id[1] == 'history' ? <title>Trang Lịch Sử</title> : (
          id[1] == 'profile' ? <title>Trang Thông Tin</title> : (
            id[1] == 'follow' ? <title>Trang Theo Dõi</title> : (
              !id[1] ? <title>Trang cá nhân bạn</title> : <title>Invalid</title>
            )
          )
        )
      }
      <link rel="shortcut icon" href="/static/favicon.ico" />
    </Helmet>

    <main style={size.width <= 1200 ? {
      gridTemplateColumns: `56px ${size.width - 56}px`,
    } : {}} id={dashboardCss['dashboard-container']}>
      
      <section style={size.width <= 1200 ? {
        justifyItems: 'center'
      } : {}} id={dashboardCss['sidebar-container']}>

        <section style={size.width <= 1200 ? {
          display: 'flex',
          alignitems: 'center',
          justifyContent: 'center',
          padding: '10px 0px'
        }: {}} id={dashboardCss['sidebar-header']}>
          <a style={size.width <= 1200 ? {
            marginLeft: 0,
            padding: 0
          } : {}} href='/'>
            <img style={size.width <= 1200 ? {
              width: 32,
              height: 32
            }: {}} src={size.width <= 1200 ? 'http://localhost:3000/static/favicon.ico' : 'http://localhost:3000/static/logo.png'} />
          </a>
        </section>

        <section className={dashboardCss['sidebar-body']}>
          <Link href={`/dashboard/${id[0]}/profile`}>
            <div className={dashboardCss['sidebar-body-item']}>
              <FontAwesomeIcon icon={faUser} />
              <span className={dashboardCss['name']}>Trang cá nhân</span>
            </div>
          </Link>

          <Link href={`/dashboard/${id[0]}/history`}>
            <div className={dashboardCss['sidebar-body-item']}>
              <FontAwesomeIcon icon={faUser} />
              <span className={dashboardCss['name']}>Lịch sử đã xem</span>
            </div>
          </Link>

          <Link href={`/dashboard/${id[0]}/follow`}>
            <div className={dashboardCss['sidebar-body-item']}>
              <FontAwesomeIcon icon={faUser} />
              <span className={dashboardCss['name']}>Những bộ đang theo dõi</span>
            </div>
          </Link>

          <a href={`/about`}>
            <div className={dashboardCss['sidebar-body-item']}>
              <FontAwesomeIcon icon={faUser} />
              <span className={dashboardCss['name']}>Về chúng tôi</span>
            </div>
          </a>

        </section>

      </section>

      <section style={histories.length == 0 ? { overflow: 'hidden' } : {}} id={dashboardCss['dashboard-body-container']}>

        <section className={dashboardCss['dashboard-header']}>

          <section className={dashboardCss['dashboard-tools']}>
            <FontAwesomeIcon icon={faUser} />
            <FontAwesomeIcon icon={faUser} />
            <FontAwesomeIcon icon={faUser} />
            <FontAwesomeIcon onClick={event => wannaSearchAnime(event)} icon={faSearch} />
            <input
              className={dashboardCss['input']} ref={searchRef}
              placeholder={'Nhập tên anime vào đây'} name='q' type='text' 
              autoComplete='off' autoCorrect='false' 
            />
          </section>

          <section className={dashboardCss['dashboard-personal']}>
            <div onClick={() => setSetting(!isToggleDownSetting)}>
              <img src={profile && 'avatarUri' in profile && `${profile.avatarUri}?type=avatar&&width=56&&height=56`} />
            </div>

            <div style={{ 
              visibility: isToggleDownSetting ? 'visible' : 'hidden',
              height: isToggleDownSetting ? 126 : 0
            }} className={dashboardCss['settings']}>

              <a onClick={() => dispatcher(process({
                type: 'LOGIN',
                isLogined: false,
                username: null,
                clientId: null,
                avatarUri: null
              }))} href='/logout'>
                <div className={dashboardCss['settings-item']}>
                  <FontAwesomeIcon icon={faUser} />
                  <span className={dashboardCss['settings-item-name']}>Logout</span>
                </div>   
              </a> 

              <Link href={`/dashboard/${id}/profile`}>
                <div className={dashboardCss['settings-item']}>
                  <FontAwesomeIcon icon={faUser} />
                  <span className={dashboardCss['settings-item-name']}>Profile</span>
                </div>
              </Link>  

              <a href={'/about'}>
                <div className={dashboardCss['settings-item']}>
                  <FontAwesomeIcon icon={faUser} />
                  <span className={dashboardCss['settings-item-name']}>About</span>
                </div>  
              </a>
            </div>
          </section>

        </section>

        <section style={id[1] && (id[1] == 'history' || id[1] == 'follow' || id[1] == 'profile') ? {
          gridTemplateColumns: '1fr',
          height: '100%'
        } : {}} className={dashboardCss['dashboard-body']}>
          {
            id[1] && id[1] == 'history' ? <React.Fragment>
              <div style={{ alignItems: 'center' }} className={dashboardCss['box']}>
                {
                  histories.length > 0 ? histories.map((history, index) => {
                    return <React.Fragment key={randToken.generate(8)}>
                      <div className={dashboardCss['box-item']}>
                        <div onMouseEnter={() => setDelete(true)} onClick={() => setDelete(false)} className={dashboardCss['circle']}></div>

                        <div className={dashboardCss['info-container']}>
                          <img src={'http://localhost:3000/image/tantei-wa-mou-shindeiru.jpg?type=images&&width=64&&height=64'} />
                          <div className={dashboardCss['anime-wrapper']}>
                            <h1>{history.name}</h1>
                            <p>2:22s</p>
                            <p>2d</p>
                          </div>
                        </div>

                        <FontAwesomeIcon onClick={event => {
                          event.preventDefault()
                          dispatcher(writeHistory({
                            type: 'REMOVE',
                            start: index
                          }))
                          return false
                        }} style={isDelete ? {
                          display: 'block'
                        } : {
                          display: 'none'
                        }} icon={faTimesCircle} />
                      </div>
                    </React.Fragment>
                  })
                : <React.Fragment>
                  <FontAwesomeIcon style={{
                    fontSize: 144,
                    alignSelf: 'center',
                    flex: 1,
                    color: 'white'
                  }} icon={faBellSlash} />
                  <h1 style={{
                    flex: 1,
                    fontSize: 48,
                    color: 'white',
                    textShadow: '0px 3px red',
                    textAlign: 'center'
                  }}>
                    Bạn không có coi dở 1 bộ anime nào hết
                  </h1>  
                </React.Fragment>}
              </div>
            </React.Fragment> : (id[1] == 'profile' ? <React.Fragment>
              <div className={dashboardCss['profile-container']}>
                <div className={dashboardCss['personal-profile']}>
                  <div className={dashboardCss['input-field-container']}>
                    <span>Firstname</span>
                    <input disabled={true} value={profile && 'firstname' in profile && profile.firstname.replace(profile.firstname[0], profile.firstname[0].toUpperCase())} />
                  </div>

                  <div className={dashboardCss['input-field-container']}>
                    <span>Lastname</span>
                    <input disabled={true} value={profile && 'lastname' in profile && profile.lastname.replace(profile.lastname[0], profile.lastname[0].toUpperCase())} />
                  </div>

                  <div className={dashboardCss['input-field-container']}>
                    <span>Email</span>
                    <input onChange={event => setEmail(event.target.value)} type='text' value={email || profile && 'email' in profile && profile.email} />
                  </div>

                  <div className={dashboardCss['input-field-container']}>
                    <span>Username</span>
                    <input disabled={true} value={profile && 'username' in profile && profile.username} />
                  </div>

                  <div className={dashboardCss['input-field-container']}>
                    <span>Password</span>
                    <input onChange={event => setPassword(event.target.value)} type='password' value={password || profile && 'password' in profile && CryptoJS.AES.decrypt(profile.password, profile.salt).toString(CryptoJS.enc.Utf8)} />
                  </div>

                  <div className={dashboardCss['input-field-container']}>
                    <span>Created At</span>
                    <input disabled={true} value={profile && 'createdAt' in profile && profile.createdAt} type='text' />
                  </div>

                  <div className={dashboardCss['button-field-container']}>
                    <button onClick={event => deleteAccount(event)}>Delete Account</button>
                    <button>Update Account</button>
                  </div>

                  <div style={{
                    width: 'fit-content',
                    position: 'relative',
                    height: 'fit-content',
                    gridColumn: '2/3',
                    gridRow: '2/4',
                    alignSelf: 'center',
                    justifySelf: 'center'
                  }} {...getRootProps()} className={dashboardCss['personal-avatar']}>
                    <FontAwesomeIcon style={{
                      fontSize: 128,
                      color: '#ffde3c'
                    }} icon={faShieldAlt} />
                    <input {...getInputProps()} />
                    <img style={{
                      borderRadius: "50%",
                      height: 64,
                      position: 'absolute',
                      left: 32,
                      width: 64,
                      top: 32
                    }} src={(files[0] && files[0].preview) || profile && 'avatarUri' in profile && `${profile.avatarUri}?type=avatar&&width=64&&height=64`} />
                  </div>
                </div>
              </div>
            </React.Fragment> : (id[1] == 'follow' ? <React.Fragment>
              <div style={{ alignItems: 'center' }} className={dashboardCss['box']}>
                {
                  histories.length > 0 ? histories.map((history, index) => {
                    return <React.Fragment key={randToken.generate(8)}>
                      <div className={dashboardCss['box-item']}>
                        <div onMouseEnter={() => setDelete(true)} onClick={() => setDelete(false)} className={dashboardCss['circle']}></div>

                        <div className={dashboardCss['info-container']}>
                          <img src={'http://localhost:3000/image/tantei-wa-mou-shindeiru.jpg?type=images&&width=64&&height=64'} />
                          <div className={dashboardCss['anime-wrapper']}>
                            <h1>{history.name}</h1>
                            <p>2:22s</p>
                            <p>2d</p>
                          </div>
                        </div>

                        <FontAwesomeIcon onClick={event => {
                          event.preventDefault()
                          dispatcher(writeHistory({
                            type: 'REMOVE',
                            start: index
                          }))
                          return false
                        }} style={isDelete ? {
                          display: 'block'
                        } : {
                          display: 'none'
                        }} icon={faTimesCircle} />
                      </div>
                    </React.Fragment>
                  })
                : <React.Fragment>
                  <FontAwesomeIcon style={{
                    fontSize: 144,
                    alignSelf: 'center',
                    flex: 1,
                    color: 'white'
                  }} icon={faBellSlash} />
                  <h1 style={{
                    flex: 1,
                    fontSize: 48,
                    color: 'white',
                    textShadow: '0px 3px red',
                    textAlign: 'center'
                  }}>
                    Bạn không có theo dõi bất cứ bộ anime nào hết
                  </h1>  
                </React.Fragment>}
              </div>
            </React.Fragment> : <React.Fragment>
              <section id={dashboardCss['welcome-home']}>
                <img src='https://i.ibb.co/pnrhkzn/angry-cat.png' width={72} height={72} />
                <p>Chào bạn đã đăng nhập thành công và chúc bạn luôn đón xem những bộ anime được cập nhật sớm có thể trên anime.com nhé!! Thân chào</p>
              </section>

              <section className={dashboardCss['dashboard-item']}>
                <h1 className={dashboardCss['dashboard-item-title']}>Lịch sử</h1>
                <div className={dashboardCss['dashboard-item-body']}>
                  {
                    histories.map(history => {
                      return <div className={dashboardCss['item-container']}>
                        <img className='image' src={`http://localhost:3000/image/${history.name.replace(/\-\bep\b\-\d+/gm, '')}.jpg?type=images&&width=64&&height=64`} />
                        <div style={{
                          gridTemplateRows: 'min-content min-content',
                          gridGap: 5, padding: '10px 0px'
                        }}  className={dashboardCss['item-body']}>
                          <h2 style={{ fontSize: 18 }} className={dashboardCss['item-title'] + ' text'}>
                            {
                              history.name.split('-').filter(i => i !== '').map(i => i[0].toUpperCase() + i.slice(1, i.length)).join(' ').replace(
                                history.name.split('-').filter(i => i !== '').join(' ').match(/\s{1}\bep\b\s{1}\d+/gm).join('').trim(),
                                ''
                              )
                            }
                          </h2>
                          <p style={{ fontSize: 12 }} className={dashboardCss['item-currentepisode'] + ' text'}>
                            {
                              history.name.split('-').filter(i => i !== '').join(' ').match(/\s{1}\bep\b\s{1}\d+/gm).join('').trim().replace('ep', 'Tập')
                            }
                          </p>
                          <p style={{ fontSize: 12 }} className={dashboardCss['item-currenttime'] + ' text'}>
                            {`${Math.floor(history.currentTime / 60)}:${Math.floor(history.currentTime % 60)}`}
                          </p>
                        </div>
                      </div>
                    })
                  }
                </div>
                <Link href={`/dashboard/${id[0]}/history`}>
                  <span>Xem thêm</span>
                </Link>
              </section>

              <section className={dashboardCss['dashboard-item']}>
                <h1 className={dashboardCss['dashboard-item-title']}>Theo dõi</h1>
                <div className={dashboardCss['dashboard-item-body']}>
                  {
                    followAnime.map(anime => {
                      return <a href={`http://localhost:3000/detail/anime/${anime.name}`}>
                        <div className={dashboardCss['item-container']}>
                          <img src={`${anime.imageUri}?type=images&&width=64&&height=64`} className='image' />
                          <div style={{ 
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', gap: 5
                          }} className={dashboardCss['item-body']}>
                            <h2 style={{ fontSize: 18 }} className={dashboardCss['item-name'] + ' text'}>
                              {anime.name.split('-').filter(item => item !== '').map(item => item[0].toUpperCase() + item.slice(1, item.length)).join(' ')}
                            </h2>
                            <p style={{ fontSize: 12 }} className={dashboardCss['item-vietnamesename'] + ' text'}>
                              {anime.vietnameseName}
                            </p>
                          </div>
                        </div>
                      </a>
                    })
                  }
                </div>
                <Link href={`/dashboard/${id[0]}/follow`}>
                  <span>Xem thêm</span>
                </Link>
              </section>
            </React.Fragment>))
          }

        </section>

      </section>
    </main>

  </React.Fragment>
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params

  return {
    props: {
      id: id
    }
  }
}