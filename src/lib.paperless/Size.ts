import {ISize} from './interfaces/ISize.js';



/**
 * The class represent the width and height of any [[Drawable]] and some [[Component]] in a [[Context]].
 */
export class Size
{
	private _width: number;
	private _height: number;
	private _blocked: {width: boolean, height: boolean};
	
	/**
	 * Constructs a Size.
	 */
	public constructor(width: number, height: number, attributes: ISize = {})
	{
		this._width = width;
		this._height = height;

		const {
			blocked = { width: false, height: false },
		} = attributes;

		this._blocked = blocked;
	}

	/**
	 * Takes a size from string and transform it to new Size.
	 * 
	 * @param 	size			Should be a string format 'width, height'
	 */
	public toSize(size: string): Size
	{
		const match = size.match(/([0-9]+),\s*([0-9]+)/);

		return new Size(parseInt(match[1]), parseInt(match[2]));
	}


	
	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the width of this Size.
	 */
	public get width(): number
	{
		return this._width;
	}
	/**
	 * Sets the width of this Size. If [[blocked]] width is set to true, width will not be changed.
	 */
	public set width(width: number)
	{
		if(!this._blocked.width)
			this._width = width;
	}

	/**
	 * Gets the height of this Size.
	 */
	public get height(): number
	{
		return this._height;
	}
	/**
	 * Sets the height of this Size. If [[blocked]] width is set to true, height will not be changed.
	 */
	public set height(height: number)
	{
		if(!this._blocked.height)
			this._height = height;
	}

	/**
	 * Gets the status of the blocked width and height. 
	 */
	public get blocked(): {width: boolean, height: boolean}
	{
		return this._blocked;
	}
	/**
	 * Sets the bloked status of width and/or height.
	 */
	public set blocked(blocked: {width: boolean, height: boolean})
	{
		this._blocked = blocked;
	}
}
