import {ColorfiguresRenderer} from './colorfigures-renderer.js';
// Compatibility entry: the old vector route now uses the same illustrated backend.
export function createVectorDisplay(){return new ColorfiguresRenderer();}
