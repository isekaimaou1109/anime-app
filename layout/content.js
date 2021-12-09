import React from 'react'

import contentCss from '../styles/content.module.scss'

export default function Content({ content_1, content_2, className }) {
  return <section className={contentCss[`${className}-container`] + ' align'}>
    <section className={contentCss['content-wrapper']}>
      {content_1}
    </section>
    <section className={contentCss['content-wrapper']}>
      {content_2}
    </section>
  </section>
}