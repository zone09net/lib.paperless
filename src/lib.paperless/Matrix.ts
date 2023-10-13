
export interface IMatrix {
	tx?: number
	ty?: number
	sx?: number
	sy?: number
}

export class Matrix
{
	/*
		┌ a  c  e ┐  ┌ scalex  shearx  tx ┐
		└ b  d  f ┘  └ sheary  scaley  ty ┘

		translate -> rotate -> reflect | stretch | scale | shear
	*/
	private _matrix: DOMMatrix;
	//---
	
	public constructor(matrix: number[] = [1, 0, 0, 1, 0, 0])
	{
		this._matrix = new DOMMatrix(matrix);
	}

	/**
	 * Translates the current matrix. The value of x and/or y is added to the matrix current value. If you want
	 * an absolute position, use the [[x]] and [[y]] accessors.
	 * 
	 * @param 	translate 			x: x value, y: y value
	 * @returns 						The current matrix transformed.
	 */
	public translate(translate: {x?: number, y?: number}): Matrix
	{
		// ┌ 0  0  x ┐
		// └ 0  0  y ┘
		this.x += translate.x ? translate.x : 0;
		this.y += translate.y ? translate.y : 0;

		return this;
	}

	/**
	 * Rotates the current matrix on it's origin. Either radian or degree angle can be entered but not both.
	 * Entering a negative value for the angle will rotate counterclockwise. The rotation value is added to 
	 * the current rotation of the matrix. If you want an obsolute rotation, use the [[rad]] or [[angle] 
	 * accessors.
	 * 
	 * @param 	rotate	 			rad: radian value, angle: angle degree value
	 * @returns 						The current matrix transformed.
	 */
	public rotate(rotate: {rad?: number, angle?: number}): Matrix
	{
		// ┌ cos°  -sin°  0 ┐
		// └ sin°  cos°   0 ┘
		const scale: {x: number, y: number} = this.scale;
		const rad: number = rotate.rad ? rotate.rad : (Math.PI / 180) * rotate.angle;
		const sin: number = Math.sin(rad);
		const cos: number = Math.cos(rad);

		this.multiply(new Matrix([cos * scale.x, sin * scale.x, -sin * scale.y, cos * scale.y, 0, 0]));

		return this;
	}

	/**
	 * Do a reflection on the x-axis and/or y-axis. Value entered are boolean.
	 * 
	 * @param 	reflect 				angle: angle value to use
	 * @returns 						The current matrix transformed.
	 */
	public reflect(reflect: {angle?: number}): Matrix
	{
		// ┌ y  0  0 ┐
		// └ 0  x  0 ┘
		const scale: {x: number, y: number} = this.scale;
		const rad: number = (Math.PI / 180) * reflect.angle;
		const sin: number = Math.sin(2 * rad);
		const cos: number = Math.cos(2 * rad);

		this.multiply(new Matrix([cos * scale.x, sin * scale.x, sin * scale.y, -cos * scale.y, 0, 0]));

		return this;
	}

	/**
	 * Stretchs the current matrix in the x-axis and/or y-axis. A number bellow 1 will compress the matrix 
	 * and it negative, will reflect the axe. The stretch value is added to the current stretch of the matrix. 
	 * If you want an obsolute stretch, use the [[scale]] accessor.
	 * 
	 * @param 	stretch	 			x: x-axis value, y: y-axis value
	 * @returns 						The current matrix transformed.
	 */
	public stretch(stretch: {x?: number, y?: number}): Matrix
	{
		// ┌ x  0  0 ┐
		// └ 0  y  0 ┘
		this.multiply(new Matrix([stretch.x ? stretch.x : 1, 0, 0, stretch.y ? stretch.y : 1, 0, 0]));

		return this;
	}

	/**
	 * Shears the current matrix in the x-axis and/or y-axis. Angle should lower than 90 degree.
	 * 
	 * @param 	shear 				x: x-axis angle value, y: y-axis angle value
	 * @returns 						The current matrix transformed.
	 */
	public shear(shear:{x?: number, y?: number}): Matrix
	{
		// ┌ 1  x  0 ┐
		// └ y  1  0 ┘
		this.multiply(new Matrix([1, shear.y ? ((Math.PI / 180) * shear.y) : 0, shear.x ? ((Math.PI / 180) * shear.x) : 0, 1, 0, 0]));

		return this;
	}

