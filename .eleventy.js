const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)

module.exports = function (config) {

	const { readdir, stat } = require('fs/promises')


	config.addWatchTarget('./src/assets/css/')
	config.addWatchTarget('./src/assets/scripts/')
	config.addWatchTarget('./src/*.js')

	config.setWatchJavaScriptDependencies(true)

	config.setUseGitIgnore(false)

	config.addPassthroughCopy('./src/*.css')
	config.addPassthroughCopy('./src/*.js')

	config.addPassthroughCopy('./src/*/*.png')
	config.addPassthroughCopy('./src/*/*.jpg')
	config.addPassthroughCopy('./src/*/*.jpeg')
	config.addPassthroughCopy('./src/*/*.webp')
	config.addPassthroughCopy('./src/old_2022/')
	config.addPassthroughCopy('./src/*/*.webm')



	config.addCollection("mergedCollection", async function (collections) {

		function onlyImages(file) {
			const isImage = new RegExp(/\.(png|jpg|jpeg|gif|webp|webm)$/g)
			if (isImage.test(file.name)) {
				return true
			}
			else { return false }
		}


		function isVideo(file) {
			const isVideo = new RegExp(/\.(mp4|webm)$/g)
			if (isVideo.test(file.name)) {
				return true
			}
			else {
				return false
			}
		}

		async function gettingCommitedDate(basePath, fileName) {
			const { name } = fileName
			const command = `git log -1 --pretty=\"format:%ct\" \"${basePath}\/${name}\"`
			try {
				const { stdout } = await exec(command)
				return {
					name,
					time: Number(stdout)
				}
			} catch (e) {
				if (e instanceof Error) {
					console.log(new Error(`Failed executing ${command} with ${e.message}`))
				}
				const metadata = await stat(`${basePath}/${name}`)
				return {
					name,
					time: metadata.mtime.getTime()
				}
			}
		}

		try {
			const basePath = 'src/images/'
			const dir = await readdir(basePath, { withFileTypes: true })

			const posts = collections.getFilteredByTag('post')

			const sortedSnaps = (
				await Promise.all(dir
					.map(fileName => gettingCommitedDate(basePath, fileName))
				)).filter(onlyImages)
				.map(file => {

					let data = {
						date: new Date(file.time * 1000)
					}
					if (isVideo(file)) {
						data.name = file.name
						data.vid = true
						return data
					} else {
						data.name = file.name
						data.img = true
						return data
					}
				})
				.reverse()

			const mergedCollec = sortedSnaps.concat(posts)
			return mergedCollec.sort(function (a, b) {
				return b.date - a.date
			})
		} catch (err) {
			console.error(err)
		}
	})

	config.addFilter('formatDate', function (date) {
		return date.toLocaleDateString('FR-FR')
	})

	return {
		dir: {
			input: 'src',
			output: 'public_html',
		},
		passthroughFileCopy: true,
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk'

	}
}