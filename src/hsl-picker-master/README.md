# What's so great about HSL

HSL (Hue, Saturation, Luminosity) allows us to describe meaningful relationships between colors. Give this brown color, `hsl(36, 73%, 10%)`, it's clear that if we desaturate 40 steps and lighten 70 steps we get `hsl(36, 33%, 80%)`, a cream color. Look at that in hex, `#2C1D07` to `#DDCFBB`, or in rgb, `rgb(44, 29, 7)` to `rgb(221, 207, 187)`, and the relationship between colors isn't evident in any meaningful way.

I use [Compass](http://beta.compass-style.org/) and [Sass](http://sass-lang.com/) for all of my web design work and there are great color functions that allow me to manipulate colors using these relationships. I can use Sass's adjust-color to convert brown to cream like in the example above.

    adjust-color(#2C1D07, $saturation: -40%, $lightness: 70%)
    //returns #DDCFBB

Sass converts easily between rgb, hsl, and hex so I can have convenience of HSL color relationships but the browser compatibility of hex color notation. There are other color functions like change-color which lets you set the properties of a color, and scale-color which applies color transformations on a relative scale. These are great, but because they work like HSL, you have to understand how HSL works.

## HSB != HSL

In graphics software I pick colors in HSB (Hue, Saturation, Brightness) because it feels more natural to work with than RGB or CMYK. Now, with CSS3 we can use HSL which is actually quite different than HSB. Without a decent HSL color picker, it's difficult to understand.

## How to think in HSL

Pick a Hue from 0 to 360 and with saturation at 100 and lightness at 50 and you'll have the purest form of that color. Reduce the saturation and you move towards gray. Increasing the brightness moves you towards white, decreasing it moves you towards black.

## License

Copyright (c) 2011 Brandon Mathis

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
