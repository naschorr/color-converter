class RGB {
	constructor(r, g, b) {
		this._r = r;
		this._g = g;
		this._b = b;
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
		this._r = this._clampBetween(0, 255, value);
	}

	set g(value) {
		this._g = this._clampBetween(0, 255, value);
	}

	set b(value) {
		this._b = this._clampBetween(0, 255, value);
	}

	/* Methods */

	_calcHue(r, g, b, max, delta) {
		let h;
		if(delta === 0) {
			h = 0;
		}
		else if(max === r) {
			h = 60 * (((g - b) / delta) % 6);
		}
		else if(max = g_) {
			h = 60 * (((b - r) / delta) + 2);
		}
		else if(max = b_) {
			h = 60 * (((r - g) / delta) + 4);
		}

		return h;
	}

	_clampBetween(lower, upper, value) {
		value = Math.max(lower, value);
		return Math.min(value, upper);
	}

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

	toHSV() {
		/* http://www.rapidtables.com/convert/color/rgb-to-hsv.htm */
		let r_ = this.r / 255;
		let g_ = this.g / 255;
		let b_ = this.b / 255;
		let max = Math.max(r_, g_, b_);
		let min = Math.min(r_, g_, b_);
		let delta = max - min;

		let h = this.calcHue(r_, g_, b_, max, delta);

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

	toHSL() {
		/* http://www.rapidtables.com/convert/color/rgb-to-hsl.htm */
		let r_ = this.r / 255;
		let g_ = this.g / 255;
		let b_ = this.b / 255;
		let max = Math.max(r_, g_, b_);
		let min = Math.min(r_, g_, b_);
		let delta = max - min;

		let h = this.calcHue(r_, g_, b_, max, delta);

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
}

class Hex {
	constructor(r, g, b) {
		this._r = r;
		this._g = g;
		this._b = b;
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
		this._r = value;
	}

	set g(value) {
		this._g = value;
	}

	set b(value) {
		this._b = value;
	}

	/* Methods */

	toRGB() {
		let r = parseInt(this.r, 16);
		let g = parseInt(this.g, 16);
		let b = parseInt(this.b, 16);

		return new RGB(r, g, b);
	}

	toHex() {
		return this;
	}

	toCMYK() {
		return this.toRGB().toCMYK();
	}

	toHSV() {
		return this.toRGB().toHSV();
	}

	toHSB() {
		return this.toHSV();
	}

	toHSL() {
		return this.toRGB().toHSL();
	}

	toHLS() {
		return this.toHSL();
	}
}

class CMYK {
	constructor(c, m, y, k) {
		this._c = c;
		this._m = m;
		this._y = y;
		this._k = k;
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
		this._c = value;
	}

	set m(value) {
		this._m = value;
	}

	set y(value) {
		this._y = value;
	}

	set k(value) {
		this._k = value;
	}

	/* Methods */

	toRGB() {
		/* http://www.rapidtables.com/convert/color/cmyk-to-rgb.htm */
		let r = 255 * (1 - this.c) * (1 - this.k);
		let g = 255 * (1 - this.m) * (1 - this.k);
		let b = 255 * (1 - this.y) * (1 - this.k);

		return new RGB(r, g, b);
	}

	toHex() {
		return this.toRGB.toHex();
	}

	toCMYK() {
		return this;
	}

	toHSV() {
		return this.toRGB().toHSV();
	}

	toHSB() {
		return this.toHSV();
	}

	toHSL() {
		return this.toRGB().toHSL();
	}

	toHLS() {
		return this.toHSL();
	}
}

class HSV {
	constructor(h, s, v) {
		this._h = h;
		this._s = s;
		this._v = v;
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
		this._h = value;
	}

	set s(value) {
		this._s = value;
	}

	set v(value) {
		this._v = value;
	}

	/* Methods */

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

	toHex() {
		return this.toRGB.toHex();
	}

	toCMYK() {
		return this.toRGB().toCMYK();
	}

	toHSV() {
		return this;
	}

	toHSB() {
		return this.toHSV();
	}

	toHSL() {
		return this.toRGB().toHSL();
	}

	toHLS() {
		return this.toHSL();
	}
}

class HSL {
	constructor(h, s, l) {
		this._h = h;
		this._s = s;
		this._l = l;
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
		this._h = value;
	}

	set s(value) {
		this._s = value;
	}

	set l(value) {
		this._l = value;
	}

	/* Methods */

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

		let r = (r_ + this.m) * 255;
		let g = (g_ + this.m) * 255;
		let b = (b_ + this.m) * 255;

		return new RGB(r, g, b);		
	}

	toHex() {
		return this.toRGB.toHex();
	}

	toCMYK() {
		return this.toRGB().toCMYK();
	}

	toHSV() {
		return this.toRGB().toHSV();
	}

	toHSB() {
		return this.toHSV();
	}

	toHSL() {
		return this;
	}

	toHLS() {
		return this.toHSL();
	}
}