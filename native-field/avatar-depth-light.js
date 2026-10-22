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
