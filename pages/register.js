import React from 'react'
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

import Nav from '../layout/nav'
import Footer from '../layout/footer'
import Article from '../layout/article'
// import Content from '../layout/content'

import { modal } from '../features/modal-status/modal'

import headerCss from '../styles/nav.module.scss'
import mainCss from '../styles/article.module.scss'

export default function Home() {
  const modalStatus = useSelector(state => state.modal.modalStatus)
  const dispatcher = useDispatch()
  const onCloseQuery = function(event) {
    event.preventDefault()
    console.log(modalStatus)
    dispatcher(modal(false))
    return false
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>

      <header id={headerCss.header}>
        <Nav />
      </header>

      <main id={mainCss.main}>
        <Article />
        {/* <Content /> */}
      </main>
    
      <Footer />

      <div id={modalStatus ? 'modal' : 'closed'}>
        <div id='modal-wrapper'>
          <FontAwesomeIcon icon={faEnvelope} onClick={(event) => onCloseQuery(event)} />
          <input 
            type='text' 
            name='animename' 
            placeholder='Please type your anime name...' 
            id='query-anime' />
        </div>
      </div>
    </React.Fragment>
  )
}