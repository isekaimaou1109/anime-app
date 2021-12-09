import React from 'react'
import { Helmet } from "react-helmet";

import Nav from '../layout/nav'
import Footer from '../layout/footer'
import Article from '../layout/article'
import Content from '../layout/index-content'
import Modal from '../layout/modal'

import headerCss from '../styles/nav.module.scss'
import mainCss from '../styles/article.module.scss'

export default function Home() {
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
        <Content />
      </main>
    
      <Footer />

      <Modal />
    </React.Fragment>
  )
}