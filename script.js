
    function updateTertiary(selectPrimary, selectSecondary, tertiaryLabel, categories) {
      let primaryVal = selectPrimary.value;
      let secondaryVal = selectSecondary.value;
      // Ensure secondary options do not include primary
      for (let opt of selectSecondary.options) {
        opt.disabled = (opt.value === primaryVal);
      }
      // If current secondary is same as primary, change it to a different one
      if (primaryVal === secondaryVal) {
        // find first option in secondary that is not primary
        for (let opt of selectSecondary.options) {
          if (!opt.disabled) {
            selectSecondary.value = opt.value;
            secondaryVal = opt.value;
            break;
          }
        }
      }
      // Determine tertiary as the one not chosen
      let tertiaryVal = categories.find(cat => cat !== primaryVal && cat !== secondaryVal);
      tertiaryLabel.textContent = getCategoryLabel(tertiaryVal);
      return tertiaryVal;
    }
    // Maps for category labels (English value to Ukrainian label)
    const attrCategoryLabels = {
      "Physical": "Фізичні",
      "Social": "Соціальні",
      "Mental": "Ментальні"
    };
    const abilCategoryLabels = {
      "talents": "Таланти",
      "skills": "Навички",
      "knowledge": "Знання"
    };
    function getCategoryLabel(catVal) {
      return attrCategoryLabels[catVal] || abilCategoryLabels[catVal] || catVal;
    }
    // Points budgets
    let attrBudgets = {};
    let abilityBudgets = {};
    // Primary/Secondary selects
    const attrPrimarySelect = document.getElementById('attrPrimary');
    const attrSecondarySelect = document.getElementById('attrSecondary');
    const attrTertiaryLabel = document.getElementById('attrTertiaryLabel');
    const abilPrimarySelect = document.getElementById('abilPrimary');
    const abilSecondarySelect = document.getElementById('abilSecondary');
    const abilTertiaryLabel = document.getElementById('abilTertiaryLabel');
    // Initialize tertiary labels and budgets based on default selects
    let attrTertiaryVal = updateTertiary(attrPrimarySelect, attrSecondarySelect, attrTertiaryLabel, ["Physical","Social","Mental"]);
    let abilTertiaryVal = updateTertiary(abilPrimarySelect, abilSecondarySelect, abilTertiaryLabel, ["talents","skills","knowledge"]);
    function updateBudgets() {
      // Set budgets based on selected categories
      attrBudgets[attrPrimarySelect.value] = 7;
      attrBudgets[attrSecondarySelect.value] = 5;
      attrBudgets[attrTertiaryVal] = 3;
      abilityBudgets[abilPrimarySelect.value] = 13;
      abilityBudgets[abilSecondarySelect.value] = 9;
      abilityBudgets[abilTertiaryVal] = 5;
    }
    updateBudgets();
    // Query input elements
    function qsa(selector) {
      return Array.from(document.querySelectorAll(selector));
    }
    const attrInputs = qsa('.attr-input');
    const abilityInputs = qsa('.ability-input');
    const sphereInputs = qsa('.sphere-input');
    const areteInput = document.getElementById('areteInput');
    const willpowerInput = document.getElementById('willpowerInput');
    // Summaries
    const attrSummary = document.getElementById('attrSummary');
    const abilitySummary = document.getElementById('abilitySummary');
    const bgSummary = document.getElementById('bgSummary');
    const sphereSummary = document.getElementById('sphereSummary');
    const freebieSummary = document.getElementById('freebieSummary');
    // Toggle for rules
    const ignoreRulesCheckbox = document.getElementById('ignoreRules');
    // Functions to add new entries
    const backgroundList = document.getElementById('backgroundList');
    const meritsList = document.getElementById('meritsList');
    function addBackground(name, rating) {
      if (!name) return;
      // Create container div
      const entryDiv = document.createElement('div');
      entryDiv.className = 'entry';
      // Create label and input
      const label = document.createElement('label');
      label.textContent = name;
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'background-input';
      input.min = '0';
      input.max = ignoreRulesCheckbox.checked ? '10' : '5';
      input.value = rating;
      // Attach update event
      input.addEventListener('input', updatePoints);
      // Put input inside label
      label.appendChild(input);
      entryDiv.appendChild(label);
      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-entry';
      removeBtn.addEventListener('click', function() {
        entryDiv.remove();
        updatePoints();
      });
      entryDiv.appendChild(removeBtn);
      // Append to list
      backgroundList.appendChild(entryDiv);
      updatePoints();
    }
    function addMerit(name, value) {
      if (!name) return;
      const entryDiv = document.createElement('div');
      entryDiv.className = 'entry';
      const label = document.createElement('label');
      label.textContent = name;
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'merit-input';
      input.min = '-10';
      input.max = '10';
      input.value = value;
      input.addEventListener('input', updatePoints);
      label.appendChild(input);
      entryDiv.appendChild(label);
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-entry';
      removeBtn.addEventListener('click', function() {
        entryDiv.remove();
        updatePoints();
      });
      entryDiv.appendChild(removeBtn);
      meritsList.appendChild(entryDiv);
      updatePoints();
    }
    function addAbility(name, category, rating) {
      if (!name) return;
      // Determine which category column to append to
      const container = document.querySelector('.category-' + category);
      if (!container) return;
      const entryDiv = document.createElement('div');
      entryDiv.className = 'field entry';
      const label = document.createElement('label');
      label.textContent = name;
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'ability-input';
      input.setAttribute('data-category', category);
      input.min = '0';
      input.max = ignoreRulesCheckbox.checked ? '10' : '5';
      input.value = rating;
      input.addEventListener('input', updatePoints);
      label.appendChild(input);
      entryDiv.appendChild(label);
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-entry';
      removeBtn.addEventListener('click', function() {
        entryDiv.remove();
        updatePoints();
      });
      entryDiv.appendChild(removeBtn);
      container.appendChild(entryDiv);
      updatePoints();
    }
    // Event listeners for add buttons
    document.getElementById('addBackgroundBtn').addEventListener('click', function() {
      const name = document.getElementById('newBackgroundName').value.trim();
      const rating = parseInt(document.getElementById('newBackgroundRating').value) || 0;
      addBackground(name, rating);
      document.getElementById('newBackgroundName').value = '';
      document.getElementById('newBackgroundRating').value = '0';
    });
    document.getElementById('addMeritBtn').addEventListener('click', function() {
      const name = document.getElementById('newMeritName').value.trim();
      let value = parseInt(document.getElementById('newMeritValue').value) || 0;
      addMerit(name, value);
      document.getElementById('newMeritName').value = '';
      document.getElementById('newMeritValue').value = '0';
    });
    document.getElementById('addAbilityBtn').addEventListener('click', function() {
      const name = document.getElementById('newAbilityName').value.trim();
      const category = document.getElementById('newAbilityCategory').value;
      const rating = parseInt(document.getElementById('newAbilityRating').value) || 0;
      addAbility(name, category, rating);
      document.getElementById('newAbilityName').value = '';
      document.getElementById('newAbilityRating').value = '0';
    });
    // Event listeners for distribution selects
    attrPrimarySelect.addEventListener('change', function() {
      attrTertiaryVal = updateTertiary(attrPrimarySelect, attrSecondarySelect, attrTertiaryLabel, ["Physical","Social","Mental"]);
      updateBudgets();
      updatePoints();
    });
    attrSecondarySelect.addEventListener('change', function() {
      attrTertiaryVal = updateTertiary(attrPrimarySelect, attrSecondarySelect, attrTertiaryLabel, ["Physical","Social","Mental"]);
      updateBudgets();
      updatePoints();
    });
    abilPrimarySelect.addEventListener('change', function() {
      abilTertiaryVal = updateTertiary(abilPrimarySelect, abilSecondarySelect, abilTertiaryLabel, ["talents","skills","knowledge"]);
      updateBudgets();
      updatePoints();
    });
    abilSecondarySelect.addEventListener('change', function() {
      abilTertiaryVal = updateTertiary(abilPrimarySelect, abilSecondarySelect, abilTertiaryLabel, ["talents","skills","knowledge"]);
      updateBudgets();
      updatePoints();
    });
    // Listener for ignoring rules toggle
    ignoreRulesCheckbox.addEventListener('change', function() {
      const ignore = ignoreRulesCheckbox.checked;
      // If ignoring rules, increase max values and allow overspending beyond caps
      // If enforcing rules, cap values and possibly reduce any values above cap
      const maxAttr = ignore ? 10 : 5;
      const maxAbility = ignore ? 10 : 5;
      const maxSphere = ignore ? 10 : 3;
      const maxArete = ignore ? 10 : 3;
      // Update all inputs
      attrInputs.concat( qsa('.ability-input'), qsa('.background-input'), qsa('.sphere-input') )
        .forEach(input => {
          if (input.classList.contains('attr-input')) {
            input.max = maxAttr;
            if (!ignore && parseInt(input.value) > maxAttr) {
              input.value = maxAttr;
            }
          }
          if (input.classList.contains('ability-input')) {
            input.max = maxAbility;
            if (!ignore && parseInt(input.value) > maxAbility) {
              input.value = maxAbility;
            }
          }
          if (input.classList.contains('background-input')) {
            input.max = maxAbility;
            if (!ignore && parseInt(input.value) > maxAbility) {
              input.value = maxAbility;
            }
          }
          if (input.classList.contains('sphere-input')) {
            input.max = maxSphere;
            if (!ignore && parseInt(input.value) > maxSphere) {
              input.value = maxSphere;
            }
          }
        });
      // Arete and Willpower
      areteInput.max = maxArete;
      if (!ignore && parseInt(areteInput.value) > maxArete) {
        areteInput.value = maxArete;
      }
      // Willpower remains max 10 always
      updatePoints();
    });
    // Add event listeners to initial inputs
    attrInputs.forEach(inp => inp.addEventListener('input', updatePoints));
    abilityInputs.forEach(inp => inp.addEventListener('input', updatePoints));
    sphereInputs.forEach(inp => inp.addEventListener('input', updatePoints));
    areteInput.addEventListener('input', updatePoints);
    willpowerInput.addEventListener('input', updatePoints);
    // Main update function to recalc points and update summary
    function updatePoints() {
      // Ensure budgets are up to date
      updateBudgets();
      const rulesIgnored = ignoreRulesCheckbox.checked;
      // Calculate creation points usage
      // Attributes
      let physicalUsed = 0, socialUsed = 0, mentalUsed = 0;
      attrInputs.forEach(inp => {
        const val = parseInt(inp.value) || 0;
        const cat = inp.dataset.category;
        // subtract base 1 for attributes
        const allocated = val - 1;
        if (cat === 'Physical') physicalUsed += allocated;
        if (cat === 'Social') socialUsed += allocated;
        if (cat === 'Mental') mentalUsed += allocated;
      });
      // Abilities
      let talentsUsed = 0, skillsUsed = 0, knowledgeUsed = 0;
      qsa('.ability-input').forEach(inp => {
        const val = parseInt(inp.value) || 0;
        const cat = inp.dataset.category;
        // base 0
        if (cat === 'talents') talentsUsed += val;
        if (cat === 'skills') skillsUsed += val;
        if (cat === 'knowledge') knowledgeUsed += val;
      });
      // Backgrounds
      let backgroundsUsed = 0;
      qsa('.background-input').forEach(inp => {
        const val = parseInt(inp.value) || 0;
        backgroundsUsed += val;
      });
      // Spheres
      let spheresUsed = 0;
      qsa('.sphere-input').forEach(inp => {
        const val = parseInt(inp.value) || 0;
        spheresUsed += val;
      });
      // Arete & Willpower
      const areteVal = parseInt(areteInput.value) || 1;
      const willVal = parseInt(willpowerInput.value) || 1;
      // Calculate freebies usage
      let freebieAttrDots = 0, freebieAbilityDots = 0;
      let freebieBgDots = 0, freebieSphereDots = 0;
      let freebieAreteDots = 0, freebieWillDots = 0;
      // For attributes:
      if (rulesIgnored) {
        const totalAttrUsed = physicalUsed + socialUsed + mentalUsed;
        const totalAttrAllowed = 15;
        if (totalAttrUsed > totalAttrAllowed) {
          freebieAttrDots = totalAttrUsed - totalAttrAllowed;
        }
      } else {
        if (physicalUsed > (attrBudgets['Physical'] || 0)) freebieAttrDots += (physicalUsed - (attrBudgets['Physical'] || 0));
        if (socialUsed > (attrBudgets['Social'] || 0)) freebieAttrDots += (socialUsed - (attrBudgets['Social'] || 0));
        if (mentalUsed > (attrBudgets['Mental'] || 0)) freebieAttrDots += (mentalUsed - (attrBudgets['Mental'] || 0));
      }
      // Abilities
      if (rulesIgnored) {
        const totalAbilUsed = talentsUsed + skillsUsed + knowledgeUsed;
        const totalAbilAllowed = 13 + 9 + 5;
        if (totalAbilUsed > totalAbilAllowed) {
          freebieAbilityDots = totalAbilUsed - totalAbilAllowed;
        }
      } else {
        if (talentsUsed > (abilityBudgets['talents'] || 0)) freebieAbilityDots += (talentsUsed - (abilityBudgets['talents'] || 0));
        if (skillsUsed > (abilityBudgets['skills'] || 0)) freebieAbilityDots += (skillsUsed - (abilityBudgets['skills'] || 0));
        if (knowledgeUsed > (abilityBudgets['knowledge'] || 0)) freebieAbilityDots += (knowledgeUsed - (abilityBudgets['knowledge'] || 0));
      }
      // Backgrounds (always 7 allowed)
      if (backgroundsUsed > 7) freebieBgDots = backgroundsUsed - 7;
      // Spheres (always 6 allowed total)
      if (spheresUsed > 6) freebieSphereDots = spheresUsed - 6;
      // Arete (base 1 free)
      if (areteVal > 1) {
        freebieAreteDots = areteVal - 1;
      }
      // Willpower (base 5 free)
      if (willVal > 5) {
        freebieWillDots = willVal - 5;
      }
      // Merits & Flaws
      let meritPointsSpent = 0;
      let flawPointsGained = 0;
      qsa('.merit-input').forEach(inp => {
        const val = parseInt(inp.value) || 0;
        if (val > 0) {
          meritPointsSpent += val;
        } else if (val < 0) {
          flawPointsGained += (-val);
        }
      });
      // Calculate total freebies spent and total available
      const freebiesSpent = freebieAttrDots * 5
                           + freebieAbilityDots * 2
                           + freebieBgDots * 1
                           + freebieSphereDots * 7
                           + freebieAreteDots * 4
                           + freebieWillDots * 1
                           + meritPointsSpent;
      const baseFreebies = 15;
      const totalFreebies = baseFreebies + flawPointsGained;
      const freebiesLeft = totalFreebies - freebiesSpent;
      // Update summary texts
      if (rulesIgnored) {
        attrSummary.innerHTML = 'Атрибути: використано ' + (physicalUsed + socialUsed + mentalUsed) + ' з 15 (усього).';
        abilitySummary.innerHTML = 'Здібності: використано ' + (talentsUsed + skillsUsed + knowledgeUsed) + ' з 27 (усього).';
      } else {
        attrSummary.innerHTML = 'Атрибути: ' +
          'Фізичні <span class="' + (physicalUsed > attrBudgets['Physical'] ? 'overbudget' : '') + '">' + physicalUsed + '/' + attrBudgets['Physical'] + '</span>, ' +
          'Соціальні <span class="' + (socialUsed > attrBudgets['Social'] ? 'overbudget' : '') + '">' + socialUsed + '/' + attrBudgets['Social'] + '</span>, ' +
          'Ментальні <span class="' + (mentalUsed > attrBudgets['Mental'] ? 'overbudget' : '') + '">' + mentalUsed + '/' + attrBudgets['Mental'] + '</span>.';
        abilitySummary.innerHTML = 'Здібності: ' +
          'Таланти <span class="' + (talentsUsed > abilityBudgets['talents'] ? 'overbudget' : '') + '">' + talentsUsed + '/' + abilityBudgets['talents'] + '</span>, ' +
          'Навички <span class="' + (skillsUsed > abilityBudgets['skills'] ? 'overbudget' : '') + '">' + skillsUsed + '/' + abilityBudgets['skills'] + '</span>, ' +
          'Знання <span class="' + (knowledgeUsed > abilityBudgets['knowledge'] ? 'overbudget' : '') + '">' + knowledgeUsed + '/' + abilityBudgets['knowledge'] + '</span>.';
      }
      bgSummary.innerHTML = 'Передісторії: ' + backgroundsUsed + '/7.';
      sphereSummary.innerHTML = 'Сфери: ' + spheresUsed + '/6.';
      freebieSummary.innerHTML = 'Бонусні очки: використано ' + freebiesSpent + ' з ' + totalFreebies + (flawPointsGained ? ' (враховано вади)' : '') + '.';
      if (freebiesSpent > totalFreebies) {
        freebieSummary.classList.add('overspent');
      } else {
        freebieSummary.classList.remove('overspent');
      }
    }
    // Initial update
    updatePoints();