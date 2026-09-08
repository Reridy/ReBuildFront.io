(()=>{
  const TEMPLATES='rbf.templates',ACTIVE='rbf.activeAvatar';
  const image=v=>{
    if(typeof v==='string'&&/^data:image\/(?:png|jpeg|webp);base64,/i.test(v))return v;
    if(v&&typeof v==='object')return image(v.src??v.data??v.dataUrl??v.image??v.url);
    return null;
  };
  try{
    const raw=localStorage.getItem(TEMPLATES);
    let parsed=[];
    if(raw!=null&&raw!=='')try{parsed=JSON.parse(raw)}catch{parsed=[]}
    if(!Array.isArray(parsed)){const one=image(parsed);parsed=one?[one]:[]}
    const templates=[...new Set(parsed.map(image).filter(Boolean))].slice(-12);
    try{localStorage.setItem(TEMPLATES,JSON.stringify(templates))}catch{
      try{localStorage.removeItem(TEMPLATES);localStorage.setItem(TEMPLATES,'[]')}catch{}
    }
    const active=image(localStorage.getItem(ACTIVE));
    if(active){if(active!==localStorage.getItem(ACTIVE))try{localStorage.setItem(ACTIVE,active)}catch{}}
    else try{localStorage.removeItem(ACTIVE)}catch{}
    try{localStorage.setItem('rbf.storageVersion','2')}catch{}
  }catch{}
})();
