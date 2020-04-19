import * as assert from 'assert';
import size from '../../../src/attribute/size';

describe('creates a size attribute', () => {
  it('extracts a size number from a mixed string', () => {
    assert.equal(size('the size is 123m² squared and number 10'), 123);
    assert.equal(size('the house is 10 m²'), 10);
    assert.equal(size('A vendre 4 pièces 93m²'), 93);
    assert.equal(size('Terrain 436 m² La Plaine Des Cafres'), 436);
    assert.equal(size('Maison de maître hyper centre de 300m2 avec vue'), 300);
    assert.equal(size('Terrain 1 001 m² Richebourg'), 1001);
    assert.equal(size('Du volume pour ce pavillon individuel de 1997'), null);
    assert.equal(size('Grand appartement F3/4 de 75m² avec balcon'), 75);
    assert.equal(
      size('Gennevilliers-Appt F4-76m² rénové +2 parkings+cave'),
      76,
    );
    assert.equal(size('Luxueux duplex 220m carré Grasse St Jean'), 220);
    assert.equal(size('42,13 m²'), 42);
    assert.equal(size('Maison 15mn de l’ocean, avec piscine 5X10 ,110m2'), 110);
    assert.equal(size('CENTRE HISTORIQUE ECUSSON T2 T3 55 m²'), 55);
  });

  it('returns a zero for an unparseable string', () => {
    assert.equal(size('There is no size in this string'), null);
  });

  it('returns null if the input is null or undefined', () => {
    assert.equal(size(null), null);
    assert.equal(size(undefined), null);
  });
});
