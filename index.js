require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const { v4: uuid4 } = require('uuid')

const PORT = process.env.PORT || 5000
const BASE_URL = process.env.BASE_URL

const app = express()
app.use(express.json())
app.use(fileupload({ createParentPath: true }))

app.use('/', express.static('public'))

app.use('/file', express.static(path.join(__dirname, 'files')))

app.post('/upload', (req, res) => {
	try {
		if (!req.files) {
			res.json({
				error: "No file to upload."
			})
		} else {
			const file = req.files['file']
			const name = file.name
			const extension = name.substring(name.indexOf('.'), name.length)

			const new_name = `${uuid4()}${extension}`
			file.mv(path.join(__dirname, path.join('files', new_name)))

			res.json({
				message: "File uploaded.",
				name: new_name,
				type: file.mimetype,
				size: file.size,
				url: `${BASE_URL}/file/${new_name}`,
			})
		}
	} catch (_) {
		res.json({
			error: "Something went wrong."
		})
	}
})

app.listen(PORT, ()=>{
	console.log('Listening on port:', PORT)
})