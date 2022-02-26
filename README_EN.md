<div align="right">
  Language:
  English
  <a title="中文" href="/README.md">中文</a>
</div>

<h1 align="center"><a href="https://github.com/lete114/Body-Data" target="_blank">Body-Data</a></h1>
<p align="center">A lightweight, small Node.js module for retrieving GET or POST request data</p>

<p align="center">
    <a href="https://github.com/Lete114/Body-Data/releases/"><img src="https://img.shields.io/npm/v/body-data" alt="Version"></a>
    <a href="https://github.com/Lete114/Body-Data/tree/main"><img src="https://img.shields.io/github/package-json/v/Lete114/Body-Data/main?color=%231ab1ad&label=main" alt="dev"></a>
    <a href="https://github.com/Lete114/Body-Data/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Lete114/Body-Data?color=FF5531" alt="MIT License"></a>
</p>

## Installation

```bash
npm install Body-Data --save
```

## Getting Started

```js
// client
const script = document.createElement('script')
script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.js'
document.head.append(script)

const url = 'http://127.0.0.1:6870'
axios.get(url, { params: { name: 'Lete', age: 18 } })
axios.post(url, { name: 'Lete', age: 18 })

// server
const bodyData = require('body-data')
const http = require('http')

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset:utf-8;')
  const data = await bodyData(req)
  res.end(JSON.stringify(data)) // output: { name: 'Lete', age: 18 }
})

server.listen(6870)
```
