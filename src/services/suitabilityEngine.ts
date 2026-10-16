import { HouseholdMemberProfile, Product, SuitabilityAnalysis, SuitabilityRating } from '../types';

export function evaluateProductSuitability(
  product: Product,
  profile: HouseholdMemberProfile
): SuitabilityAnalysis {
  // If product data has unverified or missing mandatory information
  if (
    !product.ingredientsList ||
    product.ingredientsList.length === 0 ||
    !product.nutritionFacts ||
    product.dataQuality?.isVerified === false
  ) {
    return {
      status: 'insufficient_info',
      title: 'Insufficient Product Information',
      summary: 'Essential ingredient or nutrition panel details have not been fully certified by the manufacturer.',
      matchingPoints: [],
      warningPoints: ['Complete ingredient or allergen panel not yet disclosed by distributor.'],
      conflictPoints: [],
      isMedicallyCritical: false,
    };
  }

  const matchingPoints: string[] = [];
  const warningPoints: string[] = [];
  const conflictPoints: string[] = [];
  let isMedicallyCritical = false;

  const declaredAllergensLower = product.declaredAllergens.map((a) => a.toLowerCase());
  const ingredientsJoined = product.ingredientsList.join(' ').toLowerCase();
  const precautionaryJoined = product.precautionaryStatements.join(' ').toLowerCase();

  // 1. Strict Allergen Checks (Medical Priority)
  for (const allergy of profile.allergies) {
    const allergyKey = allergy.toLowerCase();
    let allergenFoundInDeclared = false;
    let allergenFoundInPrecautionary = false;

    // Check mapping variations
    const keywords: Record<string, string[]> = {
      peanuts: ['peanut', 'groundnut', 'arachis'],
      'tree nuts': ['almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'macadamia', 'hazelnut', 'brazil nut'],
      'dairy / milk': ['milk', 'dairy', 'whey', 'casein', 'butter', 'cheese', 'cream', 'lactose', 'yogurt'],
      eggs: ['egg', 'albumin', 'ovalbumin', 'yolk'],
      soy: ['soy', 'soya', 'edamame', 'tofu', 'tempeh', 'soybean', 'lecithin (soy)'],
      'wheat / gluten': ['wheat', 'gluten', 'barley', 'rye', 'spelt', 'semolina', 'durum'],
      'crustaceans / shellfish': ['crustacean', 'shellfish', 'prawn', 'shrimp', 'crab', 'lobster', 'clam', 'mussel', 'oyster'],
      fish: ['fish', 'salmon', 'cod', 'anchovy', 'tuna', 'mackerel', 'bonito'],
      sesame: ['sesame', 'tahini'],
    };

    const targetKeywords = keywords[allergyKey] || [allergyKey];

    for (const kw of targetKeywords) {
      if (
        declaredAllergensLower.some((da) => da.includes(kw)) ||
        ingredientsJoined.includes(kw)
      ) {
        allergenFoundInDeclared = true;
      }
      if (precautionaryJoined.includes(kw)) {
        allergenFoundInPrecautionary = true;
      }
    }

    if (allergenFoundInDeclared) {
      conflictPoints.push(`Contains declared allergen: ${allergy}`);
      isMedicallyCritical = true;
    } else if (allergenFoundInPrecautionary) {
      warningPoints.push(`Precautionary warning: Manufacturer states "May contain ${allergy}" due to shared facility`);
    } else {
      matchingPoints.push(`Free from declared ${allergy}`);
    }
  }

  // 2. Food Intolerances
  for (const intolerance of profile.intolerances) {
    const intKey = intolerance.toLowerCase();
    if (intKey.includes('lactose')) {
      if (
        declaredAllergensLower.some((a) => a.includes('milk') || a.includes('dairy')) ||
        ingredientsJoined.includes('lactose') ||
        ingredientsJoined.includes('milk powder')
      ) {
        if (!product.healthBadges.some((b) => b.toLowerCase().includes('lactose-free'))) {
          conflictPoints.push('Contains dairy/lactose ingredients');
        } else {
          matchingPoints.push('Certified Lactose-Free dairy alternative');
        }
      } else {
        matchingPoints.push('Naturally Lactose-Free');
      }
    }

    if (intKey.includes('gluten')) {
      const glutenTerms = ['wheat', 'gluten', 'barley', 'rye'];
      if (
        glutenTerms.some((t) => declaredAllergensLower.some((a) => a.includes(t)) || ingredientsJoined.includes(t))
      ) {
        if (!product.healthBadges.some((b) => b.toLowerCase().includes('gluten-free'))) {
          conflictPoints.push('Contains gluten or wheat-derived grains');
          isMedicallyCritical = true;
        } else {
          matchingPoints.push('Certified Gluten-Free testing verified');
        }
      }
    }
  }

  // 3. Health Conditions & Nutritional Limits (Diabetes, Hypertension, Renal, Cardiac)
  for (const condition of profile.healthConditions) {
    const condKey = condition.toLowerCase();

    // Diabetes / Low GI
    if (condKey.includes('diabetes')) {
      const maxSugar = profile.nutritionalGoals.maxSugarGramsPer100g ?? 5.0;
      if (product.nutritionFacts.sugarsG > maxSugar * 2) {
        conflictPoints.push(`High sugar content (${product.nutritionFacts.sugarsG}g per serving) exceeds safe diabetic threshold (<${maxSugar}g)`);
      } else if (product.nutritionFacts.sugarsG > maxSugar) {
        warningPoints.push(`Moderate sugar (${product.nutritionFacts.sugarsG}g) — monitor portion size for diabetic glycemic index control`);
      } else {
        matchingPoints.push(`Low sugar content (${product.nutritionFacts.sugarsG}g) suitable for blood glucose stability`);
      }

      if (product.nutritionFacts.glycemicIndex === 'Low') {
        matchingPoints.push('Verified Low Glycemic Index (slow glucose release)');
      } else if (product.nutritionFacts.glycemicIndex === 'High') {
        warningPoints.push('High Glycemic Index ingredient — can cause rapid blood sugar elevation');
      }
    }

    // Hypertension / Low Sodium
    if (condKey.includes('hypertension')) {
      const maxSodium = profile.nutritionalGoals.maxSodiumMgPerServing ?? 350;
      if (product.nutritionFacts.sodiumMg > 800) {
        conflictPoints.push(`Excessive sodium (${product.nutritionFacts.sodiumMg}mg) conflicts with hypertensive low-sodium care`);
      } else if (product.nutritionFacts.sodiumMg > maxSodium) {
        warningPoints.push(`Moderate-high sodium (${product.nutritionFacts.sodiumMg}mg) exceeds custom target (<${maxSodium}mg)`);
      } else {
        matchingPoints.push(`Low-sodium compliant (${product.nutritionFacts.sodiumMg}mg sodium per serving)`);
      }
    }

    // Kidney Care (Low Potassium & Phosphorus)
    if (condKey.includes('kidney')) {
      if (product.nutritionFacts.potassiumMg && product.nutritionFacts.potassiumMg > 400) {
        warningPoints.push(`High potassium (${product.nutritionFacts.potassiumMg}mg) requires clinical portion caution for renal patients`);
      }
      if (ingredientsJoined.includes('phosphate') || ingredientsJoined.includes('phosphoric')) {
        conflictPoints.push('Contains inorganic phosphate food additives (problematic for kidney care)');
      }
    }

    // High Cholesterol (Heart Healthy / Low Sat Fat)
    if (condKey.includes('cholesterol')) {
      if (product.nutritionFacts.saturatedFatG && product.nutritionFacts.saturatedFatG > 4) {
        warningPoints.push(`Higher saturated fat (${product.nutritionFacts.saturatedFatG}g) — prefer unsaturated oils for lipid management`);
      } else {
        matchingPoints.push('Heart-healthy lipid profile (<2g saturated fat)');
      }
    }
  }

  // 4. Ingredients to Avoid (e.g. MSG, Palm Oil, Artificial Sweeteners)
  for (const avoidItem of profile.ingredientsToAvoid) {
    const cleanAvoid = avoidItem.toLowerCase().replace(/no |avoid /g, '').trim();
    if (ingredientsJoined.includes(cleanAvoid)) {
      conflictPoints.push(`Contains requested avoidance ingredient: ${avoidItem}`);
    }
  }

  // 5. Dietary Preferences (Vegan, Halal, Vegetarian)
  for (const pref of profile.dietaryPreferences) {
    const prefKey = pref.toLowerCase();
    if (prefKey.includes('vegan') || prefKey.includes('plant-based')) {
      const animalTerms = ['chicken', 'beef', 'pork', 'fish', 'gelatin', 'milk', 'egg', 'honey', 'whey', 'butter', 'lard'];
      if (animalTerms.some((term) => ingredientsJoined.includes(term))) {
        conflictPoints.push(`Contains animal or dairy derived ingredients incompatible with Vegan preference`);
      } else {
        matchingPoints.push('100% Plant-Based ingredients');
      }
    }

    if (prefKey.includes('vegetarian')) {
      const meatTerms = ['chicken', 'beef', 'pork', 'fish', 'prawn', 'shrimp', 'crab', 'gelatin', 'lard'];
      if (meatTerms.some((term) => ingredientsJoined.includes(term))) {
        conflictPoints.push(`Contains meat, poultry or seafood derivatives`);
      } else {
        matchingPoints.push('Suitable for Vegetarian diets');
      }
    }

    if (prefKey.includes('halal')) {
      const nonHalal = ['pork', 'lard', 'alcohol', 'wine', 'mirin'];
      if (nonHalal.some((term) => ingredientsJoined.includes(term))) {
        conflictPoints.push(`Contains non-Halal ingredients (${nonHalal.filter((t) => ingredientsJoined.includes(t)).join(', ')})`);
      } else if (product.healthBadges.some((b) => b.toLowerCase().includes('halal'))) {
        matchingPoints.push('Officially Halal Certified (MUIS or accredited agency)');
      }
    }
  }

  // Determine overall status
  let status: SuitabilityRating = 'matches';
  let title = 'Matches Your Profile';
  let summary = `Compliant with ${profile.name}'s dietary constraints and nutritional targets.`;

  if (conflictPoints.length > 0) {
    status = 'not_suitable';
    title = isMedicallyCritical ? 'Medical Restriction Conflict' : 'Not Suitable for Selected Profile';
    summary = `Contains ingredients that conflict directly with ${profile.name}'s declared restrictions.`;
  } else if (warningPoints.length > 0) {
    status = 'check_needed';
    title = 'Check Needed Before Purchasing';
    summary = `Potentially suitable, but manufacturer notices or nutritional levels require personal review.`;
  }

  return {
    status,
    title,
    summary,
    matchingPoints,
    warningPoints,
    conflictPoints,
    isMedicallyCritical,
  };
}
