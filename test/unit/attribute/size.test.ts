import * as assert from 'assert';
import Size from '../../../src/attribute/size';

describe('creates a size attribute', () => {
    it('extracts a size number from a mixed string', () => {
        assert.equal(new Size('the size is 123m² squared and number 10').value, 123);
        assert.equal(new Size('the house is 10 m²').value, 10);
        assert.equal(new Size('A vendre 4 pièces 93m²').value, 93);
        assert.equal(new Size('Terrain 436 m² La Plaine Des Cafres').value, 436);
        assert.equal(new Size('Maison de maître hyper centre de 300m2 avec vue').value, 300);
        assert.equal(new Size('Terrain 1 001 m² Richebourg').value, 1001);
        assert.equal(new Size('Du volume pour ce pavillon individuel de 1997').value, null);
        assert.equal(new Size('Grand appartement F3/4 de 75m² avec balcon').value, 75);
        assert.equal(new Size('Gennevilliers-Appt F4-76m² rénové +2 parkings+cave').value, 76);
        assert.equal(new Size('Luxueux duplex 220m carré Grasse St Jean').value, 220);
        assert.equal(new Size('42,13 m²').value, 42);
        assert.equal(new Size('Maison 15mn de l’ocean, avec piscine 5X10 ,110m2').value, 110);
        assert.equal(new Size('CENTRE HISTORIQUE ECUSSON T2 T3 55 m²').value, 55);
    });

    it('returns a zero for an unparseable string', () => {
        assert.equal(new Size('There is no size in this string').value, null);
    });

    it('returns null if the input is null or undefined', () => {
        assert.equal(new Size(null).value, null);
        assert.equal(new Size(undefined).value, null);
    });
});
