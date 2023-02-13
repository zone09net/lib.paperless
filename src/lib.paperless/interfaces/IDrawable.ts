export interface IDrawableAttributes 
{
	/**
	 * Tells to the [[Context]] if the [[Drawable]] will be filled with a color with the [[fillcolor]] property in the draw phase.
	 * Setting this to true will disable the fill.
	 */
	nofill?: boolean,
	/**
	 * Tells to the [[Context]] if the [[Drawable]] will be stroked with a color with the [[strokecolor]] property in the draw phase.
	 * Setting this to true will disable the stroke.
	 */
	nostroke?: boolean,
	/**
	 * Determines the shadow level of the [[Drawable]] when rendering. Putting 0 in this property will deactivate the shadow. 
	 */
	shadow?: number,
	/**
	 * Detemines the shadow color when the [[Context]] render the [[Drawable]]. Must be in the HTML #xxxxxx color format.
	 */
	shadowcolor?: string,
	/**
	 * Detemines the filling color when the [[Context]] render the [[Drawable]]. Must be in the HTML #xxxxxx color format.
	 */
	fillcolor?: string,
	/**
	 * Detemines the stroke color when the [[Context]] render the [[Drawable]]. Must be in the HTML #xxxxxx color format.
	 */
	strokecolor?: string,
	/**
	 * This changes the line width of the stroke of the [[Drawable]]. 
	 */
	linewidth?: number,
	/**
	 * Detemines the alpha level of the [[Drawable]]. Can be from 0 to 1. Default value is 1.
	 */
	alpha?: number,
	/**
	 * Setting visible to false will tell the [[Context]] to ignore the [[Drawable]] in the draw phase.
	 */
	visible?: boolean,
	/**
	 * Determines the x and y scale values of the [[Drawable]] at the [[Context]] draw phase. Default value is 1.
	 */
	scale?: {x: number, y: number},
	/**
	 * Determines the rotation values of the [[Drawable]] at the [[Context]] draw phase. Can be from 0 to 360 degrees.
	 */
	angle?: number,
	/**
	 * Determines if the [[Drawable]] is going to be sticky or not. When set to true, the sticky property tells the [[Context]] to draw 
	 * the Drawable at the top of the others. 
	 */
	sticky?: boolean,
	/**
	 * Setting removable to false will deactivate the ability to [[detach]] the [[Drawable]] from the [[Context]].
	 */
	removable?: boolean,

	hoverable?: boolean,

	generate?: boolean,

	offset?: {x?: number, y?: number}
}

export interface IDrawableHexagonAttributes extends IDrawableAttributes
{
	/**
	 * Tells the number of side the [[Hexagon]] should have. A normal hexagon have 6 sides but setting it to 3 by example, would give a triangle.
	 */
	sides?: number,
}

export interface IDrawableCircleAttributes extends IDrawableAttributes
{
	/**
	 * Will set the start angle of the [[Circle]]. Value can be from 0 to 360.
	 */
	angleStart?: number,
	/**
	* Will set the end angle of the [[Circle]]. Value can be from 0 to 360.
	*/
	angleEnd?: number,
}

export interface IDrawableArtworkAttributes extends IDrawableAttributes
{
	content?: string | HTMLImageElement,
	/**
	 * This sets the padding of the image of the [[Artwork]]. Default value is 0.
	 */
	padding?: number,
	/**
	 * When setting autosize to true, the [[Artwork]] will auto resize it's display box to the width and height of the image when loaded.
	 * Default value is false.
	 */
	autosize?: boolean,
}

export interface IDrawableLabelAttributes extends IDrawableAttributes
{
	content?: string,
	/**
	 * This sets the padding of the [[Label]] in it's box. Default value is 0.
	 */	
	padding?: {top?: number, bottom?: number, left?: number, right?: number},
	/** 
	 * Setting autosize to true 
	 */
	autosize?: boolean,
	font?: string,
	spacing?: number,
	wrapping?: boolean,
	corner?: boolean,
	multiline?: boolean,
	tabsize?: number,
	fillbackground?: string,
	filter?: IDrawableLabelFilter
}

export interface IDrawableLabelFilter
{
	/** @ignore */
	[row: number]: {
		[column: number]: {
			font?: string,
			fillcolor?: string,
			mark?: boolean,
			markcolor?: string,
		}
	}
}
