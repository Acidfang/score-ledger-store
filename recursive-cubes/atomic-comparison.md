# Atomic observations: hydrogen comparison, first pass

Status: **No atomic-spectrum match has been established.** The current implementation does not define a photon-emission observable. A specific candidate, identifying spectral lines with frequencies of centre motion, fails for hydrogen under the proposed `N = Z` assignment: the implemented `N = 1` centres are stationary at every depth.

This is a test of that assignment, observable and implementation together. It does not refute every possible continuation of the broader geometric idea. In particular, local +Y placement is an explicit implementation convention.

## 1. Scope and source snapshot

- Audited model: version `2026-10-17-centre-paths-11-fir`, commit `d8475b8b4953026edc9b26f084e1a307627b1164`; [immutable source](https://github.com/Acidfang/score-ledger-store/blob/d8475b8b4953026edc9b26f084e1a307627b1164/recursive-cubes/index.html) and [raw immutable HTML](https://raw.githubusercontent.com/Acidfang/score-ledger-store/d8475b8b4953026edc9b26f084e1a307627b1164/recursive-cubes/index.html).
- [Live Centre paths viewer](https://acidfang.github.io/score-ledger-store/recursive-cubes/) may advance beyond this audited version; it is not the pinned audit input.
- Audited `index.html` SHA-256: `fe7b5c71f8e0c89c91b19d7d2f20026cd5b0e9d5cb9d7b27e39b4e98642138b3`.
- Observation retrieval: 2026-10-17; NIST Atomic Spectra Database (ASD) **5.12**, DOI [10.18434/T4W30F](https://doi.org/10.18434/T4W30F).
- Test case: neutral atomic hydrogen, H I, with the **hypothesis** that one child corresponds to atomic number `Z = 1`. The default display has six children; this audit deliberately selects one.
- The 12°/model-second root rate, 24°/model-second local rate and size ratio are illustration settings. No conversion to physical seconds, charge, mass, energy or wavelength is supplied by the code.

## 2. Observations, without a model fit

Selection rule: the first four consecutive Balmer multiplets, upper principal quantum number `n = 3, 4, 5, 6`, ending at `n = 2`. Here atomic `n` is a spectroscopic label, not an identification with model depth.

The [exact NIST query](https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra=H%20I&limits_type=0&low_w=400&upp_w=700&unit=1&de=0&format=0&line_out=0&remove_js=on&en_unit=0&output=0&page_size=100&show_obs_wl=1&show_calc_wl=1&unc_out=1&order_out=0&show_av=3&conf_out=on&term_out=on&enrg_out=on&J_out=on&bibrefs=1&A_out=0&allowed_out=1&forbid_out=1) returned 53 rows. Only the four **observed** entries classified as unresolved `2–n` multiplets are retained below; the Ritz column and unclassified calculated blend-centre rows are excluded. All wavelengths below are **vacuum nm**, not the familiar air-wavelength labels. These are historical measurements retained in the current reference database, not new 2026 measurements.

| Line; emission transition | Observed vacuum λ (nm) | Standard uncertainty uλ (nm) | ν/ν(Hα) | Approximate u(ratio) | ASD line reference |
|---|---:|---:|---:|---:|---|
| Hα; 3 → 2 | 656.460 | 0.003 | 1 exactly | 0 by definition | L7400c29 |
| Hβ; 4 → 2 | 486.271 | 0.005 | 1.349988 | 0.000015 | L7439c30 |
| Hγ; 5 → 2 | 434.1692 | 0.0006 | 1.5119912 | 0.0000072 | L7436c29 |
| Hδ; 6 → 2 | 410.2892 | 0.0006 | 1.5999934 | 0.0000077 | L7436c29 |

These are unresolved multiplets, not individual fine- or hyperfine-structure components. NIST cautions that these `n`-classified reference values are pertinent to solar-coronal comparisons; a blend's apparent centre depends on excitation and observing conditions. The source compilation is [Kramida (2010), Table 10 and §§10.1–10.2, 10.5–10.7](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=842564). Its underlying references are Mitchell (1947) for Hα, Dyson (1906) for Hβ and Wood (1920–1922) for Hγ/Hδ; the compilation applies systematic-shift or wavelength-scale corrections. The ASD observed values above, not re-rounded values from the older paper, are the numeric inputs.

For vacuum wavelengths,

`ν = c/λ`, with `c = 299792458 m/s`, and `Ri = νi/να = λα/λi`.

Thus the derived frequencies are approximately 456.6805, 616.5131, 690.49683 and 730.6857 THz. No model parameters enter these conversions.

ASD uncertainties are [one-standard-deviation estimates](https://physics.nist.gov/PhysRefData/ASD/Html/lineshelp.html). The ratio uncertainties shown use first-order propagation with zero covariance between distinct wavelength measurements:

`u(Ri) = Ri × sqrt[(uα/λα)² + (ui/λi)²]`.

With known covariance, subtract `2 Cov(λα,λi)/(λα λi)` inside the square root. The retrieved rows provide no cross-line covariance. All ratios share the Hα denominator and therefore are correlated even if the original measurements were independent. Do not use these approximate uncertainties for an unsupported multi-line significance claim. Hα divided by itself is exactly one; its ratio uncertainty is not obtained by treating two copies of the same measurement as independent.

## 3. What the implemented geometry actually derives

The relation engine uses centre position `c`, orientation matrix `R`, size `s`, indexed unit direction `u`, direction-basis matrix `B`, and local phase `φ`:

`c_child = c_parent + R_parent u (s_parent + s_child)/2`

`R_child = R_parent B Ry(φ)`.

The root centre is fixed at zero and `R_root = Ry(θ)`. For `N = 1`, the actual `directions(1)` returns `u = (0,1,0)` and `B = I`. For fixed size ratio `ρ`, since `Ry(a)u = u` for every angle `a`, induction gives, at depth `d` (lengths in the root-size display unit):

`R_d(t) = Ry[θ(t) + d φ(t)]`

`c_d(t) = (0, Sd, 0)`

`Sd = Σ(j=1…d) (ρ^(j−1) + ρ^j)/2`

`Sd = d` when `ρ = 1`; otherwise `Sd = [(1+ρ)/2] [(1−ρ^d)/(1−ρ)]`.

Consequently `dc_d/dt = 0` and `d²c_d/dt² = 0`, for arbitrary root/local phases and rates and every finite depth. Removing root rotation for the parent-relative view leaves this unchanged. Additional addressed shells and the scaled inner copy remain stationary. The orientations can rotate while the centres do not.

For the centre-motion candidate, any fixed linear combination of centres is constant, and its Fourier transform has only a zero-frequency (DC) component. Subtracting its constant offset leaves the zero signal. There is no nonzero centre-motion line to assign to Hα, Hβ, Hγ or Hδ. This statement does not cover a hypothetical, separately specified observable based on internal orientation, time-dependent charges, energy differences or additional dynamics.

### Numerical receipt

The embedded audit reads the actual three engines from the hashed HTML, with no reimplementation of their motion equations. It compares the FIR engine with `CubeRelation.transforms`, checks the independently calculated world and parent-frame curves including the next shell, and computes every non-DC discrete Fourier bin of the deepest centre's displacement.

Run: Node.js 24.19.0; `N = 1`; depths 0–8; ratios 1, 0.6 and 0.3; 1,024 samples per ratio over `[0,30)` model seconds; root/local phase origins 0.31/−0.47 rad; rates 12/24° per model second.

- Largest centre-coordinate displacement: **0**
- Largest FIR/reference centre-coordinate difference: **0**
- Largest calculated-curve or next-shell displacement, either frame: **0**
- Largest non-DC DFT amplitude of deepest-centre displacement: **0**
- Largest orientation-matrix element change: **1.9999993658636694**, confirming that the angular dynamics were active
- Depth-8 centres: `(0,8,0)`, `(0,1.96640768,0)`, `(0,0.9285105049999999,0)` for the three ratios

These zeros are numerical results consistent with the all-times proof above; the proof is what removes finite sampling and frequency-resolution ambiguity.

## 4. Calibration and prediction status

A legitimate one-scale comparison would first specify a physical observable and line assignments, producing nonzero dimensionless frequencies `fi`. Hα could fix a single scale `K = να / fα`; the remaining checks would then be `νi,pred / να = fi / fα`, with no per-line scale, additive offset, or harmonic chosen after inspecting each observation.

Here `fα` does not exist for centre motion: its nonzero-frequency spectrum is empty. Division by zero is not a calibration, and a finite scale cannot convert a constant trajectory into an optical-frequency signal. **Model line ratios, residuals and a goodness-of-fit statistic are therefore undefined.** No fit or independent spectral prediction has been performed. The measured ratios in §2 are targets, not outputs or confirmations of the model. Since those targets are now visible, subsequent fitting to them would require additional unseen lines or observations for genuinely independent validation.

The next physical derivation needs to fix:

1. Which geometric quantity corresponds to the emitting physical observable, and its emission or energy-transition law.
2. How the atom and its excited states determine child count, geometry, rates and state/line assignments. `N = Z` remains a testable proposal.
3. Which parameters are predicted versus calibrated, including the physical time/energy scale, before comparing further lines.

Changing the +Y placement, choosing a different child-count mapping, importing a known atomic energy law, or assigning additional harmonics would define a new candidate. Such changes can be investigated, but cannot be counted as an existing prediction of this implementation. The RGB ancestry palette is also an uncalibrated display choice, not an emission spectrum.

## 5. Reproduce from this one file

Save the raw immutable HTML linked in §1 as `index.html`. From the directory containing that file, run the following block. It uses Node's standard library only, reads local source without modifying it, refuses a different source hash, and prints the calculation receipt and the complete four-row data/ratio calculation. No network access is required for the audit; the NIST query in §2 provides the observation provenance.

```bash
node <<'JS'
const fs=require('node:fs'), vm=require('node:vm'), crypto=require('node:crypto');
const source=fs.readFileSync(process.argv[2]||'index.html','utf8');
const expected='fe7b5c71f8e0c89c91b19d7d2f20026cd5b0e9d5cb9d7b27e39b4e98642138b3';
const sha256=crypto.createHash('sha256').update(source).digest('hex');
if(sha256!==expected)throw Error('Different model source: '+sha256);
const ctx=vm.createContext({});
for(const id of ['relation-engine','fir-engine','prediction-engine']){
 const match=source.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)</script>'));
 if(!match)throw Error('Missing engine '+id);
 vm.runInContext(match[1],ctx);
}
const {E,F,P}=vm.runInContext('({E:CubeRelation,F:CubeFIR,P:CubePredictions})',ctx);
const M=1024,T=30, rootSpeed=12,localSpeed=24;
let largestDisplacement=0,largestEngineDifference=0,largestPredictionDisplacement=0;
let largestRotationChange=0,largestNonDC=0;
const cases=[];
for(const ratio of [1,.6,.3]){
 const model=F.create(E,{childCount:1,ratio,filterAddress:'root',shellFrom:0,shellTo:8,instances:1,rootSpeed,localSpeed,rootAngle:.31,localAngle:-.47});
 const initial=model.reconstruct().map(n=>({centre:n.centre.slice(),rotation:n.rotation.slice()}));
 const series=[];
 for(let j=0;j<M;j++){
  const t=T*j/M, rootAngle=.31+rootSpeed*Math.PI/180*t,localAngle=-.47+localSpeed*Math.PI/180*t;
  model.apply({changes:{rootAngle,localAngle},time:t,continuous:true});
  const actual=model.reconstruct(),reference=E.transforms(model.nodes,rootAngle,localAngle);
  actual.forEach((n,i)=>{
   n.centre.forEach((x,k)=>{
    largestDisplacement=Math.max(largestDisplacement,Math.abs(x-initial[i].centre[k]));
    largestEngineDifference=Math.max(largestEngineDifference,Math.abs(x-reference[i].centre[k]));
   });
   n.rotation.forEach((x,k)=>largestRotationChange=Math.max(largestRotationChange,Math.abs(x-initial[i].rotation[k])));
  });
  series.push(actual.at(-1).centre.map((x,k)=>x-initial.at(-1).centre[k]));
 }
 // DFT of displacement from the initial position, including all non-DC bins.
 for(let k=1;k<M;k++)for(let axis=0;axis<3;axis++){
  let re=0,im=0;
  for(let j=0;j<M;j++){const angle=2*Math.PI*k*j/M;re+=series[j][axis]*Math.cos(angle);im-=series[j][axis]*Math.sin(angle);}
  largestNonDC=Math.max(largestNonDC,Math.hypot(re,im)/M);
 }
 const template=F.shellTemplate(E,model.nodes,1,ratio);
 for(const mode of ['parent','world']){
  const predicted=P.build(E,F,{nodes:model.nodes,template,mode,rootSpeed,localSpeed,origin:{rootAngle:.31,localAngle:-.47,time:0},instances:1,includeShells:true});
  if(!predicted.ok)throw Error(predicted.reason);
  for(const frame of predicted.frames){
   frame.positions.forEach((x,k)=>largestPredictionDisplacement=Math.max(largestPredictionDisplacement,Math.abs(x-predicted.frames[0].positions[k])));
   for(const curve of predicted.curves.filter(c=>c.kind==='shell')){
    const now=F.shellPoint(E,template,frame,curve.parentIndex,curve.childIndex);
    const before=F.shellPoint(E,template,predicted.frames[0],curve.parentIndex,curve.childIndex);
    now.forEach((x,k)=>largestPredictionDisplacement=Math.max(largestPredictionDisplacement,Math.abs(x-before[k])));
   }
  }
 }
 cases.push({ratio,nodes:model.nodes.length,deepestCentre:initial.at(-1).centre});
}
const data=[
 {line:'H-alpha',upper_n:3,lambda_nm:656.460,u_nm:.003,ref:'L7400c29'},
 {line:'H-beta',upper_n:4,lambda_nm:486.271,u_nm:.005,ref:'L7439c30'},
 {line:'H-gamma',upper_n:5,lambda_nm:434.1692,u_nm:.0006,ref:'L7436c29'},
 {line:'H-delta',upper_n:6,lambda_nm:410.2892,u_nm:.0006,ref:'L7436c29'}
];
const a=data[0];
for(const row of data){
 row.frequency_THz=299792.458/row.lambda_nm;
 row.u_frequency_THz=row.frequency_THz*row.u_nm/row.lambda_nm;
 row.ratio=row.frequency_THz/a.frequency_THz;
 row.u_ratio_zero_covariance=row===a?0:row.ratio*Math.hypot(a.u_nm/a.lambda_nm,row.u_nm/row.lambda_nm);
}
console.log(JSON.stringify({sha256,samplesPerCase:M,durationModelSeconds:T,cases,largestDisplacement,largestEngineDifference,largestPredictionDisplacement,largestRotationChange,largestNonDC,data},null,2));
JS
```
