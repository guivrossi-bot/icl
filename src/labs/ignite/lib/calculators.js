export function calcBurnRate(d, unit) {
  const plasmaSpdM = unit === "imperial" ? d.plasmaSpeed * 25.4 : d.plasmaSpeed;
  const torchSpdM = unit === "imperial" ? d.torchSpeed * 25.4 : d.torchSpeed;
  const dailyCutM = unit === "imperial" ? d.dailyCut * 25.4 : d.dailyCut;
  const totalLength = d.employees * dailyCutM * d.opDays;
  const plasmaTime = (totalLength * (d.torchUse / 100)) / (plasmaSpdM / 1000 * 60);
  const torchTime = (totalLength * (d.torchUse / 100)) / (torchSpdM / 1000 * 60);
  const timeSavings = Math.max(0, torchTime - plasmaTime);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcNoPreheat(d) {
  const startsPerYear = d.plasmaStarts * d.opDays * d.employees;
  const timeSavings = Math.max(0, (startsPerYear * d.preheatTime) / 3600);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcTraining(d) {
  const timeSavings = Math.max(0, (d.oxyTraining - d.plasmaTraining) * d.trainEmployees * d.trainWeeks);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcSetup(d) {
  const torchHr = (d.oxySetup / 60) * d.torchSetups * d.numShifts * d.opDays * d.employees;
  const plasmaHr = (d.plasmaSetup / 60) * d.plasmaSetups * d.numShifts * d.opDays * d.employees;
  const timeSavings = Math.max(0, torchHr - plasmaHr);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcGrinding(d) {
  const oxyTotal = d.grindEmployees * d.dailyGrind * d.opDays;
  const plasmaTotal = oxyTotal * (d.plasmaGrindPct / 100);
  const timeSavings = Math.max(0, oxyTotal - plasmaTotal);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcSkeleton(d) {
  const torchTime = d.skelHours * d.skelShifts * d.skelEmployees * d.opDays;
  const timeSavings = Math.max(0, torchTime * 0.5);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcBeveling(d, unit) {
  const plasmaSpdM = unit === "imperial" ? d.bevelPlasmaSpeed * 25.4 : d.bevelPlasmaSpeed;
  const oxySpdM = unit === "imperial" ? d.bevelOxySpeed * 25.4 : d.bevelOxySpeed;
  const totalLength = d.bevelStations * d.bevelHours * 60 * oxySpdM * d.opDays / 1000;
  const plasmaTime = totalLength * 1000 / plasmaSpdM / 60;
  const oxyTime = totalLength * 1000 / oxySpdM / 60;
  const timeSavings = Math.max(0, oxyTime - plasmaTime);
  const laborSavings = timeSavings * d.laborRate * (d.bevelEmployees / d.bevelStations);
  const opCost = (oxyTime * (d.gasCost + d.oxyConsumables)) - (plasmaTime * (d.elecCost + d.plasmaConsumables));
  return { timeSavings, savings: Math.max(0, laborSavings + opCost) };
}

export function calcMarking(d, unit) {
  const plasmaSpdM = unit === "imperial" ? d.plasmaMarkSpeed * 25.4 : d.plasmaMarkSpeed;
  const punchSpdM = unit === "imperial" ? d.punchSpeed * 25.4 : d.punchSpeed;
  const totalMark = d.markEmployees * d.dailyMark * d.opDays;
  const plasmaTime = totalMark * 1000 / plasmaSpdM / 60;
  const punchTime = totalMark * 1000 / punchSpdM / 60;
  const timeSavings = Math.max(0, punchTime - plasmaTime);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export function calcGouging(d, unit) {
  const plasmaSpdM = unit === "imperial" ? d.plasmaGougSpeed * 25.4 : d.plasmaGougSpeed;
  const cagSpdM = unit === "imperial" ? d.cagSpeed * 25.4 : d.cagSpeed;
  const dailyM = unit === "imperial" ? d.gougLength * 0.3048 : d.gougLength;
  const totalLength = d.gougEmployees * dailyM * d.opDays;
  const plasmaTime = totalLength * 1000 / plasmaSpdM / 60;
  const cagTime = totalLength * 1000 / cagSpdM / 60;
  const plasmaCost = plasmaTime * d.laborRate + (plasmaTime * 60 / d.consumLife) * d.plasmaStackCost + (totalLength / 30) * d.grindAfterPlasma / 60 * d.laborRate;
  const cagCost = cagTime * d.laborRate + (cagTime * 60 / d.rodLife) * d.carbonRodCost + (totalLength / 30) * d.grindAfterCAG / 60 * d.laborRate;
  const timeSavings = Math.max(0, cagTime - plasmaTime);
  return { timeSavings, savings: Math.max(0, cagCost - plasmaCost) };
}

export function calcTempAttach(d, unit) {
  const flushSpdM = unit === "imperial" ? d.flushCutRate * 25.4 : d.flushCutRate;
  const altSpdM = unit === "imperial" ? d.altRate * 25.4 : d.altRate;
  const grindSpdM = unit === "imperial" ? d.grindRate * 25.4 : d.grindRate;
  const dailyM = unit === "imperial" ? d.dailyCutLength * 25.4 : d.dailyCutLength;
  const totalLength = d.employees * dailyM * d.opDays;
  const flushLength = totalLength * (d.flushUse / 100);
  const altLength = totalLength * (d.torchCAGUse / 100);
  const plasmaTime = flushLength * 1000 / flushSpdM / 60 * (1 + d.grindPctPlasma / 100);
  const altTime = altLength * 1000 / altSpdM / 60 + altLength * 1000 / grindSpdM / 60 + d.torchSetupTime * d.opDays;
  const timeSavings = Math.max(0, altTime - plasmaTime);
  return { timeSavings, savings: timeSavings * d.laborRate };
}

export const INDUSTRY_DEFAULTS = {
  metric: {
    burnRate: { employees: 200, opDays: 312, laborRate: 20, torchUse: 15, plasmaSpeed: 610, torchSpeed: 457, dailyCut: 20 },
    noPreheat: { employees: 80, opDays: 312, laborRate: 20, torchUse: 15, preheatTime: 15, plasmaStarts: 35 },
    training: { laborRate: 20, oxyTraining: 40, plasmaTraining: 6, trainEmployees: 7, trainWeeks: 50 },
    setup: { employees: 200, opDays: 312, numShifts: 2, laborRate: 20, oxySetup: 5, plasmaSetup: 3, torchSetups: 1.75, plasmaSetups: 1 },
    grinding: { grindEmployees: 85, opDays: 205, laborRate: 20, dailyGrind: 1.5, plasmaGrindPct: 20 },
    skeleton: { skelHours: 1, skelShifts: 2, skelEmployees: 30, opDays: 312, laborRate: 20 },
    beveling: { bevelEmployees: 12, bevelStations: 4, bevelHours: 5, opDays: 312, laborRate: 20, bevelPlasmaSpeed: 660, bevelOxySpeed: 457, elecCost: 1.68, gasCost: 12.98, plasmaConsumables: 0.70, oxyConsumables: 0.06 },
    marking: { markEmployees: 10, opDays: 240, laborRate: 20, dailyMark: 5, plasmaMarkSpeed: 2540, punchSpeed: 305 },
    gouging: { gougEmployees: 4, opDays: 208, laborRate: 20, gougLength: 60, carbonRodCost: 0.65, plasmaStackCost: 50, rodLife: 15, consumLife: 180, plasmaGougSpeed: 508, cagSpeed: 254, grindAfterPlasma: 10, grindAfterCAG: 20 },
    tempAttach: { employees: 10, opDays: 312, laborRate: 15, dailyCutLength: 20, flushCutRate: 2286, grindPctPlasma: 40, altRate: 457, grindRate: 76, torchSetupTime: 0, torchCAGUse: 15, flushUse: 20 },
  },
  imperial: {
    burnRate: { employees: 80, opDays: 312, laborRate: 20, torchUse: 15, plasmaSpeed: 24, torchSpeed: 18, dailyCut: 775 },
    noPreheat: { employees: 80, opDays: 312, laborRate: 20, torchUse: 15, preheatTime: 15, plasmaStarts: 35 },
    training: { laborRate: 20, oxyTraining: 40, plasmaTraining: 6, trainEmployees: 7, trainWeeks: 50 },
    setup: { employees: 200, opDays: 312, numShifts: 2, laborRate: 20, oxySetup: 5, plasmaSetup: 3, torchSetups: 1.75, plasmaSetups: 1 },
    grinding: { grindEmployees: 85, opDays: 205, laborRate: 20, dailyGrind: 1.5, plasmaGrindPct: 20 },
    skeleton: { skelHours: 1, skelShifts: 2, skelEmployees: 30, opDays: 312, laborRate: 20 },
    beveling: { bevelEmployees: 12, bevelStations: 4, bevelHours: 5, opDays: 312, laborRate: 20, bevelPlasmaSpeed: 26, bevelOxySpeed: 18, elecCost: 1.68, gasCost: 12.98, plasmaConsumables: 0.70, oxyConsumables: 0.06 },
    marking: { markEmployees: 10, opDays: 240, laborRate: 20, dailyMark: 200, plasmaMarkSpeed: 100, punchSpeed: 13 },
    gouging: { gougEmployees: 5, opDays: 260, laborRate: 25, gougLength: 300, carbonRodCost: 0.65, plasmaStackCost: 50, rodLife: 15, consumLife: 180, plasmaGougSpeed: 20, cagSpeed: 10, grindAfterPlasma: 10, grindAfterCAG: 20 },
    tempAttach: { employees: 80, opDays: 312, laborRate: 3, dailyCutLength: 775, flushCutRate: 93, grindPctPlasma: 40, altRate: 20, grindRate: 3, torchSetupTime: 0, torchCAGUse: 15, flushUse: 20 },
  },
};

export const APP_CALC_MAP = {
  burnRate: calcBurnRate,
  noPreheat: calcNoPreheat,
  training: calcTraining,
  setup: calcSetup,
  grinding: calcGrinding,
  skeleton: calcSkeleton,
  beveling: calcBeveling,
  marking: calcMarking,
  gouging: calcGouging,
  tempAttach: calcTempAttach,
};