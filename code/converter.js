class Color {
	constructor() {
		if(this.constructor === Color.constructor) {
			throw new Error("Abstract class, can't be instantiated.");
		}
	}

	/* Getters */

	get updatePropertyCallback() {
		return this._updatePropertyCallback;
	}

	/* Setters */

	set updatePropertyCallback(func) {
		// http://stackoverflow.com/a/6000016
		if (!!(func && func.constructor && func.call && func.apply)) {	// eslint-disable-line no-extra-boolean-cast
			this._updatePropertyCallback = func;
		}
	}

	/* Methods */

	_padBegin(string, length, padChar) {
		if(!(padChar)){
			padChar = "0";
		}

		while(string.length < length) {
			string = padChar.concat(string);
		}

		return string;
	}

	_validateNormalizedFloat(value) {
		return (0.0 <= value && value <= 1.0);
	}

	_validateDegrees(value) {
		return (0 <= value && value <= 359);
	}

	attemptInvokeUpdatePropertyCallback(propertyName) {
		if(this.updatePropertyCallback) {
			this.updatePropertyCallback(propertyName);
		}
	}

	_toInt(value) {
		return Math.floor(value);
	}

	_toPercent(value) {
		return Math.round(value * 100);	
	}

	toString() {

	}

	/* Conversion Methods */

	toRGB() {
		return this.toRGB();
	}

	toHex() {
		return this.toRGB().toHex();
	}

	toCMYK() {
		return this.toRGB().toCMYK();
	}

	toHSL() {
		return this.toRGB().toHSL();
	}

	toHSV() {
		return this.toRGB().toHSV();
	}
}

class RGB extends Color {
	// r, g, b all ints between 0 and 255 (inclusive) or undefined
	constructor(r, g, b, updatePropertyCallback) {
		super();

		this.r = r;
		this.g = g;
		this.b = b;
		this.updatePropertyCallback = updatePropertyCallback;
	}

	/* Getters */

	get r() {
		return this._r;
	}

	get g() {
		return this._g;
	}

	get b() {
		return this._b;
	}

	/* Setters */

	set r(value) {
		if(value === undefined) {
			this._r = undefined;
		}
		else {
			value = this._toInt(value);
			if(this._validateRGB(value)) {
				this._r = value;
			}
		}
		this.attemptInvokeUpdatePropertyCallback("r");
	}

	set g(value) {
		if(value === undefined) {
			this._g = undefined;
		}
		else {
			value = this._toInt(value);
			if(this._validateRGB(value)) {
				this._g = value;
			}
		}
		this.attemptInvokeUpdatePropertyCallback("g");
	}

	set b(value) {
		if(value === undefined) {
			this._b = undefined;
		}
		else {
			value = this._toInt(value);
			if(this._validateRGB(value)) {
				this._b = value;
			}
		}
		this.attemptInvokeUpdatePropertyCallback("b");
	}

	/* Methods */

	_validateRGB(value) {
		return (0 <= value && value <= 255);
	}

	_calcHue(r, g, b, max, delta) {
		let h;
		if(delta === 0) {
			h = 0;
		}
		else if(max === r) {
			h = 60 * (((g - b) / delta) % 6);
		}
		else if(max === g) {
			h = 60 * (((b - r) / delta) + 2);
		}
		else if(max === b) {
			h = 60 * (((r - g) / delta) + 4);
		}

		return h;
	}

	toString() {
		return "".concat(this.r, ", ", this.g, ", ", this.b);
	}

	toCSS() {
		return "".concat("rgb(", this.toString(), ")");
	}

	/* Conversion Methods */

	toRGB() {
		return this;
	}

	toHex() {
		let self = this;
		let tryHexConversion = function(value) {
			try {
				return self._padBegin(value.toString(16), 2, "0");
			}
			catch (e) {
				if(e instanceof TypeError) {
					return undefined;
				}
			}
		};

		let r = tryHexConversion(this.r);
		let g = tryHexConversion(this.g);
		let b = tryHexConversion(this.b);

		return new Hex(r, g, b);
	}

	toCMYK() {
		/* http://www.rapidtables.com/convert/color/rgb-to-cmyk.htm */
		let r_ = this.r / 255;
		let g_ = this.g / 255;
		let b_ = this.b / 255;

		let k = 1 - Math.max(r_, g_, b_);
		let c = (1 - r_ - k) / (1 - k);
		let m = (1 - g_ - k) / (1 - k);
		let y = (1 - b_ - k) / (1 - k);

		return new CMYK(c, m, y, k);
	}

	toHSL() {
		/* http://www.rapidtables.com/convert/color/rgb-to-hsl.htm */
		let r_ = this.r / 255;
		let g_ = this.g / 255;
		let b_ = this.b / 255;
		let max = Math.max(r_, g_, b_);
		let min = Math.min(r_, g_, b_);
		let delta = max - min;

		let h = this._calcHue(r_, g_, b_, max, delta);

		let l = (max + min) / 2;

		let s;
		if(delta === 0) {
			s = 0;
		}
		else {
			s = delta / (1 - Math.abs(2 * l - 1));
		}

		return new HSL(h, s, l);
	}