	/**
	 * Multiply the current matrix with another. Only a, b, c and d are multiplicated, e and f are ignored,
	 * so this is in fact a 2x2 matrix multiply.
	 * 
	 * @param other 					Other matrix to multiply.
	 * @returns 						The current matrix transformed.
	 */
	public multiply(other: Matrix): Matrix
	{
		// ┌ a  c ┐   ┌ a  c ┐   ┌ aa+cb  ac+cd ┐
		// └ b  d ┘ x └ b  d ┘ = └ ba+db  bc+dd ┘
		const current: Matrix = new Matrix(this.array);

		this._matrix.a = (current.matrix.a * other.matrix.a) + (current.matrix.c * other.matrix.b);
		this._matrix.b = (current.matrix.b * other.matrix.a) + (current.matrix.d * other.matrix.b);
		this._matrix.c = (current.matrix.a * other.matrix.c) + (current.matrix.c * other.matrix.d);
		this._matrix.d = (current.matrix.b * other.matrix.c) + (current.matrix.d * other.matrix.d);
		
		return this;
	}

	public add(other: Matrix): Matrix
	{
		this._matrix.a += other.matrix.a;
		this._matrix.b += other.matrix.b;
		this._matrix.c += other.matrix.c;
		this._matrix.d += other.matrix.d;
		this._matrix.e += other.matrix.e;
		this._matrix.f += other.matrix.f;

		return this;
	}

	public subtract(other: Matrix): Matrix
	{
		this._matrix.a -= other.matrix.a;
		this._matrix.b -= other.matrix.b;
		this._matrix.c -= other.matrix.c;
		this._matrix.d -= other.matrix.d;
		this._matrix.e -= other.matrix.e;
		this._matrix.f -= other.matrix.f;

		return this;
	}


	
	// Accessors
	// --------------------------------------------------------------------------
	public get array(): number[]
	{
		return [this._matrix.a, this._matrix.b, this._matrix.c, this._matrix.d, this._matrix.e, this._matrix.f];
	}

	public get matrix(): DOMMatrix
	{
		return this._matrix;
	}
	public set matrix(matrix: DOMMatrix)
	{
		this._matrix = matrix;
	}

	public get x(): number
	{
		return this._matrix.e;
	}
	public set x(x: number)
	{
		this._matrix.e = Math.round(x);
	}

	public get y(): number
	{
		return this._matrix.f;
	}
	public set y(y: number)
	{
		this._matrix.f = Math.round(y);
	}

	public get rad(): number
	{
		return Math.atan2(this._matrix.b, this._matrix.a);
	}
	public set rad(rad: number)
	{
		const scale: {x: number, y: number} = this.scale;
		const sin: number = Math.sin(rad);
		const cos: number = Math.cos(rad);

		this._matrix.a = cos * scale.x;
		this._matrix.b = sin * scale.x;
		this._matrix.c = -sin * scale.y;
		this._matrix.d = cos * scale.y;
	}

	public get angle(): number
	{
		// if shear is used, angle wil be wrong
		const rad: number = this.rad;

		let angle: number = Math.round(rad * (180 / Math.PI));
		if(rad < 0)
			angle += 360; 

		return angle;
	}
	public set angle(angle: number)
	{
		const scale: {x: number, y: number} = this.scale;
		const rad: number = (Math.PI / 180) * angle;
		const sin: number = Math.sin(rad);
		const cos: number = Math.cos(rad);

		this._matrix.a = cos * scale.x;
		this._matrix.b = sin * scale.x;
		this._matrix.c = -sin * scale.y;
		this._matrix.d = cos * scale.y;
	}

	public get scale(): {x: number, y: number}
	{
		// if shear is used, angle wil be wrong
		const det: number = (this._matrix.a * this._matrix.a) + (this._matrix.b * this._matrix.b);
   	const scalex: number = Math.sqrt(det);
   	const scaley = (this._matrix.a * this._matrix.d - this._matrix.c * this._matrix.b) / scalex;

		return {x: scalex, y: scaley};
	}
	public set scale(scale: {x?: number, y?: number})
	{
		const rad: number = this.rad;
		const sin: number = Math.sin(rad);
		const cos: number = Math.cos(rad);

		if(scale.x)
		{
			this._matrix.a = cos * scale.x;
			this._matrix.b = sin * scale.x;
		}

		if(scale.y)
		{
			this._matrix.c = -sin * scale.y;
			this._matrix.d = cos * scale.y;
		}
	}
}
