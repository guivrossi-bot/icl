import Big from 'big.js'

export class CutCalculation {
  qualityIndex(materialThickness, cutQuality) {
    return 1 + (cutQuality - 1) * (0.4 + materialThickness / (1 + materialThickness))
  }

  cuttingWaterPressure(waterPressure) {
    return waterPressure / 1000
  }

  efficiencyVariable(abrasiveFlowRate, cuttingWaterPressure, orificeDiameter, nozzleDiameter) {
    return 1 + (
      abrasiveFlowRate / (
        2000 * Math.sqrt(cuttingWaterPressure) * Math.pow(nozzleDiameter, 2) * Math.pow(orificeDiameter, 0.45)
      )
    )
  }

  totalEfficiency(efficiencyVariable) {
    return 0.2 + (0.7 / efficiencyVariable)
  }

  abrasiveVelocity(orificeDiameter, cuttingWaterPressure, abrasiveFlowRate) {
    const od2 = Math.pow(orificeDiameter, 2)
    return (2000000 * od2 * cuttingWaterPressure) /
           (5391 * od2 * Math.sqrt(cuttingWaterPressure) + abrasiveFlowRate)
  }

  feedRateVariable(materialThickness, totalEfficiency, abrasiveVelocity, orificeDiameter, nozzleDiameter) {
    return (
      -1.16 * Math.log(materialThickness) +
      2.2 * Math.log(totalEfficiency * abrasiveVelocity) +
      0.3 * Math.log(orificeDiameter / nozzleDiameter)
    )
  }

  generateAbrasiveFlowValue(orificeDiameter, nozzleDiameter, isMetric) {
    const result = 1253 * nozzleDiameter * Math.pow(orificeDiameter, 0.8732)
    return isMetric ? result / 1000 : result
  }

  cutSpeed(machinabilityIndex, abrasiveFlowRate, feedRateVariable, qualityIndex, nozzleDiameter) {
    return 1.03 * (
      (0.000000020624 * machinabilityIndex * abrasiveFlowRate * Math.exp(feedRateVariable)) /
      (qualityIndex * nozzleDiameter)
    )
  }

  pierceTime(machinabilityIndex, materialThickness, nozzleDiameter, abrasiveFlowRate, feedRateVariable, qualityIndex) {
    return (30.55 * Math.pow(materialThickness, 0.6)) / (
      ((0.000000021 * machinabilityIndex * abrasiveFlowRate * Math.exp(feedRateVariable)) /
       (qualityIndex * nozzleDiameter)) * qualityIndex
    )
  }

  stationaryPierceTime(machinabilityIndex, materialThickness, piercingPressure) {
    return (
      38 * 50 * Math.exp(Math.log(materialThickness) * 2.2) /
      (machinabilityIndex * Math.exp(Math.log(piercingPressure / 1000) * 1))
    )
  }

  dynamicPierceTime(machinabilityIndex, materialThickness, orificeDiameter, nozzleDiameter, abrasiveFlowRate, cuttingWaterPressure, qualityIndex) {
    return (30.55 * Math.pow(materialThickness, 0.6)) / (
      0.000000021 * machinabilityIndex * abrasiveFlowRate *
      Math.exp(
        -1.16 * Math.log(materialThickness) +
        0.3 * Math.log(orificeDiameter / nozzleDiameter) +
        2.2 * Math.log(
          (0.2 + (0.9 - 0.2) / (
            1 + abrasiveFlowRate / (
              2000 * Math.sqrt(cuttingWaterPressure) * Math.pow(nozzleDiameter, 2) * Math.pow(orificeDiameter, 0.45)
            )
          )) *
          (2000000 * Math.pow(orificeDiameter, 2) * cuttingWaterPressure /
           (5391 * Math.pow(orificeDiameter, 2) * Math.sqrt(cuttingWaterPressure) + abrasiveFlowRate))
        )
      ) / (qualityIndex * nozzleDiameter) * qualityIndex
    )
  }
}

