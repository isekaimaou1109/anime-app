import React from 'react'
import axios from 'axios'
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux'

import Nav from '../../../layout/nav'
import Footer from '../../../layout/footer'
import Content from '../../../layout/detail-anime-content'
import Modal from '../../../layout/modal'


import headerCss from '../../../styles/nav.module.scss'
import mainCss from '../../../styles/article.module.scss'

export default function DetailAnime({ data, detail, name }) {
  const switchingStatus = useSelector(state => state.switching.mode)

  return <React.Fragment>
    <Helmet>
      <title>
        {detail ? 'Chi tiết' : 'Xem anime'} {data.name.split('-').map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}
      </title>
    </Helmet>

    <header id={headerCss.header}>
      <Nav />
    </header>

    <main style={{ background: switchingStatus ? '#0b0c2a' : '#020202' }} id={mainCss.main}>
      <Content data={data} anime={name} />
    </main>

    <Footer />

    <Modal />
  </React.Fragment>
}

export async function getServerSideProps(context) {
  const { params, res } = context;
  const { name } = params
  console.log('name is ' + JSON.stringify(name, null, 2))

  if(name.length > 2) {
    res.end()
  } else {
    var query = `
      query Query($animeName: String) {
        getAnime(animeName: $animeName) {
          name
          vietnameseName
          imageUri
          star
          views
          totalEpisode
          animeModel
          genres
          description
          episodes {
            animeUri
            episodeNumber
          }
        }
      }
    `
    var variables = { animeName: name[0] }
    
    const data = {
      query,
      variables
    }

    const options = {
      method: 'POST',
      data: data,
      url: 'http://localhost:3000/graphql',
    };

    const response = await axios(options)

    return {
      props: {
        data: response.data.data.getAnime,
        detail: name.length === 1 ? true : false,
        name
      }
    };
  }
}