import React from 'react'
import { Helmet } from "react-helmet";
import axios from 'axios'

import Nav from '../layout/nav'
import Footer from '../layout/footer'
import Modal from '../layout/modal'
import Content from '../layout/categories-content'

import headerCss from '../styles/nav.module.scss'
import mainCss from '../styles/article.module.scss'

export default function CategoriesContainer({ data, totalPages }) {
  return <React.Fragment>
    <Helmet>
      <title>Trang tổng hợp</title>
    </Helmet>

    <header id={headerCss.header}>
      <Nav />
    </header>

    <main id={mainCss.main}>
      <Content data={data} totalPages={totalPages} />
    </main>

    <Footer />
    <Modal />
  </React.Fragment>
}

export async function getServerSideProps(context) {
  const { query } = context
  const { g, p } = query

  var pageNumber = parseInt(p) || 1

  var q = `
    query Query($query: String) {
      getAllAnimes(query: $query) {
        data {
          name
          vietnameseName
          genres
          imageUri
          views
          currentEpisode
          totalEpisode
        }
      }
    }
  `
  var variables = { query: g || 'all' }
  
  const data = {
    query: q,
    variables
  }

  const options = {
    method: 'POST',
    data: data,
    url: 'http://localhost:3000/graphql',
  };

  const listAnimes = await axios(options)
  const totalPages = listAnimes.data.data.getAllAnimes.data.length % 6 !== 0 ? Math.floor(listAnimes.data.data.getAllAnimes.data.length / 6) + 1 : Math.floor(pages.data.length / 6)
  var _pages = []

  for(let i = 0; i < totalPages; i++) {
    _pages.push(i + 1)
  }

  return {
    props: {
      data: listAnimes.data.data.getAllAnimes.data.slice((((pageNumber - 1) * 6) + 1), (pageNumber * 6) + 1),
      totalPages: _pages
    }
  }
}