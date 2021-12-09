import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SocketIOClient from "socket.io-client";
import axios from 'axios'
import randToken from 'rand-token'

import commentCss from '../styles/comment.module.scss'

export default function CommentContainer({ style, animeName }) {
  const dispatcher = useDispatch()
  const isLogined = useSelector(state => state.process.isLogined)
  const username = useSelector(state => state.process.username)
  const [msg, setMsg] = React.useState('')
  const [comments, setComments] = React.useState([])

  React.useEffect(() => {
    const socket = SocketIOClient.connect('http://localhost:3000', {
      path: "/api/io",
    });

    const query = `
      query Query($animeName: String) {
        getAnime(animeName: $animeName) {
          comments {
            username
            message,
            createdAt
          }
        }
      }
    `
    const variables = {
      animeName: typeof window !== "undefined" ? window.location.pathname.split('/').filter(item => item != '')[2] : ''
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
      setComments(response.data.data.getAnime.comments)
    }).catch(() => console.log('cannot fetch'))

    if (socket) return () => socket.disconnect();

    return false
  }, [])

  const onPressEnterKey = function(event) {
    console.log('key code is ' + event.key)
    if(event.keyCode === 13) {
      if(!isLogined) {
        alert('Chưa đăng nhập mà đòi cmt thì còn cái nịt')
      } else {
        axios.post('http://localhost:3000/api/chat', JSON.stringify({
          username: username,
          message: msg,
          animeName: animeName
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(returnMsg => {
          console.log('return message is ' + returnMsg)
        }).catch(() => console.log('cannot get msg'))
      }
    }
    return false
  }

  return <section style={style || {}} id={commentCss['comment-container']}>
    <section className={commentCss['comment-input']}>
      <img src={username ? `http://localhost:3000/image/${username}.jpg?type=avatar&&width=32&&height=32` : 'http://localhost:3000/static/anonymous.jpg'} />
      <input 
        className={commentCss['input']}
        onKeyDown={(event) => onPressEnterKey(event)} 
        placeholder={'Hãy comment ở đây vì những người đi sau biết đc liệu anime này hay hay không.'} 
        type='text'
        autoComplete={'off'}
        autoCorrect={'false'}
        onChange={event => setMsg(event.target.value)}
      />
    </section>

    <section className={commentCss['comment-area']}>
      {
        comments.map(comment => {
          var time = new Date().getFullYear() > new Date(comment.createdAt).getFullYear()
            ? `${new Date().getFullYear() -  new Date(comment.createdAt).getFullYear()}y` : 
            (
              new Date().getMonth() > new Date(comment.createdAt).getMonth() ? 
              `${new Date().getMonth() - new Date(comment.createdAt).getMonth()}m` :
              (
                new Date().getDate() > new Date(comment.createdAt).getDate() ?
                `${new Date().getDate() - new Date(comment.createdAt).getDate()}d` :
                (
                  new Date().getHours() > new Date(comment.createdAt).getHours() ?
                  `${new Date().getHours() - new Date(comment.createdAt).getHours()}h` :
                  (
                    new Date().getMinutes() > new Date(comment.createdAt).getMinutes() ? 
                    `${new Date().getMinutes() - new Date(comment.createdAt).getMinutes()}m`: 
                    (
                      new Date().getSeconds() > new Date(comment.createdAt).getSeconds() ? 
                      `${new Date().getSeconds() - new Date(comment.createdAt).getSeconds()}s`:
                      '0s'
                    )
                  )
                )
              )
            )
          return <div key={randToken.generate(8)} className={commentCss['chat-item']}>
            <img src={`http://localhost:3000/image/${comment.username}.jpg?type=avatar&&width=32&&height=32`} /> 
    
            <div className={commentCss['chat-item-body']}>
              <h3 className={commentCss['username']}>{comment.username}</h3>
              <p className={commentCss['message']}>{comment.message}</p>
              <pre className={commentCss['date']}>{time}</pre>
            </div>
          </div>
        })
      }
    </section>
  </section>
}