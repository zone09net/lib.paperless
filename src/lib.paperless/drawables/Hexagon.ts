import {Point} from '../Point.js';
import {Polygon} from './Polygon.js';
import {IDrawablePolygonAttributes} from '../interfaces/IDrawable.js';



/**
 * The Hexagon class creates a new hexagon [[Drawable]] with the specified attributes.
 * When creating the object, the class is not limited to the 6 sides an hexagon could have, thus
 * anyone could create a circle with enough sides.
 * 
 * The following code creates none filled hexagon.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const hexagon: Paperless.Drawables.Hexagon;
 *
 * hexagon = new Paperless.Drawables.Hexagon({
 * 	nofill: true,
 * });
 * 
 * context.attach(document.body);
 * context.attach(hexagon);
 * ```
 */

 export class Hexagon extends Polygon
 {
	 /**
	  * Contructs an Triangle drawable.
	  */
	 public constructor(attributes: IDrawablePolygonAttributes = {})
	 {
		 super({
			 ...attributes,
			 ...{sides: 6}
		 });
	 }
 
	 /**
	  * Clones this [[Drawable]] with attributes only.
	  * 
	  * @param 	attributes 			Attributes that you would like to override.
	  * @returns 						A new clone of this Drawable.
	  */
	 public clone(attributes: IDrawablePolygonAttributes = {}): Hexagon
	 {
		 const cloned: Hexagon = new Hexagon({
			 ...this.attributes,
			 ...{
				 outerRadius: this.outerRadius,
				 innerRadius: this.innerRadius,
				 angleStart: this.angleStart,
				 angleEnd: this.angleEnd,
				 sides: this.sides,
			 },
			 ...attributes
		 });
 
		 return cloned;
	 }
 }
 