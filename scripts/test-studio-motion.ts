import assert from 'node:assert/strict';
import { parseBezier, sampleBezierY, springToCss, springBounce, timeToPhysics, physicsToTime } from '../apps/web/lib/studio-motion';

const linear=sampleBezierY(parseBezier('linear')!);
assert.ok(linear.every((value,index)=>Math.abs(value-index/(linear.length-1))<0.0001));
const early=sampleBezierY([0.1,0,0.2,1]);
const late=sampleBezierY([0.8,0,0.9,1]);
assert.ok(early[60]-late[60]>0.6,'horizontal control points change the easing graph');
assert.equal(parseBezier('cubic-bezier(NaN, 0, 1, 1)'),null);
assert.equal(parseBezier('cubic-bezier(2, 0, 1, 1)'),null);
for(const duration of [0.05,0.2,0.5,1,2]) for(const bounce of [0,0.01,0.25,0.5,0.99,1]) {
 const result=physicsToTime(timeToPhysics(duration,bounce));
 assert.ok(Math.abs(result.duration-duration)<0.001);
 assert.ok(Math.abs(result.bounce-bounce)<0.001);
 assert.ok(Math.abs(springBounce(springToCss(bounce))-bounce)<0.001);
 const graph=sampleBezierY(parseBezier(springToCss(bounce))!);
 assert.ok(graph.every(Number.isFinite));
 assert.equal(graph[0],0);assert.equal(graph.at(-1),1);
 assert.ok(Math.max(...graph)<1.3,'preview matches the applied bounded CSS easing');
}
console.log('PASS easing time axis, keyword parsing, spring round trips, finite endpoints and maximum bounce');
