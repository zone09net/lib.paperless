/**
 * Paperless is a graphical Javascript library written in Typescript for the HTML canvas. It is bases on static objects [[Drawable]] and event actions [[Control]] 
 * that you can attach to them. Once a [[Control]] is attached, the objet can be clicked, moved or have simple annimation to it.
 * 
 * The purpose of the library is mainly to create applications has it offer minimalist animation features. 
 * 
 * Here a simple example that show how you can start easily with Paperless.
 * 
 * \
 * **index.html**
 * ```HTML
 * <!DOCTYPE html>
 * <html>
 * 	<head>
 * 		<script language="JavaScript" type="module" src="main.js"></script>
 * 	</head>
 * 
 * 	<body></body>
 * </html>
 * ```
 * 
 * \
 * **main.js**
 * ```typescript 
 * import * as Paperless from './lib.paperless.js';

 * let context: Paperless.Context = new Paperless.Context();
 * context.attach(document.body);
 * ```
 * 
 * Doing this, a new canvas will be attached to the document body and you will be ready to add some objects.
 * 
 * ```typescript 
 * let drawable: Paperless.Drawable;
 * let control: Paperless.Control;
 * 
 * drawable = context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(300, 100), new Paperless.Size(60, 60)));
 * control = context.attach(new Paperless.Controls.Blank());
 * control.attach(drawable);
 * 
 * context.attach(new Paperless.Drawables.Circle(new Paperless.Point(100, 100), 30));
 * context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(200, 100), 30));
 * ```
 * 
 * @module lib.paperless
 */

export {Point} from './lib.paperless/Point.js';
export {Size} from './lib.paperless/Size.js';
export {Drawable} from './lib.paperless/Drawable.js';
export {Control} from './lib.paperless/Control.js';
export {Component} from './lib.paperless/Component.js';
export {Group} from './lib.paperless/Group.js';
export {MouseAction} from './lib.paperless/MouseAction.js';
export {DrawAction} from './lib.paperless/DrawAction.js';
export {Context} from './lib.paperless/Context.js';
export {Fx} from './lib.paperless/Fx.js';
//export {Filter} from './lib.pazperless/Filter.js';
export {Matrix} from './lib.paperless/Matrix.js';
export * as Interfaces from './lib.paperless/interfaces/Interfaces.js' ;
export * as Controls from './lib.paperless/controls/Controls.js' ;
export * as Drawables from './lib.paperless/drawables/Drawables.js' ;
export * as Enums from './lib.paperless/enums/Enums.js';


