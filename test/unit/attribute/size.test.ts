import size from '../../../src/attribute/size';
import { expect, describe, it } from 'vitest'

describe('creates a size attribute', () => {
  it('extracts a size number from a mixed string', () => {
    expect(size('the size is 123m² squared and number 10')).toEqual(123);
    expect(size('the house is 10 m²')).toEqual(10);
    expect(size('A vendre 4 pièces 93m²')).toEqual(93);
    expect(size('Terrain 436 m² La Plaine Des Cafres')).toEqual(436);
    expect(size('Maison de maître hyper centre de 300m2 avec vue')).toEqual(
      300,
    );
    expect(size('Terrain 1 001 m² Richebourg')).toEqual(1001);
    expect(size('Du volume pour ce pavillon individuel de 1997')).toEqual(null);
    expect(size('Grand appartement F3/4 de 75m² avec balcon')).toEqual(75);
    expect(size('Gennevilliers-Appt F4-76m² rénové +2 parkings+cave')).toEqual(
      76,
    );
    expect(size('Luxueux duplex 220m carré Grasse St Jean')).toEqual(220);
    expect(size('42,13 m²')).toEqual(42);
    expect(size('Maison 15mn de l’ocean, avec piscine 5X10 ,110m2')).toEqual(
      110,
    );
    expect(size('CENTRE HISTORIQUE ECUSSON T2 T3 55 m²')).toEqual(55);
  });

  it('returns a zero for an unparseable string', () => {
    expect(size('There is no size in this string')).toEqual(null);
  });
});
