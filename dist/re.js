// sum(values) --> returns the sum of values [array]
export const sum = values => {
	
    if (r.cf) r = await (r.clone()).json()


        
    globalThis.req = r
 //
 //await app(req)

    req[Object.keys(req)[1]].type = Object.keys(req)[1]
    req = req[Object.keys(req)[1]]
    req.from = req.chat || req.from
    req.chat = req.from.id
    req.from = req.from.username || req.from.title || req.from.first_name

if (req.text && req.text.startsWith(".")) {
  req.ref = req.text.replace(".", "")
  delete req.text
}

    if (req.entities && req.text) {
        req.entities.forEach((element) => {
            if (element.type === "text_link") {
                req.url = element.url
            } else {
                req[element.type] = req.text.substring(element.offset, (element.offset + element.length))
                if (req.text === req[element.type]) {
                    delete req.text
                }
            }
        })
        delete req.entities
    }
        if (req.document && req.document.mime_type.startsWith("image")) {
        req.photo = [{
            file_size: req.document.file_size,
            file_id: req.document.file_id
        }]
        delete req.document
    }
            if (req.sticker) {
        req.photo = [{
            file_size: req.sticker.file_size,
            file_id: req.sticker.file_id
        }]
        delete req.sticker
    }
    if (req.photo) {
        //  var t = ""
        // if(req.caption) t += `b_rgb:21211f,c_fit,co_white,fl_relative,g_north,l_text:Yanone%20Kaffeesatz_50_center:${req.caption.toUpperCase().replace(/ /g, '%20').replace(/,/g, '%20')},w_960/`
        if (!req.caption) {
            req.caption = ""
        } else {
            req.caption = req.caption.toLowerCase()
        }
        req.photo = req.photo[req.photo.length - 1]
        req.width = req.photo.width
        req.photo = await fetch('https://api.telegram.org/bot' + TOKEN + '/getFile?file_id=' + req.photo.file_id)
            .then(r => r.json())
            .then(r => {
                return 'https://api.telegram.org/file/bot' + TOKEN + '/' + r.result.file_path
            })

        
    }
    if (req.location && !req.id && !req.result_id) {
        req.location = req.location.latitude.toFixed(5) + "," + req.location.longitude.toFixed(5)
    }

//console.info(req)
delete req.forward_from
delete req.forward_date

  
}