export class CostCalculation {
  cuttingWaterGPM(orificeNumber, orificeDiameter, waterPressure) {
    Big.RM = 0
    return new Big(orificeNumber)
      .times(19.9)
      .times(new Big(orificeDiameter).pow(2))
      .times(new Big(waterPressure).sqrt())
  }

  nozzlePower(cuttingWaterGPM, waterPressure) {
    Big.RM = 0
    return cuttingWaterGPM.times(waterPressure).div(1714).times(0.745699872)
  }

  energyCost(nozzleKWH, pumpKWH, energyCostKWH) {
    Big.RM = 0
    const power = new Big(0.4).plus(new Big(0.6).times(nozzleKWH.div(pumpKWH)))
    return power.times(new Big(pumpKWH).times(energyCostKWH))
  }

  replacementPartsCost(pumpReplacementCost, headReplacementCost, orificeNumber) {
    Big.RM = 0
    return new Big(pumpReplacementCost).plus(new Big(headReplacementCost).times(orificeNumber))
  }

  waterCost(waterCostPerThousandGal, pumpCoolingGPM, cuttingWaterGPM) {
    Big.RM = 0
    return new Big(waterCostPerThousandGal).div(1000)
      .times(new Big(pumpCoolingGPM).plus(cuttingWaterGPM))
      .times(60)
  }

  abrasiveCost(abrasiveCostPerLb, abrasiveFlowRate, orificeNumber) {
    Big.RM = 0
    return new Big(abrasiveCostPerLb).times(abrasiveFlowRate).times(60).times(orificeNumber)
  }

  costPerHour(replacementPartsCost, waterCost, laborCost, energyCost, abrasiveCost) {
    return replacementPartsCost.plus(waterCost).plus(laborCost).plus(energyCost).plus(abrasiveCost)
  }

  costPerInch(costPerHour, cutSpeedInchesPerMin) {
    Big.RM = 0
    return costPerHour.div(new Big(cutSpeedInchesPerMin).times(60))
  }
}

export class UnitConversion {
  mmToInches(mm) { return Number(new Big(mm).div(25.4)) }
  inchesToMm(inches) { return Number(new Big(inches).times(25.4)) }
  inchesToCm(inches) { return Number(new Big(inches).times(2.54)) }
  perInchToPerCm(val) { return Number(new Big(val).div(2.54)) }
  kgToLb(kg) { return Number(new Big(kg).div(0.453592)) }
  lbToKg(lb) { return Number(new Big(lb).times(0.453592)) }
  perKgToPerLb(price) { return this.lbToKg(price) }
  perLbToPerKg(price) { return this.kgToLb(price) }
  psiToBar(psi) { return Number(new Big(psi).times(0.0689476)) }
  barToPsi(bar) { return Number(new Big(bar).div(0.0689476)) }
  litreToGal(l) { return Number(new Big(l).div(3.785411784)) }
  galToLitre(gal) { return Number(new Big(gal).times(3.785411784)) }
  perLitreToPerGal(price) { return this.galToLitre(price) }
  perGalToPerLitre(price) { return this.litreToGal(price) }
}

// ─── Main calculation pipeline ───────────────────────────────────────────────
// Accepts values in either Metric or US Customary.
// Always converts to US Customary internally, then normalises output.
// Returns: { cutSpeedMmMin, costPerMeter, pierceTimeSec, dynamicPierceTimeSec,
//            costPerHour, energyCostHr, waterCostHr, abrasiveCostHr,
//            replacementCostHr, cuttingWaterGPM,
//            qualitySpeeds: [Q1..Q5 in mm/min] }
const cut = new CutCalculation()
const cost = new CostCalculation()
const conv = new UnitConversion()

