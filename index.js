const piece = require('gulp-piece')
const ssg = require('gulp-ssg')
const rename = require('gulp-rename')
const tap = require('gulp-tap')
const wrap = require('gulp-wrap')
const matter = require('gulp-front-matter')
const gutil = require('gulp-util')
const MarkdownIt = require('markdown-it')

module.exports = params => {
  params = params || {}
  params.plugins = params.plugins || []

  const md = new MarkdownIt()

  params.plugins.forEach(plugin => md.use(plugin))

  return piece(
    matter({ property: 'data', remove: true }),
    tap(file => {
      file.contents = new Buffer(md.render(file.contents.toString()))
    }),
    rename({ extname: '.html' }),
    ssg(),
    wrap(params.template, params.data, { engine: params.engine })
      .on('error', err => gutil.log(
        gutil.colors.red('Error (gulp-html-book)'),
        err.code,
        err.message))
  )
}
