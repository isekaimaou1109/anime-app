export function parseBody(rawBody) {
  const body = rawBody.split('\n')
  var result = {};
  for(let i = 0; i < body.length; i++) {
    if(/\bContent-Disposition: form-data; name\b\=\"([a-zA-Z0-9_-]+)\"/gm.test(body[i])) {
      var fieldName = body[i].match(/\"([a-zA-Z_]+)\"/gm).join('')
      result[`${fieldName.split('\"').join('')}`] = body[i + 2].split('\r').join('')
    }
  }
  return result
}
