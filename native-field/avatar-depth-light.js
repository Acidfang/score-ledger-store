/* Avatar movement depth + default emissive lighting.
 * Pure projection helper; renderer must bind its existing avatar state to this module.
 * No invented world coordinates or alteration of the canonical Score Ledger viewer.
 */
export const avatarDepthDefaults=Object.freeze({
 depthEnabled:true,lightEnabled:true,perspective:800,
 depthScale:1,lightRadius:180,lightIntensity:1,near:1
});
export function projectAvatarLight(state={},options={}){
 const config={...avatarDepthDefaults,...options};
 const x=Number(state.x),y=Number(state.y),z=Number(state.z??0);
 if(![x,y,z].every(Number.isFinite))return {status:'UNRESOLVED_POSITION',source:state.source??null};
 const cameraZ=Number(config.perspective);
 if(!Number.isFinite(cameraZ)||cameraZ<=0)throw Error('Positive perspective required');
 const distance=cameraZ-z*Number(config.depthScale);
 if(distance<=Number(config.near))return {status:'OUTSIDE_NEAR_PLANE',source:state.source??null,x,y,z};
 const factor=config.depthEnabled?cameraZ/distance:1;
 const intensity=config.lightEnabled?Number(config.lightIntensity):0;
 return {status:'PROJECTED',source:state.source??null,
  world:{x,y,z},screen:{x:x*factor,y:y*factor,scale:factor},
  light:{enabled:Boolean(config.lightEnabled),x:x*factor,y:y*factor,z,
   radius:Math.max(0,Number(config.lightRadius)*factor),
   intensity:Math.max(0,intensity),kind:'AVATAR_POINT_LIGHT'},
  boundary:'Renderer integration, light falloff, occlusion and device performance remain unverified'};
}

/**
 * Resolve lighting for all addressed models in one shared 3D field.
 * Assumptions (explicit): Euclidean world coordinates; point emitter at avatar;
 * inverse-quadratic-like attenuation 1/(1+(distance/radius)^2);
 * optional Lambert diffuse response from supplied surface normals.
 * Missing model coordinates/normals remain unresolved, never invented.
 */
export function resolveSharedModelLighting(avatar,models=[],options={}){
 const projected=projectAvatarLight(avatar,options);
 if(!Array.isArray(models))throw Error('Models must be an array');
 const radius=projected.light?.radius??0;
 const light=projected.light;
 const lit=models.map(model=>{
  const address=model?.address;
  if(typeof address!=='string'||!address)return {address:null,status:'UNRESOLVED_MODEL_ADDRESS'};
  const position=model.position;
  if(!position||![position.x,position.y,position.z].every(v=>typeof v==='number'&&Number.isFinite(v)))
   return {address,status:'UNRESOLVED_MODEL_POSITION'};
  if(projected.status!=='PROJECTED')return {address,status:'UNRESOLVED_LIGHT_POSITION'};
  const dx=avatar.x-position.x,dy=avatar.y-position.y,dz=(avatar.z??0)-position.z;
  const distance=Math.hypot(dx,dy,dz);
  const worldRadius=Number(options.lightRadius??avatarDepthDefaults.lightRadius);
  const attenuation=light.enabled&&worldRadius>0?1/(1+(distance/worldRadius)**2):0;
  const normal=model.normal;
  let diffuse=null;
  if(normal&&[normal.x,normal.y,normal.z].every(v=>typeof v==='number'&&Number.isFinite(v))){
   const norm=Math.hypot(normal.x,normal.y,normal.z);
   diffuse=norm&&distance?Math.max(0,(normal.x*dx+normal.y*dy+normal.z*dz)/(norm*distance)):null;
  }
  return {address,status:diffuse===null?'ATTENUATION_RESOLVED_NORMAL_UNRESOLVED':'LIGHT_RESPONSE_RESOLVED',
   distance,attenuation,intensity:attenuation*light.intensity,
   diffuse,shadedIntensity:diffuse===null?null:attenuation*light.intensity*diffuse};
 });
 return {field:'SHARED_3D',emitter:'AVATAR',light:light??null,models:lit,
  assumptions:['Shared Euclidean coordinates','Point source','Inverse-quadratic-like attenuation','Lambert diffuse if normal provided'],
  boundary:'Pure source calculation; canonical renderer bindings, shadows, occlusion and live device output remain unverified'};
}

export function resolveViewerProjection(viewer,avatar,models=[],activeAddress=null){
 const light=resolveSharedModelLighting(avatar,models);
 const lights=new Map(light.models.map(m=>[m.address,m]));
 const projected=models.map(model=>{
  const p=model.position, address=model.address;
  if(!p||![p.x,p.y,p.z].every(Number.isFinite))return {address,status:'UNRESOLVED_POSITION'};
  const delta={x:viewer.x-p.x,y:viewer.y-p.y,z:viewer.z-p.z};
  const distance=Math.hypot(delta.x,delta.y,delta.z);
  if(!distance)return {address,status:'UNRESOLVED_VIEW'};
  const direction={x:delta.x/distance,y:delta.y/distance,z:delta.z/distance};
  const physical=lights.get(address)?.intensity??null;
  const active=address===activeAddress;
  return {address,geometry:'SPHERE',viewLocked:active,viewDirection:direction,
   physicalIntensity:physical,
   displayIntensity:physical===null?null:Math.max(physical,active?0.18:0),
   displayCompensationEmitsLight:false,status:'PROJECTED'};
 });
 return {field:'SHARED_3D',triad:['LIGHT','SURFACE','VIEWER'],models:projected,
  assumptions:['Euclidean viewer coordinates','Spherical model basis','Active view lock','Display-only visibility floor'],
  boundary:'Requires existing renderer to consume output; spherical UV and live visual result not verified'};
}