	toHSV() {
		/* http://www.rapidtables.com/convert/color/rgb-to-hsv.htm */
		let r_ = this.r / 255;
		let g_ = this.g / 255;
		let b_ = this.b / 255;
		let max = Math.max(r_, g_, b_);
		let min = Math.min(r_, g_, b_);
		let delta = max - min;

		let h = this._calcHue(r_, g_, b_, max, delta);

		let s;
		if(max === 0) {
			s = 0;
		}
		else {
			s = delta / max;
		}

		let v = max;

		return new HSV(h, s, v);
	}
}

class Hex extends Color {
	// r, g, b all hex strings between 00 and FF (inclusive) or undefined
	constructor(r, g, b, updatePropertyCallback) {
		super();

		this.r = r;
		this.g = g;
		this.b = b;
		this.updatePropertyCallback = updatePropertyCallback;
	}

	/* Getters */

	get r() {
		if(this._r === undefined) {
			return "";
		}
		else {
			return this._r;
		}
	}

	get g() {
		if(this._g === undefined) {
			return "";
		}
		else {
			return this._g;
		}
	}

	get b() {
		if(this._b === undefined) {
			return "";
		}
		else {
			return this._b;
		}
	}

	get hex() {
		return "".concat(this.r, this.g, this.b);
	}

	/* Setters */

