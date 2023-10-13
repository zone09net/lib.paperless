import {Point} from "./Point";



export class Vector
{
	private _x: number = undefined;
	private _y: number = undefined;
	private _magnitude: number = undefined;
	private _rad: number = undefined;
	//---

	/**
	 * Constructs a Vector.
	 */
	public constructor(components: {x?: number, y?: number, magnitude?: number, rad?: number})
	{
		if(components.x != undefined && components.y != undefined)
		{
			this._x = components.x; 
			this._y = components.y;
			this.magnitude();
			this.rad();
		}
		else if(components.magnitude != undefined && components.rad != undefined)
		{
			this._x = components.magnitude * Math.cos(components.rad);
			this._y = components.magnitude * Math.sin(components.rad);
			this._magnitude = components.magnitude;
			this._rad = components.rad;
		}	
	}

	public clone(): Vector
	{
		const clone: Vector = new Vector({});

		clone.components = {x: this._x, y: this._y, magnitude: this._magnitude, rad: this._rad};
		
		return clone;
	}

	/**
	 * Calculates the magnitude (length) of the current vector. The method keeps the magnitude internaly to avoid
	 * unnecessary call. To reset the internal magniture, just call the method again.
	 * 
	 */
	public magnitude(magnitude?: number): number
	{
		if(magnitude != undefined)
		{
			this._magnitude = magnitude;
			this._x = magnitude * Math.cos(this._rad);
			this._y = magnitude * Math.sin(this._rad);
		}
		else
			this._magnitude = Math.sqrt((this._x * this._x) + (this._y * this._y));
	
		return this._magnitude;
	}

	public rad(rad?: number): number
	{
		if(rad != undefined)
		{
			this._rad = rad;
			this._x = this._magnitude * Math.cos(rad);
			this._y = this._magnitude * Math.sin(rad);
		}
		else
			this._rad = Math.atan2(this._y, this._x);

		return this._rad;
	}
	
	public add(vector: Vector): Vector
	{
		this._x += vector.components.x;
		this._y += vector.components.y;

		return this;
	}

	public subtract(vector: Vector): Vector
	{
		this._x -= vector.components.x;
		this._y -= vector.components.y;

		return this;
	}

	public multiply(scalar: number): Vector
	{
		this._x *= scalar;
		this._y *= scalar;

		return this;
	}

	public dot(vector: Vector): number
	{
		return (this._x * vector.components.x) + (this._y * vector.components.y);
	}

	public normalize(): Vector
	{
		if(!this._magnitude)
			this.magnitude();

		if(this._magnitude > 0)
		{
			this._x /= this._magnitude;
			this._y /= this._magnitude;
		}
		else
		{
			this._x = 0;
			this._y = 0;
		}

		return this;
	}

	public tangent(): Vector
	{
		// Must call normalize first.

		const x: number = Number(-this._y);
		const y: number = Number(this._x);

		this._x = x;
		this._y = y;

		return this;
	}





	public rotate(rad: number): Vector
	{
		const cos: number = Math.cos(rad);
		const sin: number = Math.sin(rad);
		const x: number = Number(-this._y);
		const y: number = Number(this._x);

		this._x = (x * cos) - (y * sin);
		this._y = (x * sin) + (y * cos);
		 
		return this;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get components(): {x?: number, y?: number, magnitude?: number, rad?: number}
	{
		return {x: this._x, y: this._y, magnitude: this._magnitude, rad: this._rad};
	}
	public set components(components: {x?: number, y?: number, magnitude?: number, rad?: number})
	{
		this._x = components.x || undefined;
		this._y = components.y || undefined;
		this._magnitude = components.magnitude || undefined;
		this._rad = components.rad || undefined;
	}
}
