class Color {
	constructor() {
		if(this.constructor === Color.constructor) {
			console.error("Abstract class, can't be instantiated.");
		}
	}

	/* Getters */

	get propertyUpdateCallback() {
		return this._propertyUpdateCallback;
	}

	/* Setters */

	set propertyUpdateCallback(func) {
		// http://stackoverflow.com/a/6000016
		if (!!(func && func.constructor && func.call && func.apply)) {
			this._propertyUpdateCallback = func;
		}
	}

	/* Methods */

	_validateNormalizedFloat(value) {
		return (0.0 <= value && value <= 1.0);
	}

	_validateDegrees(value) {
		return (0 <= value && value <= 359);
	}

	attemptInvokePropertyUpdateCallback(propertyName) {
		if(this.propertyUpdateCallback) {
			this.propertyUpdateCallback(propertyName);
		}
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
	// r, g, b all ints between 0 and 255 (inclusive)
	constructor(r, g, b, propertyUpdateCallback) {
		super();

		this.r = r;
		this.g = g;
		this.b = b;
		this.propertyUpdateCallback = propertyUpdateCallback;
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
		if(this._validateRGB(value)) {
			this._r = value;
			this.attemptInvokePropertyUpdateCallback('r');
		}
	}

	set g(value) {
		if(this._validateRGB(value)) {
			this._g = value;
			this.attemptInvokePropertyUpdateCallback('g');
		}
	}

	set b(value) {
		if(this._validateRGB(value)) {
			this._b = value;
			this.attemptInvokePropertyUpdateCallback('b');
		}
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
		return ''.concat("rgb(", this.r, ', ', this.g, ', ', this.b, ')');
	}

	/* Conversion Methods */

	toRGB() {
		return this;
	}

	toHex() {
		let r = this.r.toString(16);
		let g = this.g.toString(16);
		let b = this.b.toString(16);

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
	// r, g, b all hex strings between 00 and FF (inclusive)
	constructor(r, g, b, propertyUpdateCallback) {
		super();

		this.r = r;
		this.g = g;
		this.b = b;
		this.propertyUpdateCallback = propertyUpdateCallback;
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

	get hex() {
		return this._hex;
	}

	/* Setters */

	set r(value) {
		if(this._validateHexComponent(value)) {
			this._r = value;
			this.attemptInvokePropertyUpdateCallback('r');
		}
	}

	set g(value) {
		if(this._validateHexComponent(value)) {
			this._g = value;
			this.attemptInvokePropertyUpdateCallback('g');
		}
	}

	set b(value) {
		if(this._validateHexComponent(value)) {
			this._b = value;
			this.attemptInvokePropertyUpdateCallback('b');
		}
	}

	set hex(value) {
		if(this._validateHex(value)) {
			this._hex = value;
			this.attemptInvokePropertyUpdateCallback("hex");
		}
	}

	/* Methods */

	_validateHex(hexString) {
		return /[0-9a-fA-F]{1,6}/.test(hexString);
	}

	_validateHexComponent(hexString) {
		return (this._validateHex(hexString) && hexString.length <= 2)
	}

	toString() {
		return ''.concat('#', this.r, this.g, this.b);
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
	// c, m, y, k all normalized floats between 0.0 and 1.0 (inclusive)
	constructor(c, m, y, k, propertyUpdateCallback) {
		super();

		this.c = c;
		this.m = m;
		this.y = y;
		this.k = k;
		this.propertyUpdateCallback = propertyUpdateCallback;
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
			this.attemptInvokePropertyUpdateCallback('c');
		}
	}

	set m(value) {
		if(this._validateNormalizedFloat(value)) {
			this._m = value;
			this.attemptInvokePropertyUpdateCallback('m');
		}
	}

	set y(value) {
		if(this._validateNormalizedFloat(value)) {
			this._y = value;
			this.attemptInvokePropertyUpdateCallback('y');
		}
	}

	set k(value) {
		if(this._validateNormalizedFloat(value)) {
			this._k = value;
			this.attemptInvokePropertyUpdateCallback('k');
		}
	}

	/* Methods */

	toString() {
		return ''.concat("cmyk(", this.c, '%, ', this.m, '%, ', this.y, '%, ', this.k, '%)');
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
	// h = int between 0 and 359 (inclusive), s, l normalized floats between 0.0 and 1.0 (inclusive)
	constructor(h, s, l, propertyUpdateCallback) {
		super();

		this.h = h;
		this.s = s;
		this.l = l;
		this.propertyUpdateCallback = propertyUpdateCallback;
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
		if(this._validateDegrees(values)) {
			this._h = values;
			this.attemptInvokePropertyUpdateCallback('h');
		}
	}

	set s(value) {
		if(this._validateNormalizedFloat(values)) {
			this._s = values;
			this.attemptInvokePropertyUpdateCallback('s');
		}
	}

	set l(value) {
		if(this._validateNormalizedFloat(values)) {
			this._l = values;
			this.attemptInvokePropertyUpdateCallback('l');
		}
	}

	/* Methods */

	//toString(){}

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
	// h = int between 0 and 359 (inclusive), s, v normalized floats between 0.0 and 1.0 (inclusive)
	constructor(h, s, v, propertyUpdateCallback) {
		super();

		this.h = h;
		this.s = s;
		this.v = v;
		this.propertyUpdateCallback = propertyUpdateCallback;
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
		if(this._validateDegrees(values)) {
			this._h = values;
			this.attemptInvokePropertyUpdateCallback('h');
		}
	}

	set s(value) {
		if(this._validateNormalizedFloat(values)) {
			this._s = values;
			this.attemptInvokePropertyUpdateCallback('s');
		}
	}

	set v(value) {
		if(this._validateNormalizedFloat(values)) {
			this._v = values;
			this.attemptInvokePropertyUpdateCallback('v');
		}
	}

	/* Methods */

	//toString(){}

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

		let r = (r_ + this.m) * 255;
		let g = (g_ + this.m) * 255;
		let b = (b_ + this.m) * 255;

		return new RGB(r, g, b);		
	}

	toHSV() {
		return this;
	}
}
