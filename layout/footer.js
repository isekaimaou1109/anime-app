import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

import footerCss from '../styles/footer.module.scss'

export default function Footer() {
  const scrollToSmoothly = function(pos, time) {
    var currentPos = window.pageYOffset;
    var start = null;
    if(time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      var progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  }

  const scrollToTop = function(event) {
    event.preventDefault()
    scrollToSmoothly(0, window.innerHeight);
    return false
  }

  return <footer id={footerCss.footer}>
    <div className={footerCss.align}>
      <button onClick={event => scrollToTop(event)} className={footerCss.btn}>
        <FontAwesomeIcon icon={faChevronUp} />
      </button>


      <div className={footerCss.contact}>
        <div className={footerCss['image-align']}>
          <img src="/static/logo.png" alt="xx" />
        </div>

        <ul id={footerCss['footer-list']}>
          <li className={footerCss['footer-list-item']}>
            <span>Homepage</span>
          </li>


          <li className={footerCss['footer-list-item']}>
            <span>Categories</span>
          </li>

          <li className={footerCss['footer-list-item']}>
            <span>Our Blog</span>
          </li>

          <li className={footerCss['footer-list-item']}>
            <span>Contacts</span>
          </li>
        </ul>

        <p>
          Developed By nhat11092000@gmail.com
        </p>
      </div>
    </div>
  </footer>
}