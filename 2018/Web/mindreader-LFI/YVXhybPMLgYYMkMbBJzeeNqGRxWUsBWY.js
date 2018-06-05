const http = require('http');
const app = require('./core');
const fs = require('fs');
const indexJSNmae = __filename.split("\\").pop();

const indexPage = fs.readFileSync("index.html", 'utf8');
const notFoundPage = fs.readFileSync("404.html", 'utf8');

app.use('/', function(req, res){
  res.writeHead(200, {'MaybeYouNeedSome': 'JS'});
  res.end(indexPage);
});

app.use('/guess', (req, res)=>{
  var filter = (/\/|proc|dev|random|zero|stdout|stderr/g).test(req.query.f);
  if(filter===true){
    res.writeHead(403, {'msg': 'FlagNotHere'});
    res.end(notFoundPage);
  }else{
    res.writeHead(200, {'MaybeFlagInHere': '/flag?'});
    fs.readFile(`${__dirname}/${req.query.f}`, function (err, buffer) {
      if(err)res.end(notFoundPage);
      else res.end(buffer);
    });
  }
});

app.use('/flag', (req, res)=>{
  res.writeHead(403, {'iSayMaybeYouNeedSome': 'JS'});
  res.end(`no access`);
});

app.use(`/${indexJSNmae}`, (req, res)=>{
  res.writeHead(403, {'youNeed': 'Me'});
  res.end(`no access`);
});

app.use('/cat.js', (req, res)=>{
  res.writeHead(200, {'youNeedThisHint': 'Dont-believe-the-server'});
  res.end(fs.readFileSync("cat.js"));
});

app.use('/package.json', (req, res)=>{
  res.writeHead(403, {'n0-access': 'true'});
  res.end('no access');
});

app.use('/hint', (req, res)=>{
  res.writeHead(200, {'n0-access': 'true'});
  var hid = parseInt(req.query.n);
  var hintMessage = "";
  switch(hid){
    case 1:
      hintMessage = `<b>all response header</b><br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 2:
      hintMessage = `<b>you know how do use npm init?</b><br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 3:
      hintMessage = `<b>you know what is package.json?</b><br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 4:
      hintMessage = `<b>This is Local File include exploit</b><br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 5:
      hintMessage = `<b>If you do not have access, try use LFI on /guess?f={file}</b><br />`;
    break;
    default: hintMessage = `<b>Node.js Server</b><br /><a href="/hint?n=1">more</a>`;
  }
  res.end(hintMessage);
});

http.createServer(app.route).listen(3031);
//flag: ZTCTF{2018_06_L0ca1_Fi1e_inc1ude}
//this ideas come from Google CTF mindreader