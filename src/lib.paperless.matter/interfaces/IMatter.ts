import * as Paperless from '@zone09.net/paperless';



export interface IMatterEntity
{
	drawable: Paperless.Drawable, 
	body: any,
}

export interface IMatterBody
{
	point?: {x: number, y: number}
	options?: any
}

export interface IMatterBodyRectangle extends IMatterBody
{
	size?: {width: number, height: number} 
}

export interface IMatterBodySmiley extends IMatterBody
{
	radius?: number,
	sides?: number
}

export interface IMatterBodyHexagon extends IMatterBody
{
	outerRadius?: number,
	innerRadius?: number,
	angleStart?: number,
	angleEnd?: number,
}

export interface IMatterBodyArrow extends IMatterBody
{
	size?: {width: number, height: number} 
	baseWidth?: number, 
	baseHeight?: number
}

export interface IMatterBodyCircle extends IMatterBodyPolygon
{
}

export interface IMatterBodyPolygon extends IMatterBody
{
	outerRadius?: number,
	innerRadius?: number,
	angleStart?: number,
	angleEnd?: number,
	sides?: number
}

export interface IMatterBodyVertices extends IMatterBody
{
	points?: Paperless.Point[],
}

export interface IMatter
{
	context?: Paperless.Context,
	engine?: any,
	render?: any,
	runner?: any,
	mouseConstraint?: any,
	norender?: boolean,
}