	set r(value) {
		if(this._validateHexComponent(value)) {
			if(this.hex.length > 2) {
				this._r = this._padBegin(value, 2, "0");
			}
			else {
				this._r = value;
			}
		}
		else if(value === undefined) {
			this._r = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("r");
	}

	set g(value) {
		if(this._validateHexComponent(value)) {
			if(this.hex.length > 4) {
				this._g = this._padBegin(value, 2, "0");
			}
			else {
				this._g = value;
			}
		}
		else if(value === undefined) {
			this._g = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("g");
	}

	set b(value) {
		if(this._validateHexComponent(value)) {
			if(this.hex.length > 6) {
				this._b = this._padBegin(value, 2, "0");
			}
			else {
				this._b = value;
			}
		}
		else if(value === undefined) {
			this._b = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("b");
	}

	set hex(value) {
		/* TODO: better name */
		let calcSliceValue = function(string, start, end) {
			let result = string.slice(start, end);
			if(result === "") {
				return undefined;
			}
			else {
				return result;
			}
		};

		this.r = calcSliceValue(value, 0, 2);
		this.g = calcSliceValue(value, 2, 4);
		this.b = calcSliceValue(value, 4, 6);

		this.attemptInvokeUpdatePropertyCallback("hex");
	}

	/* Methods */

	_validateHex(hexString) {
		return /[0-9a-fA-F]{1,6}/.test(hexString);
	}

	_validateHexComponent(hexString) {
		if(hexString) {
			return (this._validateHex(hexString) && hexString.length <= 2);
		}
	}

	toString() {
		return this.hex;
	}

	toCSS() {
		return "".concat("#", this.r, this.g, this.b);
	}

	/* Conversion Methods */

	toRGB() {
		let r = parseInt(this.r, 16);
		let g = parseInt(this.g, 16);
		let b = parseInt(this.b, 16);

		return new RGB(r, g, b);
	}

	toHex() {
		return this;
	}
}

class CMYK extends Color {
	// c, m, y, k all normalized floats between 0.0 and 1.0 (inclusive) or undefined
	constructor(c, m, y, k, updatePropertyCallback) {
		super();

		this.c = c;
		this.m = m;
		this.y = y;
		this.k = k;
		this.updatePropertyCallback = updatePropertyCallback;
	}

	/* Getters */

	get c() {
		return this._c;
	}

	get m() {
		return this._m;
	}

	get y() {
		return this._y;
	}

	get k() {
		return this._k;
	}

	/* Setters */

	set c(value) {
		if(this._validateNormalizedFloat(value)) {
			this._c = value;
		}
		else if(value === undefined) {
			this._c = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("c");
	}

	set m(value) {
		if(this._validateNormalizedFloat(value)) {
			this._m = value;
		}
		else if(value === undefined) {
			this._m = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("m");
	}

	set y(value) {
		if(this._validateNormalizedFloat(value)) {
			this._y = value;
		}
		else if(value === undefined) {
			this._y = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("y");
	}

	set k(value) {
		if(this._validateNormalizedFloat(value)) {
			this._k = value;
		}
		else if(value === undefined) {
			this._k = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("k");
	}

	/* Methods */

	toString() {
		return "".concat(this._toPercent(this.c), "%, ", this._toPercent(this.m), "%, ", 
						this._toPercent(this.y), "%, ", this._toPercent(this.k), "%");
	}

	toCSS() {
		return "".concat("cmyk(", this.toString(), ")");
	}

	/* Conversion Methods */

	toRGB() {
		/* http://www.rapidtables.com/convert/color/cmyk-to-rgb.htm */
		let r = 255 * (1 - this.c / 100) * (1 - this.k);
		let g = 255 * (1 - this.m / 100) * (1 - this.k);
		let b = 255 * (1 - this.y / 100) * (1 - this.k);

		return new RGB(r, g, b);
	}

	toCMYK() {
		return this;
	}
}

class HSL extends Color {
	// h = int between 0 and 359 (inclusive) and undefined, s, l normalized floats between 0.0 and 1.0 (inclusive) and undefined
	constructor(h, s, l, updatePropertyCallback) {
		super();

		this.h = h;
		this.s = s;
		this.l = l;
		this.updatePropertyCallback = updatePropertyCallback;
	}

	/* Getters */

	get h() {
		return this._h;
	}

	get s() {
		return this._s;
	}

	get l() {
		return this._l;
	}

	/* Setters */

	set h(value) {
		if(this._validateDegrees(value)) {
			this._h = value;
		}
		else if(value === undefined) {
			this._h = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("h");
	}

	set s(value) {
		if(this._validateNormalizedFloat(value)) {
			this._s = value;
		}
		else if(value === undefined) {
			this._s = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("s");
	}

	set l(value) {
		if(this._validateNormalizedFloat(value)) {
			this._l = value;
		}
		else if(value === undefined) {
			this._l = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("l");
	}

	/* Methods */

	toString() {
		return "".concat(this.h, ", ", this._toPercent(this.s), "%, ", this._toPercent(this.l), "%");
	}

	toCSS() {
		return "".concat("hsl(", this.toString(), ")");
	}

	/* Conversion Methods */

	toRGB() {
		/* http://www.rapidtables.com/convert/color/hsl-to-rgb.htm */
		let c = (1 - Math.abs(2 * this.l - 1)) * this.s;
		let h = this.h;
		let x = c * (1 - Math.abs((h / 60) % 2 - 1));
		let m = this.l - c / 2;

		let r_;
		let g_;
		let b_;
		if(0 <= h && h < 60) {
			r_ = c;
			g_ = x;
			b_ = 0;
		}
		else if(60 <= h < 120) {
			r_ = x;
			g_ = c;
			b_ = 0;
		}
		else if(120 <= h < 180) {
			r_ = 0;
			g_ = c;
			b_ = x;
		}
		else if(180 <= h < 240) {
			r_ = 0;
			g_ = x;
			b_ = c;
		}
		else if(240 <= h < 300) {
			r_ = x;
			g_ = 0;
			b_ = c;
		}
		else if(300 <= h < 360) {
			r_ = c;
			g_ = 0;
			b_ = x;
		}

		let r = (r_ + m) * 255;
		let g = (g_ + m) * 255;
		let b = (b_ + m) * 255;

		return new RGB(r, g, b);		
	}

	toHSL() {
		return this;
	}
}

class HSV extends Color {
	// h = int between 0 and 359 (inclusive) and undefined, s, v normalized floats between 0.0 and 1.0 (inclusive) and undefined
	constructor(h, s, v, updatePropertyCallback) {
		super();

		this.h = h;
		this.s = s;
		this.v = v;
		this.updatePropertyCallback = updatePropertyCallback;
	}

	/* Getters */

	get h() {
		return this._h;
	}

	get s() {
		return this._s;
	}

	get v() {
		return this._v;
	}

	/* Setters */

	set h(value) {
		if(this._validateDegrees(value)) {
			this._h = value;
		}
		else if(value === undefined) {
			this._h = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("h");
	}

	set s(value) {
		if(this._validateNormalizedFloat(value)) {
			this._s = value;
		}
		else if(value === undefined) {
			this._s = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("s");
	}

	set v(value) {
		if(this._validateNormalizedFloat(value)) {
			this._v = value;
		}
		else if(value === undefined) {
			this._v = undefined;
		}
		this.attemptInvokeUpdatePropertyCallback("v");
	}

	/* Methods */

	toString() {
		return "".concat(this.h, ", ", this._toPercent(this.s), "%, ", this._toPercent(this.v), "%");
	}

	/* Conversion Methods */

	toRGB() {
		/* http://www.rapidtables.com/convert/color/hsv-to-rgb.htm */
		let c = this.s * this.v;
		let h = this.h;
		let x = c * (1 - Math.abs((h / 60) % 2 - 1));
		let m = this.v - c;

		let r_;
		let g_;
		let b_;
		if(0 <= h && h < 60) {
			r_ = c;
			g_ = x;
			b_ = 0;
		}
		else if(60 <= h < 120) {
			r_ = x;
			g_ = c;
			b_ = 0;
		}
		else if(120 <= h < 180) {
			r_ = 0;
			g_ = c;
			b_ = x;
		}
		else if(180 <= h < 240) {
			r_ = 0;
			g_ = x;
			b_ = c;
		}
		else if(240 <= h < 300) {
			r_ = x;
			g_ = 0;
			b_ = c;
		}
		else if(300 <= h < 360) {
			r_ = c;
			g_ = 0;
			b_ = x;
		}

		let r = (r_ + m) * 255;
		let g = (g_ + m) * 255;
		let b = (b_ + m) * 255;

		return new RGB(r, g, b);		
	}

	toHSV() {
		return this;
	}
}
