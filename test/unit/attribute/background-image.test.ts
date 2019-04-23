import * as assert from 'assert'
import BackgroundImage from '../../../src/attribute/background-image'

const rootUrl = 'http://website.com/'
const imageUrl = 'http://website.com/images/whatever.jpeg'

describe('creates a background image attribute', function () {
    it('extracts a full url from a style tag', function () {
        const fullUrl = `color:red;background-image:url('${imageUrl}')`;
        const image = new BackgroundImage(fullUrl, rootUrl)

        assert.equal(image.getValue(), imageUrl)
    })

    it('extracts a relative url from a style tag', function () {
        const relativeUrl = `color:red;background-image:url('../images/whatever.jpeg')`
        const image = new BackgroundImage(relativeUrl, rootUrl)
        assert.equal(image.getValue(), imageUrl)
    })

    it('extracts a url with spacing', function () {
        const urlWithSpacing = `whatever:blah; background-image: url('${imageUrl}')`
        const imageWithSpacing = new BackgroundImage(urlWithSpacing, rootUrl)
        assert.equal(imageWithSpacing.getValue(), imageUrl)
    })

    it('extracts a url without spacing', function () {
        const urlWithoutSpacing = `whatever:blah; background-image:url('${imageUrl}')`
        const imageWithoutSpacing = new BackgroundImage(urlWithoutSpacing, rootUrl)
        assert.equal(imageWithoutSpacing.getValue(), imageUrl)
    })

    it('extracts a url without quotes', function () {
        const urlWithoutQuotes = `whatever:blah; background-image:url(${imageUrl})`
        const imageWithoutQuotes = new BackgroundImage(urlWithoutQuotes, rootUrl)
        assert.equal(imageWithoutQuotes.getValue(), imageUrl)
    })

    it('extracts a url with single quotes', function () {
        const urlWithSingleQuotes = `whatever:blah; background-image:url('${imageUrl}')`
        const imageWithSingleQuotes = new BackgroundImage(urlWithSingleQuotes, rootUrl)
        assert.equal(imageWithSingleQuotes.getValue(), imageUrl)
    })

    it('extracts a url with double quotes', function () {
        const urlWithDoubleQuotes = `whatever:blah; background-image:url("${imageUrl}")`
        const imageWithDoubleQuotes = new BackgroundImage(urlWithDoubleQuotes, rootUrl)
        assert.equal(imageWithDoubleQuotes.getValue(), imageUrl)
    })
})
