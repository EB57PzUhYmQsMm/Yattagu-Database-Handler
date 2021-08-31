function replaceLast(find, replace, string) {
    var lastIndex = string.lastIndexOf(find);
    
    if (lastIndex === -1) {
        return string;
    }
    
    var beginString = string.substring(0, lastIndex);
    var endString = string.substring(lastIndex + find.length);
    
    return beginString + replace + endString;
}

/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this

function bom (blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false }
  else if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
  // probably in some web worker
  (typeof window !== 'object' || window !== _global)
    ? function saveAs () { /* noop */ }

  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
  : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
  ? function saveAs (blob, name, opts) {
    var URL = _global.URL || _global.webkitURL
    var a = document.createElement('a')
    name = name || blob.name || 'download'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob
      if (a.origin !== location.origin) {
        corsEnabled(a.href)
          ? download(blob, name, opts)
          : click(a, a.target = '_blank')
      } else {
        click(a)
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
      setTimeout(function () { click(a) }, 0)
    }
  }

  // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator
  ? function saveAs (blob, name, opts) {
    name = name || blob.name || 'download'

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts)
      } else {
        var a = document.createElement('a')
        a.href = blob
        a.target = '_blank'
        setTimeout(function () { click(a) })
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name)
    }
  }

  // Fallback to using FileReader and a popup
  : function saveAs (blob, name, opts, popup) {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup || open('', '_blank')
    if (popup) {
      popup.document.title =
      popup.document.body.innerText = 'downloading...'
    }

    if (typeof blob === 'string') return download(blob, name, opts)

    var force = blob.type === 'application/octet-stream'
    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

    if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader()
      reader.onloadend = function () {
        var url = reader.result
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
        if (popup) popup.location.href = url
        else location = url
        popup = null // reverse-tabnabbing #460
      }
      reader.readAsDataURL(blob)
    } else {
      var URL = _global.URL || _global.webkitURL
      var url = URL.createObjectURL(blob)
      if (popup) popup.location = url
      else location.href = url
      popup = null // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
    }
  }
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}

var template_blob = "|||||||sample_table||||1||id||int||120|||2||silly_string||string||3600|||3||chad_level||int||120|||4||is_cool||bool||0///////1||gamer||69||true|||2||ninja||[nil]||false|||||||sample_table2||||1||id||int||120|||2||silly_string||string||3600|||3||chad_level||int||120|||4||is_cool||bool||0///////1||gamer||69||true|||2||ninja||[nil]||false"

//function create_db(dbname) {
//  var blob = new Blob([dbname+template_blob],
//    { type: "text/plain;charset=utf-8" });
//            saveAs(blob, dbname+".txt");
//}

function save_db(db, location){}
function update_table(db, table){}
function update_row(db, table){}
function update_column(db, table){}
function query_table(db, table, query_statement){}
function query_db(db, query_statement){
var tables = db.split('|||||||')
var db_name = tables[0]
var q_s = query_statement.split(' ')
if (q_s[0] == 'SELECT' && q_s[1] == '*') {var tbs = []; var wtq=null; var rtr=null; if(q_s[3] == 'c_database'){wtq=tables; delete wtq[0];}; if(q_s[4] == 'WHERE'){for (var i = 1; i < wtq.length; i++){if(tables[i].split('||||')[0] == q_s[5].split('table_name')[1].split("'")[1]){return('true/////table already exists')}else{return('false/////table does not exist')}}}}
}
function create_table(db, name) {
var tables = db.split('|||||||')
var db_name = tables[0]
for (var i = 1; i < tables.length; i++) {
if (tables[i].split('||||')[0] == db_name) {
delete tables[i]
}
}
var new_tables = name+'||||1||id||int||120|||2||silly_string||string||3600|||3||chad_level||int||120|||4||is_cool||bool||0///////1||gamer||69||true|||2||ninja||[nil]||false|||||||'
for (var i = 1; i < tables.length; i++) {
if (tables[i] !== '') {  
new_tables = new_tables+tables[i]+'|||||||'
}
}
new_tables = new_tables.replaceAll('undefined|||||||', '')
new_tables = replaceLast('|||||||', '', new_tables)
return(new_tables)
}
function delete_table(db, table) {
var tables = db.split('|||||||')
for (var i = 1; i < tables.length; i++) {
if (tables[i].split('||||')[0] == table) {
delete tables[i]
}
}
var new_tables = ''
for (var i = 1; i < tables.length; i++) {
if (tables[i] !== '') {  
new_tables = new_tables+tables[i]+'|||||||'
}
}
new_tables = new_tables.replaceAll('undefined|||||||', '')
new_tables = replaceLast('|||||||', '', new_tables)
return new_tables
}