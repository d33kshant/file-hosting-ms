require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const { v4: uuid4 } = require('uuid')

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(fileupload({ createParentPath: true }))

app.use('/', express.static('public'))

app.post('/upload', (req, res) => {
	try {
		if (!req.files) {
			res.json({
				error: "No file to upload."
			})
		} else {
			const image = req.files['image']
			const name = image.name
			const extension = name.substring(name.indexOf('.'), name.length)

			const new_name = `${uuid4()}${extension}`
			image.mv(path.join(__dirname, path.join('files', new_name)))

			res.json({
				message: "File uploaded.",
				name: new_name,
				type: image.mimetype,
				size: image.size
			})
		}
	} catch (error) {
		res.json({
			error
		})
	}
})

app.listen(PORT, ()=>{
	console.log('Listening on port:', PORT)
})