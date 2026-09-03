# InterSol Facility Finalisation Control Return — 2026-08-15

Status: **CONTROL RETURN / PROGRAMME + DISCIPLINE CONTRACTS POPULATED / NO BUILD, PUBLIC RELEASE OR ECONOMIC ACTIVATION**

## Authority

Google Drive `Type 1 Romer Cognigrex` remains canonical. Operations is a routing/control reflection; Data carries machine-readable manifests; neither replaces the detailed Drive programme/control rows.

Canonical InterSol control now extends through sheets `116`–`132`, sources through `SRC-092`, tasks through `TASK-080`, builds through `BUILD-036`, and artifacts through `ART-034`.

The current design hierarchy remains:

1. current owner design/instruction;
2. historical owner archive as attributable comparator;
3. derived digital-twin / facility architecture;
4. engineering, regulatory, safety, commissioning and operational validation.

No layer silently promotes itself into the next.

## Dependency stack

The Watch Tower source-locked tranche remains Data PR #7 on `data/intersol-watchtower-twin-v0-1`. Exact source geometry remains `InterSol - Watch Tower In Site Footprint.FCStd`, SHA-256 `c476f9f2f9946ab8e99e58dd399aa7b02bac630c5d9336b80ef66f5f2a397321`; BREP/source geometry remains authoritative over render/viewer/derived optimisation geometry.

The facility-finalisation tranche remains intentionally stacked above it as Data PR #8 on `data/intersol-facility-finalization-v0-1`. Current head is `45b899894cc7168667b4bcf445123ada861cf0f8`, open/draft/mergeable/unmerged, with 27 commits / 20 changed files / 608 additions / zero deletions. No pull-request-triggered workflow run is returned for the head, therefore no CI proof is claimed.

## Historical inheritance firewall

Sheet `120_INTERSOL_HIST_COMPARATOR_v0_1` and its Data manifest preserve old InterSol dimensions, topology, staging, costs and relative placement as comparison evidence only. Historic warehouse, road, pad, mission-control, water, airstrip and community concepts may seed bounded scenario studies; they do not establish current geometry, vehicle interfaces, programme dates, CAPEX, site coordinates or approval.

A historical value may enter a current BOD only through an explicit re-adoption record carrying current evidence, decision owner, relevant discipline/authority review and revalidation trigger.

## Current facility programme — 121 to 126

`121_INTERSOL_SPACE_PROGRAM_v0_1` defines 48 programme objects across command/operations, R&D/validation/human factors, industrial/integration/QA/logistics, amenities/safety/wellbeing, admin/public/knowledge, habitation and plant/site support.

Historical wording `R&D and faculty facilities` remains archive provenance. Owner-current semantics define the present welfare function as **SANITARY / AMENITIES / RESTROOMS**. This establishes function only, not fixture counts, room area or statutory provision.

The programme includes dedicated acoustic measurement and reverberation/material chambers, a control-room/human-factors simulator, and a `Sensory / Biofield R&D Chamber`. `Biofield` is retained as owner R&D terminology only: the chamber tests independently measurable variables such as light, sound, vibration, thermal conditions, airflow, IAQ, timing and biophilic/context conditions. No human energy-field mechanism, therapeutic, diagnostic or clinical effect is assumed.

`122_HUMAN_FACTORS_SAFETY_v0_1` provides 25 controls including sanitation, access, first aid, trigger-based emergency wash, chemical management, clean/dirty and food/contamination separation, PPE/change, ergonomics/fatigue, noise, lighting, indoor environment, fire/egress, electrical/LOTO, emergency planning, security, biosecurity, human-research ethics, privacy/sensors, wayfinding, housekeeping/materials and water cross-connection.

`123_ENV_ACOUSTIC_LIGHT_v0_1` provides 18 measurable environmental/R&D objects. Conventional task/comfort/safety baselines are accepted first. Adaptive lighting, active acoustics, biophilic systems and sensory experiments are bounded overlays with measurement, opt-out/manual control, fail-safe and rollback.

`124_ADJACENCY_FLOW_MATRIX_v0_1` provides 30 preferred/controlled/exclusion relationships across public/restricted movement, mission support, lab/food separation, receiving/quarantine/repair/fabrication/inspection/clean-integration flow, dirty/waste routes, sanitary/first-aid distribution, residency separation, potable/reuse water, vehicle/pedestrian segregation, launch-hazard separation and Eco-Grex safety/maintenance exclusions.

`125_IMPLEMENTATION_STATES_v0_1` establishes `P0 source/site → P1 safe occupied core → P2 technical operations → P3 mission/control → P4 adaptive environment → P5 acoustic R&D → P6 human/sensory R&D → P7 Eco-Grex → P8 energy R&D → P9 public/education → P10 residency/community → P∞ continuous assurance`.

