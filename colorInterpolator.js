/**
 * Converts an Hex string into an [r,g,b] array
 * @param {String} hex | String containing an hex color
 */
function h2r (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result ? [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ] : null
}

/**
 * Converts an [r,g,b] array into an Hex string
 * @param {Array} rgb | Array containing Red, Green and Blue values between 0 and 255
 */
function r2h (rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
}

/**
 *
 * @param {*} color1
 * @param {*} color2
 * @param {*} factor
 */
function _interpolateColor (color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5
  }

  var result = color1.slice()
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
  }

  return result
};

function rgb2hsl (color) {
  var r = color[0] / 255;
  var g = color[1] / 255;
  var b = color[2] / 255;

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min))
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break;
      case g:
        h = (b - r) / d + 2
        break;
      case b:
        h = (r - g) / d + 4
        break;
    }
    h /= 6
  }

  return [h, s, l]
}

function hsl2rgb (color) {
  var l = color[2]

  if (color[1] == 0) {
    l = Math.round(l * 255)
    return [l, l, l]
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p;
    }

    var s = color[1]
    var q = (l < 0.5 ? l * (1 + s) : l + s - l * s)
    var p = 2 * l - q
    var r = hue2rgb(p, q, color[0] + 1 / 3)
    var g = hue2rgb(p, q, color[0])
    var b = hue2rgb(p, q, color[0] - 1 / 3)
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
}

function _interpolateHSL (color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5
  }
  var hsl1 = rgb2hsl(color1)
  var hsl2 = rgb2hsl(color2)
  for (var i = 0; i < 3; i++) {
    hsl1[i] += factor * (hsl2[i] - hsl1[i])
  }
  return hsl2rgb(hsl1)
}

function _obtainArrayOfInterpolatedColors (color1, color2, step) {
  let scol = h2r(color1)
  let ecol = h2r(color2)
  var fn = '_interpolateColor'

  var factorStep = 1 / (step - 1)
  let arrayOfColors = []
  for (i = 0; i < step; i++) {
    let icol = window[fn](scol, ecol, factorStep * i)
    let hcol = r2h(icol)
    arrayOfColors.push(hcol)
  }
  return arrayOfColors
}
