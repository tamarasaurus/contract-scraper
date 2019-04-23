import * as assert from 'assert';
import Size from '../../../src/attribute/size';


describe('creates a size attribute', () => {
    it('extracts a size number from a mixed string', () => {
        assert.equal(new Size('the size is 123m² squared and number 10').getValue(), 123);
        assert.equal(new Size('the house is 10 m²').getValue(), 10);
        assert.equal(new Size('A vendre 4 pièces 93m²').getValue(), 93);
        assert.equal(new Size('Terrain 436 m² La Plaine Des Cafres').getValue(), 436);
        assert.equal(new Size('Maison de maître hyper centre de 300m2 avec vue').getValue(), 300);
        assert.equal(new Size('Terrain 1 001 m² Richebourg').getValue(), 1001);
        assert.equal(new Size('Du volume pour ce pavillon individuel de 1997').getValue(), 0);
        assert.equal(new Size('Grand appartement F3/4 de 75m² avec balcon').getValue(), 75);
        assert.equal(new Size('Gennevilliers-Appt F4-76m² rénové +2 parkings+cave').getValue(), 76);
        assert.equal(new Size('Luxueux duplex 220m carré Grasse St Jean').getValue(), 220);
        assert.equal(new Size('42,13 m²').getValue(), 42);
        assert.equal(new Size('Maison 15mn de l’ocean, avec piscine 5X10 ,110m2').getValue(), 110);
        assert.equal(new Size('CENTRE HISTORIQUE ECUSSON T2 T3 55 m²').getValue(), 55);
    });

    it('returns a zero for an unparseable string', () => {
        assert.equal(new Size('There is no size in this string').getValue(), 0);
    });

    it('returns null if the input is null or undefined', () => {
        assert.equal(new Size(null).getValue(), null);
        assert.equal(new Size(undefined).getValue(), null);
    });
});