P30/P90/P365 remain optional internal learning checkpoints only; event-driven reanalysis is primary and statutory/professional inspection regimes remain separate.

`126_INTERSOL_STANDARDS_APPLICABILITY_v0_1` separates source currency from project applicability for building/NCC, sanitary, access, laboratories, emergency wash, hazardous chemicals/first aid, lighting, IEQ, noise, electrical, fire/egress, OT/cyber and human-research evidence families. No source listing itself establishes InterSol compliance.

## Discipline-ready room inputs — sheet 127

`127_ROOM_INPUT_REQUIREMENTS_v0_1` now contains 20 input contracts `RIR-001..020`.

These cover occupancy/classification, sanitary amenities, emergency wash, acoustic chambers, sensory R&D, mission control/simulator, industrial/lab processes, quiet/sleep/residency, Eco-Grex, public/security, plant, clean integration, NDT, battery/energy test cell, muster, waste, OT/data room, water quality/use and finishes/maintainability.

The contract is null-safe: unavailable current site/programme/process/equipment/classification inputs stay unset. Current room areas/counts, statutory fixture quantities, emergency-wash locations, acoustic chamber geometry, plant capacity and other numerical BOD values cannot be back-solved from archive material, renders or generic ratios.

## Hazard trigger architecture — sheet 128

`128_HAZARD_TRIGGER_MATRIX_v0_1` now contains 24 hazard families `HZ-001..024`.

Covered families include corrosive splash, flammable/combustible, airborne toxic/irritant, pressure, cryogenic/extreme temperature, high-voltage/electrical, battery thermal/gas/fire, machinery, lifting, vehicle/pedestrian, high SPL/noise, vibration, optical/laser/UV, conditional ionising radiation, biological/biosecurity, cleanliness/cross-contamination, fire/egress, ergonomic/fatigue/human performance, public/restricted security, water cross-connection, launch/return external hazards, living-system interference, active acoustic/sensory R&D interference and OT sensor loss/spoof/stale data.

Conditional hazards are not silently asserted. `HZ-014` remains dormant unless an ionising-radiation method/source is actually introduced. `HZ-021` remains blocked pending authorised site/operator/vehicle/activity hazard evidence. No blast pressure, ballistic rating, exclusion distance, hazardous-area classification or radiation facility is inferred.

Smart sensing may assist detection/evidence/bounded control, but never replaces physical guarding, access, emergency wash, fire systems, electrical isolation, traffic segregation, launch safety authority or manual fallback.

## Commissioning / acceptance architecture — sheet 129

`129_COMMISSIONING_ACCEPTANCE_v0_1` contains 25 acceptance contracts `CA-001..025` across source/configuration control, occupied/access core, amenities, first aid/emergency wash, HVAC/IEQ/process ventilation, electrical/UPS/isolation, fire, OT/cyber, mission human factors, Watch Tower, mission acoustics, acoustic R&D chambers, sensory R&D, lighting, industrial flow/lifting, clean integration, chemicals, battery R&D, water, public routes, quiet/residency, Eco-Grex, waste and site emergency/traffic/muster.

Each contract defines a precondition, test, evidence, witness/owner, failure state, smart-overlay fault test, accepted fallback and recommission trigger.

No unbuilt/unscoped system is represented as commissioned. A smart/adaptive/R&D overlay cannot hide a failed conventional/reference baseline.

## Longitudinal learning — sheet 130

`130_POST_OCCUPANCY_LEARNING_v0_1` contains 18 learning loops `POE-001..018` covering space use, amenities, first aid/emergency wash, IEQ, lighting, mission acoustics, quiet/rest/sleep, mission human factors, industrial flow/maintenance, chemical/waste, energy/battery, water, public/education, Eco-Grex, acoustic R&D, sensory/biofield-labelled R&D, OT/cyber and emergency/drills/muster.

Privacy is a design constraint: prefer anonymous/aggregate environmental, maintenance and operational evidence. Personal/biometric data requires a justified use, governance and minimisation; sanitary/wellbeing spaces are not default surveillance zones.

Positive, neutral, negative and failed research results remain part of the record. No outcome is promoted by cherry-picking. Every material event, incident, failed inspection, new process/equipment/chemical, protocol change or calibration issue can trigger reanalysis before a calendar checkpoint.

## Requirements traceability — sheet 131

`131_REQUIREMENTS_TRACEABILITY_v0_1` contains 25 traced requirements `RQT-001..025`, linking authority/source to implementation, verification method, validation context, acceptance owner, blocking input, prohibited inference, supersession rule and public/evidence state.

Key locked boundaries include:

- historical comparator firewall;
- sanitary/amenity semantic lock while preserving archive wording;
- trigger-based emergency wash;
- method-verified acoustic chambers;
- biofield terminology as R&D label only with health claims blocked;
- conventional lighting/safety baseline before adaptive scenes;
- human mission/launch safety authority;
- smart/manual fail-safe requirement;
- Watch Tower exactly two owner-defined A/C tower cable-node elevations while engineering coordinates/edges remain validation-gated;
- Solar Hull/Free Flow as separately qualified R&D overlays;
- Eco-Grex exclusion from critical operational envelopes;
- privacy, OT/cyber and water-quality separation;
- null-safe numerical BOD population;
- P∞ evidence, supersession and rollback.

## Site-neutral block planning — sheet 132

`132_SITE_BLOCK_PLANNING_v0_1` contains 24 rules `BP-001..024` for public arrival/reception, secure operations, Watch Tower interface, dry/wet/acoustic R&D, industrial repair/fabrication, receiving/quarantine, clean integration, battery/energy R&D, plant/service spine, amenity distribution, quiet/wellbeing, sleep/residency, vehicle/logistics, accessible pedestrian movement, emergency/muster, water/stormwater/ecological hydrology, Eco-Grex landscape, exterior night lighting, launch/return hazard envelope, future aviation, T1-25 service reserve and phased independent shutdown.

No site coordinates or separation distances are selected. The dominant unresolved block-plan gate is an authorised launch/return site/operator/vehicle/activity hazard and safety case. Historical west-side tower placement, road/pad sizes, dam geometry, airstrip relationship and community layout remain comparators only.

The block-plan doctrine deliberately supports independent commissioning/shutdown: public, R&D, industrial, accommodation, energy-test and living-system layers should be closable/isolatable without unnecessarily disabling the last accepted safe operations core.

## Acoustics / sensory / lighting boundary

Dedicated acoustic measurement and reverberation/material chambers are current programme functions, but dimensions and performance labels wait for selected methods/equipment, source levels, structural/vibration context and chamber verification. Active/resonant acoustic R&D is isolated from live safety-critical communications and exposure controls.

The sensory/biofield-labelled room remains a controlled R&D facility only. Human studies require defined questions, measurable variables, safe exposure bounds, baseline/sham/control where appropriate, calibration, consent/privacy, ethics and reproducibility. No clinical/therapeutic claim is authorised.

Lighting/timing systems support safe task performance, shift design and recovery after conventional task/emergency lighting is accepted. They do not substitute for safe staffing, breaks or fatigue-management policy.

## T1-25 / Eco-Grex / Solar Hull / Web4 boundaries

T1-25 is conventional/certifiable core plus lifecycle/service/innovation reserve; `+25` is not a blanket code, load, structural, ecological, energy, water or financial multiplier.

Eco-Grex/living integration can be high where site evidence supports it, but remains excluded from egress, security thresholds, critical cable/structure, intake/exhaust, launch-hazard and critical-maintenance envelopes. Living overlays remain removable/cut-back and require site ecology, cultural/custodial, hydrology, fire, biosecurity and structural wet/wind-load evidence.

Solar Hull/Paint and Free Flow remain separately qualified R&D overlays. Critical operational supply uses accepted conventional architecture until explicit qualification permits otherwise.

COIN remains non-monetary provenance/authority/receipt first. Legacy EMC²/LightSpeed economic-token/NFT concepts remain historical and disabled pending a separate future legal/product/AML-tax-custody-security gate.

## Next routed evidence work

1. Keep Data PR #7, stacked Data PR #8 and Operations PR #7 draft/unmerged.
2. Obtain an authorised site boundary/survey/topography/geotechnical/hydrology/flood/utilities and cultural/ecological baseline before site geometry.
3. Lock current occupancy/use/building-classification and approval-date basis before statutory room/amenity sizing.
4. Populate current equipment, vehicle, payload, process, lifting and throughput envelopes before industrial geometry.
5. Populate chemical/waste inventories and SDS before trigger-specific emergency/ventilation/storage design.
6. Obtain operator/vehicle/activity launch safety case, QRA/hazard/emergency/permit evidence before launch-related separation, facade hardening or occupancy claims.
7. Populate discipline BOD and commissioning criteria only from accepted engineering inputs.
8. Use approved ethics/protocol/instrumentation for any human sensory research.
9. Preserve P∞ evidence/rollback and re-run affected acceptance contracts whenever a material configuration changes.

## No-go

No destructive source change; no site/partner/licence/approval inference; no unsupported room area/count/fixture/plant/emergency-wash values; no engineering certification/rating; no invented fire/blast/ballistic/radiation/hazardous-area classification; no Solar Hull/Free Flow performance claim; no ecological outcome claim; no healing-frequency/biofield/clinical claim; no canonical cable edge from geometry/render alone; no render-derived engineering geometry; no current schedule/budget inherited from archives; no deployment/public release; no secret mutation; and no economic-token activation is authorised by this control return.
