(function(){
  'use strict';
  var body=document.body;
  var id=body&&body.getAttribute('data-film-id');
  if(!id)return;
  var root=document.currentScript&&document.currentScript.src
    ? new URL('.',document.currentScript.src).href : './';
  function setText(sel,value){
    var el=document.querySelector(sel);
    if(el && value!==undefined && value!==null && value!=='') el.textContent=value;
  }
  function render(d){
    if(!d)return;
    document.title=d.title+' — NoxStream';
    setText('[data-film-title]',d.title);
    setText('[data-film-synopsis]',d.synopsis);
    var meta=[];
    if(d.year)meta.push(d.year);
    if(d.genre)meta.push(d.genre);
    if(d.duration)meta.push(d.duration);
    if(d.quality)meta.push(d.quality);
    if(Array.isArray(d.versions)&&d.versions.length)meta.push(d.versions.join(' / '));
    setText('[data-film-meta]',meta.join(' · '));
    if(d.director)setText('[data-film-director]',d.director);
    if(Array.isArray(d.actors))setText('[data-film-actors]',d.actors.join(', '));
  }
  fetch(root+'details/manifest.json',{cache:'no-store'})
    .then(function(r){if(!r.ok)throw new Error('manifest');return r.json();})
    .then(function(man){
      var ref=man.films&&man.films[id];
      if(!ref||!ref.file)throw new Error('film');
      return fetch(root+'details/'+encodeURIComponent(ref.file),{cache:'no-store'})
        .then(function(r){if(!r.ok)throw new Error('details');return r.json();})
        .then(function(list){
          var d=Array.isArray(list)?list.find(function(x){return x&&x.id===id;}):null;
          if(!d)throw new Error('details-film');
          render(d);
        });
    })
    .catch(function(e){console.warn('NoxStream détails indisponibles :',e);});
})();