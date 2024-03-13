import {Context} from "../Context";
import {Drawable} from '../Drawable';



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
	scale?: {x?: number, y?: number},
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

	/**
	 * Tells if the Drawable will be generated or not.
	 */
	generate?: boolean,

	offset1?: {x?: number, y?: number},

	offset2?: {x?: number, y?: number},

	point?: {x?: number, y?: number},

	size?: {width?: number, height?: number},

	matrix?: DOMMatrix,

	context?: Context,
	layer?: number,

	onAttach?: (self?: Drawable) => void,
	onDetach?: (self?: Drawable) => void,
	onResize?: (self?: Drawable) => void,
}

export interface IDrawableArrowAttributes extends IDrawableAttributes
{
	/**
	 * Will set the width of the arrow's base.
	 * @defaultvalue 15
	 */
	baseWidth?: number,
	
	/**
	* Will set the height of the arrow's base
	* @defaultvalue 25
	*/
	baseHeight?: number,
}

export interface IDrawableArtworkAttributes extends IDrawableAttributes
{
	/** 
	 * @ignore 
	*/
	generate?: boolean,

	/**
	 * This is the actual image.
	 * @defaultvalue An empty image in base64 string.
	 */
	content?: string | HTMLImageElement,

	/**
	 * This sets the padding of the image of the [[Artwork]]. 
	 * @defaultvalue 0
	 */
	padding?: number,

	/**
	 * When setting autosize to true, the [[Artwork]] will auto resize it's display box to the width and height of the image when loaded.
	 * @defaultvalue true
	 */
	autosize?: boolean,

	/**
	 * When setting autoload to true, the [[Artwork]] will call the [[generate]] method when the image is completely loaded.
	 * @defaultvalue true
	 */
	autoload?: boolean,

	/**
	 * Tells if the filling of The [[Drawable]] will be drawn.
	 * @defaultvalue true
	 */
	nofill?: boolean,

	/**
	 * Tells if the line of The [[Drawable]] will be drawn.
	 * @defaultvalue true
	 */
	nostroke?: boolean
}

export interface IDrawableCircleAttributes extends IDrawableAttributes
{
	/**
	 * Will set the start angle of the [[Circle]]. Value can be from 0 to 360.
	 * @defaultvalue 0
	 */
	angleStart?: number,

	/**
	* Will set the end angle of the [[Circle]]. Value can be from 0 to 360.
	* @defaultvalue 360
	*/
	angleEnd?: number,

	/**
	 * Will set the inner radius of the [[Circle]]. If greater than 0, this will produce a ring.
	 * @defaultvalue 0
	 */
	innerRadius?: number,

	/**
	 * Will set the outer radius of the [[Circle]].
	 * @defaultvalue 25
	 */
	outerRadius?: number,
}

export interface IDrawableCrossAttributes extends IDrawableAttributes
{
	/**
	 * @ignore
	 */
	nofill?: boolean,

	/**
	 * This changes the line width of the stroke of the [[Drawable]]. 
	 * @defaultvalue 10
	 */
	linewidth?: number,
}

export interface IDrawableHexagonAttributes extends IDrawableAttributes
{
	/**
	 * Tells the number of side the [[Hexagon]] should have. A normal hexagon have 6 sides but setting it to 3 by example, would give a triangle.
	 * @defaultvalue 6
	 */
	sides?: number,

	/**
	 * This sets the radius of the hexagon. As the [[Hexagon]] is created with sin and cos, we need a radius.
	 * @defaultvalue 25
	 */
	radius?: number,
}

export interface IDrawableLineAttributes extends IDrawableAttributes
{
	/**
	 * @ignore
	 */
	nofill?: boolean,

	/**
	 * This changes the line width of the stroke of the [[Drawable]]. 
	 * @defaultvalue 10
	 */
	linewidth?: number,

	/**
	 * Sets the first point of the [[Line]].
	 * @defaultvalue {x: (window.innerWidth / 2) - 25, y: window.innerHeight / 2}
	 */
	point0?: {x: number, y: number},

	/**
	 * Sets the second point of the [[Line]].
	 * @defaultvalue {x: (window.innerWidth / 2) + 25, y: window.innerHeight / 2}
	 */
	point1?: {x: number, y: number},
}

export interface IDrawableRectangleAttributes extends IDrawableAttributes
{
	/**
	 * Tells if the corners of the [[Rectangle]] will be rounded. You can set rounded value
	 * of the different corners separately.
	 * @defaultvalue {topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0}
	 */
	rounded?: {topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number}
}

export interface IDrawableTriangleAttributes extends IDrawableHexagonAttributes
{
	 /**
	  * @ignore
	  */
	 sides?: number,

	/**
	 * Determines the rotation values of the [[Triangle]]. Can be from 0 to 360 degrees.
	 * @defaultvalue 30
	 */
	angle?: number,
}

export interface IDrawableStarAttributes extends IDrawableAttributes
{
	/**
	 * Tells the number of spikes the [[Star]] should have.
	 * @defaultvalue 6
	 */
	 spikes?: number,

	/**
	 * Will set the inner radius of the [[Star]]. If greater than 0, this will produce a ring.
	 * @defaultvalue 10
	 */
	 innerRadius?: number,

	 /**
	  * Will set the outer radius of the [[Star]].
	  * @defaultvalue 25
	  */
	 outerRadius?: number,
}

export interface IDrawableSmileyAttributes extends IDrawableAttributes
{
	/**
	 * @ignore
	 */
	nostroke?: boolean,
	
	/**
	 * This sets the radius of the hexagon. As the [[Smiley]] is created with sin and cos, we need a radius.
	 * @defaultvalue 25
	 */
	outerRadius?: number,

	/**
	 * This tells the fill color for the [[Smiley]] mouth.
	 * @defaultvalue #000000
	 */
	fillmouth?: string,

	/**
	 * This tells the fill color for the [[Smiley]] eyes.
	 * @defaultvalue #000000
	 */
	filleyes?: string,
}

export interface IDrawableBladeAttributes extends IDrawableStarAttributes
{
	/**
	 * Tells the twist multipier each of the [[Blade]] spike should have.
	 * @defaultvalue 4
	 */
	 twist?: number,
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



