export const orders=Object.freeze({T1:['WAS','IS','NEXT'],T2:['NEXT','WAS','IS'],T3:['IS','NEXT','WAS']});
export function localField(address,grain){if(typeof address!=='string'||!address||typeof grain!=='string'||!grain)throw Error('Address and grain required');return {zero:address,grain,orientations:Object.entries(orders).map(([orientation,roles])=>({orientation,centre:address,axisOrigin:address,proceed:{address:address+'::'+orientation+':PROCEED',origin:address,grain,role:null,relation:'PROCEED_FROM_CENTRE'},roles:roles.map((role,ordinal)=>({address:address+'::'+orientation+':'+role,role,ordinal,origin:address,grain})),signedRelations:['+X','-X','+Y','-Y','+Z','-Z'].map(sign=>({address:address+'::'+orientation+':'+sign,orientation,sign,origin:address,grain}))})),metricTransform:null,metricStatus:'UNRESOLVED: role ordering alone does not supply a verified metric transform.'}}
export function backtrace(records,address){const byAddress=new Map(records.map(r=>[r.resultState,r])),seen=new Set(),chain=[];let current=address;while(current){if(seen.has(current))throw Error('Cyclic lineage');seen.add(current);const r=byAddress.get(current);if(!r)throw Error('Missing predecessor '+current);chain.push(r);current=r.parentState}return chain.reverse()}

/**
 * Common resolution contract for any addressed filter.
 * Does not declare a claim true merely because a filter returned a value.
 * Callers provide their own source observation, derivation and independent replay.
 * Unknowns remain unknown; no probabilistic defaults or implicit assumptions.
 */
export function resolveFilterTruth({address,source,observation,derive,reproduce,assumptions,expected}={}){
 if(typeof address!=='string'||!address.trim())throw Error('Filter address required');
 if(typeof source!=='string'||!source.trim())throw Error('Observation source required');
 if(!Array.isArray(assumptions))throw Error('Explicit assumptions array required (may be empty)');
 const receipt={address,source,observation:observation??null,assumptions:[...assumptions],
  expected:expected===undefined?null:expected,derived:null,reproduced:null,
  status:'UNRESOLVED',difference:null,relation:'OBSERVATION_DERIVATION_REPRODUCIBILITY'};
 if(observation===undefined||typeof derive!=='function'||typeof reproduce!=='function'){
  receipt.difference='MISSING_OBSERVATION_OR_DERIVATION_OR_REPLAY';return receipt;
 }
 try{
  receipt.derived=derive(observation);
  receipt.reproduced=reproduce(observation);
  const same=JSON.stringify(receipt.derived)===JSON.stringify(receipt.reproduced);
  const expectedMatch=expected===undefined||JSON.stringify(receipt.derived)===JSON.stringify(expected);
  receipt.status=same&&expectedMatch?'REPRODUCED_WITHIN_STATED_BOUNDARY':'DIFFERENCE';
  if(receipt.status==='DIFFERENCE')receipt.difference={derived:receipt.derived,reproduced:receipt.reproduced,expected:receipt.expected};
 }catch(error){receipt.difference={error:String(error?.message??error)};}
 return receipt;
}

/**
 * Resolve every declared filter address without inventing observations.
 * Caller supplies evidence by filter key; missing evidence stays unresolved.
 * This is a filter-wide admission layer, not a claim that UI consumers invoke it.
 */
export const truthFilterKeys=Object.freeze([
 'game','player','starting-points','matches','legs','checkouts',
 'scoring','efficiency','phases','history','field-relations',
 'recursive-fracture','field-derivation','models','rendering'
]);
export function resolveAllFilterTruth({root='preview/first-frame',source,evidence={}}={}){
 if(typeof root!=='string'||!root.trim())throw Error('Root address required');
 if(typeof source!=='string'||!source.trim())throw Error('Source required');
 const receipts={};
 for(const key of truthFilterKeys){
  const entry=evidence[key];
  const address=root+'/'+key;
  if(!entry){
   receipts[key]={address,source,observation:null,assumptions:[],expected:null,
    derived:null,reproduced:null,status:'UNRESOLVED',
    difference:'NO_SOURCE_BOUND_OBSERVATION',relation:'OBSERVATION_DERIVATION_REPRODUCIBILITY'};
   continue;
  }
  receipts[key]=resolveFilterTruth({
   address,source:entry.source??source,observation:entry.observation,
   assumptions:entry.assumptions,derive:entry.derive,
   reproduce:entry.reproduce,expected:entry.expected
  });
 }
 return {root,source,receipts,coverage:truthFilterKeys.length,
  verified:Object.values(receipts).filter(r=>r.status==='REPRODUCED_WITHIN_STATED_BOUNDARY').length,
  unresolved:Object.values(receipts).filter(r=>r.status==='UNRESOLVED').length,
  differences:Object.values(receipts).filter(r=>r.status==='DIFFERENCE').length,
  boundary:'A shared admission contract; consumer integration and live execution require separate receipts.'};
}
