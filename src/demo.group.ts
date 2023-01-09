import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({autosize: true, dragging: {delay: 0}});
context.attach(document.body);


let colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
let vertical: Paperless.Group = context.attach(new Paperless.Group());
let horizontal: Paperless.Group = context.attach(new Paperless.Group());
let group: Paperless.Group = context.attach(new Paperless.Group());

let arrow1: Paperless.Drawables.Arrow = context.attach(new Paperless.Drawables.Arrow(new Paperless.Point((window.innerWidth / 2) - 100, (window.innerHeight / 2) - 30), new Paperless.Size(50, 30), {fillcolor: colors[3], angle: 270}))
let arrow2: Paperless.Drawables.Arrow = context.attach(new Paperless.Drawables.Arrow(new Paperless.Point((window.innerWidth / 2) - 100, (window.innerHeight / 2) + 30), new Paperless.Size(50, 30), {fillcolor: colors[3], angle: 90}))
let arrow3: Paperless.Drawables.Arrow = context.attach(new Paperless.Drawables.Arrow(new Paperless.Point((window.innerWidth / 2) - 30, (window.innerHeight / 2) - 100), new Paperless.Size(50, 30), {fillcolor: colors[4], angle: 180}))
let arrow4: Paperless.Drawables.Arrow = context.attach(new Paperless.Drawables.Arrow(new Paperless.Point((window.innerWidth / 2) + 30, (window.innerHeight / 2) - 100), new Paperless.Size(50, 30), {fillcolor: colors[4], angle: 0}))
let control1: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank({restrict: Paperless.Enums.Restrict.vertical}));
let control2: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank({restrict: Paperless.Enums.Restrict.vertical}));
let control3: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank({restrict: Paperless.Enums.Restrict.horizontal}));
let control4: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank({restrict: Paperless.Enums.Restrict.horizontal}));
control1.attach(arrow1);
control2.attach(arrow2);
control3.attach(arrow3);
control4.attach(arrow4);
horizontal.attach([arrow1, arrow2]);
vertical.attach([arrow3, arrow4]);

let circle1: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle(new Paperless.Point((window.innerWidth / 2) - 100, (window.innerHeight / 2) - 100), 30, 0, {fillcolor: colors[0]}))
let circle2: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0,0), 30, 0, {fillcolor: colors[0], offset: {x: 0, y: 200}}))
let circle3: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 30, 0, {fillcolor: colors[0], offset: {x: 200, y: 0}}))
let circle4: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle(new Paperless.Point((window.innerWidth / 2) + 100, (window.innerHeight / 2) + 100), 30, 0, {fillcolor: colors[1]}))
let control5: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank());
let control6: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank());
let control7: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank());
let control8: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank());
control5.attach(circle1);
control6.attach(circle2);
control7.attach(circle3);
control8.attach(circle4);
circle2.matrix = circle1.matrix;
circle3.matrix = circle1.matrix;

let circle5: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2), 30, 0, {fillcolor: colors[2]}))
let control9: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank());
control9.attach(circle5);
group.attach(circle5);
group.enroll([arrow1, arrow2, arrow3, arrow4, circle1, circle2, circle3, circle4, circle5])