function toUSCustomary(v, isMetric) {
  if (!isMetric) return { ...v }
  return {
    ...v,
    thickness: conv.mmToInches(v.thickness),
    orificeDiameter: conv.mmToInches(v.orificeDiameter),
    nozzleDiameter: conv.mmToInches(v.nozzleDiameter),
    abrasiveFlow: conv.lbToKg(v.abrasiveFlow),           // kg/min → lb/min (invert)
    cuttingPressure: conv.barToPsi(v.cuttingPressure),
    piercingPressure: conv.barToPsi(v.piercingPressure),
    abrasiveCost: conv.perKgToPerLb(v.abrasiveCost),     // $/kg → $/lb
    waterCost: conv.perLitreToPerGal(v.waterCost) * 1000, // $/L → $/1000gal
    pumpCoolingGPM: conv.litreToGal(v.pumpCoolingGPM),
    maxPumpGPM: conv.litreToGal(v.maxPumpGPM),
  }
}

export function runCalculation(inputs, isMetric) {
  const v = toUSCustomary(inputs, isMetric)

  const qualityIndex = cut.qualityIndex(v.thickness, v.cutQuality)
  const cwp = cut.cuttingWaterPressure(v.cuttingPressure)
  const effVar = cut.efficiencyVariable(v.abrasiveFlow, cwp, v.orificeDiameter, v.nozzleDiameter)
  const totalEff = cut.totalEfficiency(effVar)
  const absVel = cut.abrasiveVelocity(v.orificeDiameter, cwp, v.abrasiveFlow)
  const frv = cut.feedRateVariable(v.thickness, totalEff, absVel, v.orificeDiameter, v.nozzleDiameter)
  const cutSpeedIpm = cut.cutSpeed(v.machinabilityIndex, v.abrasiveFlow, frv, qualityIndex, v.nozzleDiameter)

  // Quality comparison speeds (Q1–Q5) in mm/min
  const qualitySpeeds = [1, 2, 3, 4, 5].map(q => {
    const qi = cut.qualityIndex(v.thickness, q)
    const spd = cut.cutSpeed(v.machinabilityIndex, v.abrasiveFlow, frv, qi, v.nozzleDiameter)
    return conv.inchesToMm(spd)
  })

  // Pierce times (seconds)
  const pierceTimeSec = cut.stationaryPierceTime(v.machinabilityIndex, v.thickness, v.piercingPressure)
  const cwpPierce = cut.cuttingWaterPressure(v.piercingPressure)
  const dynamicPierceTimeSec = cut.dynamicPierceTime(
    v.machinabilityIndex, v.thickness,
    v.orificeDiameter, v.nozzleDiameter,
    v.abrasiveFlow, cwpPierce, qualityIndex
  )

  // Costs
  const cuttingWaterGPM = cost.cuttingWaterGPM(v.orificeNumber, v.orificeDiameter, v.cuttingPressure)
  const nozzlePow = cost.nozzlePower(cuttingWaterGPM, v.cuttingPressure)
  const energyCostHr = Number(cost.energyCost(nozzlePow, v.kiloWatt, v.energyCost))
  const waterCostHr = Number(cost.waterCost(v.waterCost, v.pumpCoolingGPM, cuttingWaterGPM))
  const abrasiveCostHr = Number(cost.abrasiveCost(v.abrasiveCost, v.abrasiveFlow, v.orificeNumber))
  const replacementCostHr = Number(cost.replacementPartsCost(v.pumpReplacementParts, v.headReplacementPartsCost, v.orificeNumber))
  const laborCostHr = v.laborCost || 0
  const totalCostHr = Number(cost.costPerHour(
    new Big(replacementCostHr), new Big(waterCostHr),
    new Big(laborCostHr), new Big(energyCostHr), new Big(abrasiveCostHr)
  ))
  const cpi = Number(cost.costPerInch(new Big(totalCostHr), new Big(cutSpeedIpm)))

  // Normalised outputs
  const cutSpeedMmMin = conv.inchesToMm(cutSpeedIpm)
  const costPerMeter = cpi * 39.3701   // $/inch → $/m

  return {
    cutSpeedMmMin,
    costPerMeter,
    pierceTimeSec,
    dynamicPierceTimeSec,
    costPerHour: totalCostHr,
    energyCostHr,
    waterCostHr,
    abrasiveCostHr,
    replacementCostHr,
    laborCostHr,
    cuttingWaterGPM: Number(cuttingWaterGPM),
    qualitySpeeds,
  }
}
