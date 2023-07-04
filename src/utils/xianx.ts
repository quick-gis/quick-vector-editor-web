import { transform } from 'ol/proj';

var hdms = transform([118.208889, 35.3725], 'EPSG:3857', 'EPSG:4326');

console.log(hdms);
