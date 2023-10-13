import {IPoint} from './interfaces/IPoint.js';



/**
 * The class represent the graphic position *x,y* in a [[Context]].
 */
export class Point
{
	private _x: number;
	private _y: number;
	private _scale: number;
	private _blocked: {x: boolean, y: boolean};

	/**
	 * Constructs a Point.
	 */
	public constructor(x: number, y: number, attributes: IPoint = {})
	{
		const {
			blocked = { x: false, y: false },
			scale = 1,
		} = attributes;

		this._x = x * scale;
		this._y = y * scale;
		this._blocked = blocked;
		this._scale = scale;
	}

	/**
	 * Takes a point from string and transform it to new Point.
	 * 
	 * @param	point			Should be a string format 'x, y'
	 */
	public toPoint(point: string): Point
	{
		const match = point.match(/([0-9]+),\s*([0-9]+)/);

		return new Point(parseInt(match[1]), parseInt(match[2]));
	}

	/**
	 * Adjusts the this Point offset x and y with an element in the DOM. 
	 * 
	 * @return					Current instance of this Point is returned from this method.
	 */
	public toRealPosition(element: HTMLElement): Point
	{
		const rect: DOMRect = element.getBoundingClientRect();

		this._x -= rect.left;
		this._y -= rect.top;
		this._x /= this._scale / this._scale;
		this._y /= this._scale / this._scale; 

		return this;
	}

	/**
	 * Validates if the current point is inside a triangle. 
	 * 
	 * @param 	points 		The method will use only the first 3 values of the provided array.
	 */
	public isInTriangle(points: Point[]): boolean
	{
		const as_x: number = this._x - points[0].x;
		const as_y: number = this._y - points[0].y;

		const s_ab: boolean = (points[1].x - points[0].x) * as_y - (points[1].y - points[0].y) * as_x > 0;

		if((points[2].x - points[0].x) * as_y - (points[2].y - points[0].y) * as_x > 0 == s_ab)
			return false;

		if((points[2].x - points[1].x) * (this._y - points[1].y) - (points[2].y - points[1].y) * (this._x - points[1].x) > 0 != s_ab)
			return false;

		return true;
	}

	/**
	 * Validates if this Point is inside a poligon.
	 * 
	 * @param 	points 		Should be a list of Points that start from a point and comes back to the same point.
	 */
	public isInPolygon(points: Point[]): boolean
	{
		let inside = false;
		let point1 = new Point(0, 0);
		let point2 = new Point(0, 0);

		if(points.length < 3 )
			return inside;

		let oldPoint = new Point(points[points.length - 1].x, points[points.length - 1].y);

		for(let i = 0; i < points.length; i++)
		{
			let v2NewPoint = new Point(points[i].x, points[i].y);

			if(v2NewPoint.x > oldPoint.x)
			{
				point1 = oldPoint;
				point2 = v2NewPoint;
			}
			else
			{
				point1 = v2NewPoint;
				point2 = oldPoint;
			}

			if( ((v2NewPoint.x < this._x) == (this._x <= oldPoint.x)) && (((this._y - point1.y) * (point2.x - point1.x)) < ((point2.y - point1.y) * (this._x - point1.x))) )
				inside = !inside;

			oldPoint = v2NewPoint;
		}

		return inside;
	}

	/**
	 * Validates if this Point is inside the a rectangle defined by it's top leftand bottom right corners.
	 * 
	 * @param 	topleft 			Top left point on the canvas.
	 * @param	bottomright		Bottom right point on the canvas.
	 */
	public isInQuad(topleft: Point, bottomright: Point)
	{
		if(this.x >= topleft.x && this.x <= bottomright.x && this.y >= topleft.y && this.y <= bottomright.y) 
			return true;
  		else
			return false;
	}

	/**
	 * Validates if this Point is inside the radius of the given point.
	 * 
	 * @param 	point 		Target point on the canvas.
	 * @param	radius		Radius surrounding the point to validate.
	 */
	public isInCircle(point: Point, radius: number)
	{
		//if(Math.pow(this._x - point.x, 2) + Math.pow(this._y - point.y, 2) <= radius * radius)
		if((point.x - this._x) * (point.x - this._x) + (point.y - this._y) * (point.y - this._y) <= radius * radius)
			return true;
  		else
			return false;
	}

	/**
	 * Translates the current this Point at *angle* direction for *distance* pixel(s).
	 * 
	 * @return					Current instance of this Point is returned from this method.
	 */
	public translate(angle: number, distance: number): Point
	{
		const radian: number = (angle + 90) * Math.PI / 180;

		this._x += distance * Math.sin(radian);
		this._y -= distance * Math.cos(radian);

		return this;
	}

	/**
	 * Calculates the distance between 2 points.
	 */
	public static distance(point1: Point, point2: Point): number
	{
		return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
	}

	/**
	 * Calculates a middle point between 2 points.
	 */
	public static middle(point1: Point, point2: Point): Point
	{
		return new Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
	}

	/**
	 * Calculates the angle from 0 to 360 between 2 points.
	 */
	public static angle(point1: Point, point2: Point): number
	{
		const delta: Point = Point.delta(point1, point2);
		let theta: number = Math.atan2(delta.y, delta.x);

		theta *= 180 / Math.PI;
		//if (theta < 0) theta = 360 + theta; // range [0, 360)
		
		return theta;
	}
	
	/**
	 * Gets the delta between 2 points. Each x and y are calculated individualy in a new [[Point]].
	 */
	public static delta(point1: Point, point2: Point): Point
	{
		// Delta is put in a Point to be practical.
		return new Point(point2.x - point1.x || 0, point2.y - point1.y || 0);
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the x position of this Point.
	 */
	public get x(): number
	{
		return this._x;
	}
	/**
	 * Sets the x position of this Point. If [[blocked]] x is set to true, the position will not get changed.
	 */
	public set x(x: number)
	{
		if(!this._blocked.x)
			this._x = x;
	}

	/**
	 * Gets the y position of this Point.
	 */
	public get y(): number
	{
		return this._y;
	}
	/**
	 * Sets the y position of this Point. If [[blocked]] y is set to true, the position will not get changed.
	 */
	public set y(y: number)
	{
		if(!this._blocked.y)
			this._y = y;
	}

	/**
	 * Gets the scale value of this Point. 
	 */
	public get scale(): number
	{
		return this._scale;
	}
	/**
	 * Sets the scale value of this Point. When constructing a new Point, the scale value is always equal to 1.
	 */
	public set scale(scale: number)
	{
		this._scale = scale;
	}

	/**
	 * Gets the status of the blocked x and y. 
	 */
	public get blocked(): {x: boolean, y: boolean}
	{
		return this._blocked;
	}
	/**
	 * Sets the blocked status of x and/or y position.
	 */
	public set blocked(blocked: {x: boolean, y: boolean})
	{
		this._blocked = blocked;
	}
}
