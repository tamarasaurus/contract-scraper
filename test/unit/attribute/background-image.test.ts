import * as assert from 'assert'
import BackgroundImage from '../../../src/attribute/background-image'

describe('creates a background image attribute', function() {
    it('extracts a full url from a style tag', function() {
        const image = new BackgroundImage(
            `color:red;background-image:url('http://website.com/images/whatever.jpeg')`,
            'http://website.com/'
        )

        assert.equal(image.getValue(), 'http://website.com/images/whatever.jpeg')
    })

    it('extracts a relative url from a style tag', function() {
        const image = new BackgroundImage(
            `color:red;background-image:url('../images/whatever.jpeg')`,
            'http://website.com/'
        )

        assert.equal(image.getValue(), 'http://website.com/images/whatever.jpeg')
    })
})
