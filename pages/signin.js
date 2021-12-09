import React from 'react'
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import Cookies from 'cookies'
import randToken from 'rand-token'  

import Nav from '../layout/nav'
import Footer from '../layout/footer'
import Modal from '../layout/modal'

import { process } from '../features/form/form'

import headerCss from '../styles/nav.module.scss'
import mainCss from '../styles/article.module.scss'
import loginCss from '../styles/login.module.scss'

export default function LoginComponent({ csrfToken }) {
  const clientId = useSelector(state => state.process.clientId)
  const [isHiddenPassword, setStatusPassword] = React.useState(true)
  const form = React.createRef()
  const dispatcher = useDispatch()

  const onLoginSubmit = function(event) {
    event.preventDefault()
    const specialRegex = /[><$]+/gm
    const passwordUpperCaseRegex = /[A-Z]{1,}/gm

    if(
      specialRegex.test(form.current.elements.username.value) && 
      specialRegex.test(form.current.elements.password.value)
    ) {
      form.current.elements.username.value = ''
      form.current.elements.password.value = ''
      alert('Your form not contain any characters such as \"<\", \">\", \"$\"')
      return false
    }

    if(form.current.elements.password.value.length > 12) {
      form.current.elements.password.value = ''
      alert('You need to press password field must longer than 12 characters')
      return false
    } else {
      if(
        !passwordUpperCaseRegex.test(form.current.elements.password.value) &&
        !/[a-z0-9]+/gm.test(form.current.elements.password.value)
      ) {
        form.current.elements.password.value = ''
        alert('Your password field not match format')
        return false
      }
    }

    const params = new FormData(form.current)
    params.append('username', CryptoJS.AES.encrypt(form.current.elements.username.value, csrfToken).toString())
    params.append('password', CryptoJS.AES.encrypt(form.current.elements.password.value, csrfToken).toString())
    params.append('_csrf', csrfToken)
  

    axios({
      method: 'POST',
      url: 'http://localhost:3000/api/hello',
      data: JSON.stringify({
        username: CryptoJS.AES.encrypt(form.current.elements.username.value, csrfToken).toString(),
        password: CryptoJS.AES.encrypt(form.current.elements.password.value, csrfToken).toString(),
        _csrf: csrfToken
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(response.status == 200) {
        if(response.data.clientId == null) {
          alert('Tài khoản này đã bị xóa do chính bạn.')
          window.location.assign(`http://localhost:3000`)
          return ;
        }
        dispatcher(process({
          type: 'LOGIN',
          isLogined: true,
          username: response.data.username,
          clientId: response.data.clientId,
          avatarUri: response.data.avatarUri
        }))
        window.location.assign(`http://localhost:3000/dashboard/${response.data.clientId}`)
        return
      }
      return
    })
    .catch((error) => {
      if (error.response) {
        if(error.response.status == 429) {
          if(error.response.headers['x-ratelimit-remaining'] == 0) {
            axios.get('https://localhost:3000/', {
              headers: {
                'X-RateLimit-Limit': error.response.headers['x-ratelimit-limit'],
                'X-RateLimit-Remaining': error.response.headers['x-ratelimit-remaining'],
                'X-RateLimit-Reset': error.response.headers['x-ratelimit-reset']
              }
            }).then(response => {
              if(response.status == 200) {
                window.location.assign('https://localhost:3000/')
              } 
            }).catch(() => console.log('error second'))
          }
        }
      }
    })

    return false
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Đăng nhập</title>
      </Helmet>

      <header id={headerCss.header}>
        <Nav />
      </header>

      <div className="intro">
        <h1 className="intro-title">LOGIN</h1>
        <p className="intro-description">Welcome to the official Anime blog.</p>
      </div>

      <main id={mainCss.main}>
        <section className={loginCss["space"] + " align"}>
          <section className={loginCss["login-form"]}>
            {/* item 1 */}
            <form onSubmit={(event) => onLoginSubmit(event)} ref={form} className={loginCss["login-form-item"]}>
              <h1 className={loginCss["form-title"]}>LOGIN</h1>

              <input type="hidden" name='_csrf' value={csrfToken}/>

              <div className={loginCss["field-parent"]}>
                {/* field 1 */}
                <div className={loginCss["field-container"]}>
                  <FontAwesomeIcon className={loginCss['icon']} icon={faLock} />
                  <input placeholder='Username' type="text" className={loginCss["field"]} autoComplete='off' autoCorrect={"false"} name="username" />
                </div>

                {/* field 2 */}
                <div className={loginCss["field-container"]}>
                  <FontAwesomeIcon className={loginCss['icon']} icon={faLock} />
                  <input placeholder='Password' type={isHiddenPassword ? "password" : "text"} className={loginCss["field"]} autoComplete='off' autoCorrect={"false"} name="password" />
                  <FontAwesomeIcon onClick={() => setStatusPassword(!isHiddenPassword)} className={loginCss['icon-p']} icon={isHiddenPassword ? faEyeSlash : faEye} />
                </div>
              </div>

              <div className={loginCss["button-container"]}>
                <button type="submit" className={loginCss['btn']} id={loginCss['login']}>
                  LOGIN NOW
                </button>

                <button className={loginCss['btn']} id={loginCss['forgot']}>
                  Forgot Your Password?
                </button>
              </div>
            </form>

            {/* item 2 */}
            <section className={loginCss["login-form-item"]}>
              <h1 className={loginCss["form-title"]}>Dont’t Have An Account?</h1>
              <button className={loginCss['btn']} id={loginCss['register']}>
                REGISTER NOW
              </button>
            </section>
          </section>

          {/* divider */}
          <p className={loginCss["divider"]}>OR</p>

          <section className={loginCss["login-button-container"]}>
            {/* btn 1 */}
            <a href='/auth/facebook' className={loginCss["btn"]} id={loginCss['facebook']}>
              <FontAwesomeIcon icon={faFacebook} />
              <p className={loginCss["btn-title"]}>SIGN IN WITH FACEBOOK</p>
            </a>

            {/* btn 2 */}
            <a href='/auth/google' className={loginCss["btn"]} id={loginCss['google']}>
              <FontAwesomeIcon icon={faGoogle} />
              <p className={loginCss["btn-title"]}>SIGN IN WITH GOOGLE</p>
            </a>

            {/* btn 3 */}
            <a href='/auth/github' className={loginCss["btn"]} id={loginCss['twitter']}>
              <FontAwesomeIcon icon={faGithub} />
              <p className={loginCss["btn-title"]}>SIGN IN WITH GITHUB</p>
            </a>
          </section>
        </section>
      </main>
    
      <Footer />

      <Modal />
    </React.Fragment>
  )
}

export async function getServerSideProps(context) {
  const { req, res } = context;

  if(req.method === 'GET') {
    let token = randToken.generate(24)
    const cookies = new Cookies(req, res)
    cookies.set('_csrf', token)
    return {
      props: {
        csrfToken: token
      }
    }
  }

  return {
    props: {
      ok: false,
      reason: "some error description for your own consumption, not for client side"
    }
  };
} 