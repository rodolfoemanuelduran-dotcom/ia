'use strict';
const VERSION='2026-08-18.1';
const CACHE_PREFIX='simuladores-electricos-static-';
const CACHE=`${CACHE_PREFIX}${VERSION}`;
const SCOPE=self.registration.scope;
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  './archivos/mobile-pwa.css',
  './archivos/circuito-tactil.html',
  './archivos/circuito-llave-doble.html',
  './archivos/circuito-llave-triple.html',
  './archivos/circuito-combinacion.html',
  './archivos/circuito-ca-llave-toma.html','./archivos/circuito-ca.js',
  './archivos/circuito-ca-2p-t.html','./archivos/circuito-ca-2p.js',
  './archivos/circuito-ca-toma-doble.html','./archivos/circuito-ca-toma-doble.css','./archivos/circuito-ca-toma-doble.js'
];
const URLS=new Set(ASSETS.map(path=>{const url=new URL(path,SCOPE);url.search='';return url.href}));
const INDEX=new URL('./index.html',SCOPE).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(path=>new Request(new URL(path,SCOPE),{cache:'reload'})))})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;url.search='';url.hash='';if(URLS.has(url.href)){event.respondWith((async()=>{const cache=await caches.open(CACHE);return(await cache.match(url.href))||fetch(request)})());return}if(request.mode==='navigate')event.respondWith(fetch(request).catch(async()=>{const cache=await caches.open(CACHE);return(await cache.match(INDEX))||Response.error()}))});
