<template>
  <div class="kitchen-checklist">
    <div class="checklist-header">
      <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Kitchen Essentials Checklist</h2>
      <p class="checklist-subtitle">Track what you own, what you need, and what to upgrade. Progress saves automatically in your browser.</p>
      <div class="progress-summary">
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: overallPercent + '%' }"></div>
        </div>
        <span class="progress-text">{{ completedCount }} / {{ totalItems }} items ({{ overallPercent }}%)</span>
      </div>
    </div>

    <div class="category-tabs">
      <button 
        v-for="cat in categories" 
        :key="cat.id" 
        class="tab-btn" 
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        <span class="tab-icon">{{ cat.icon }}</span>
        <span class="tab-label">{{ cat.name }}</span>
        <span class="tab-count">{{ getCategoryProgress(cat.id).done }} / {{ getCategoryProgress(cat.id).total }}</span>
      </button>
    </div>

    <div class="category-content">
      <div v-for="item in getCategoryItems(activeCategory)" :key="item.id" class="checklist-item" :class="{ 'priority-high': item.priority === 'high', 'priority-medium': item.priority === 'medium', 'priority-low': item.priority === 'low', 'owned': checked[item.id], 'upgrade': upgrade[item.id] }">
        <div class="item-main">
          <label class="checkbox-wrapper">
            <input 
              type="checkbox" 
              v-model="checked[item.id]" 
              @change="saveState"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
          </label>
          <div class="item-info">
            <div class="item-header">
              <span class="item-name">{{ item.icon }} {{ item.name }}</span>
              <span class="priority-badge" :class="item.priority">{{ item.priority }}</span>
              <span v-if="item.budget" class="budget-badge">{{ item.budget }}</span>
            </div>
            <p class="item-desc">{{ item.description }}</p>
            <div class="item-meta" v-if="item.specs || item.recommendations">
              <span v-if="item.specs" class="specs">{{ item.specs }}</span>
              <div v-if="item.recommendations" class="recommendations">
                <strong>Recommended:</strong>
                <span v-for="(rec, i) in item.recommendations" :key="i" class="rec-tag">{{ rec }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="item-actions" v-if="checked[item.id]">
          <label class="upgrade-toggle" v-if="item.upgradable">
            <input type="checkbox" v-model="upgrade[item.id]" @change="saveState" />
            <span>Mark as "Needs Upgrade"</span>
          </label>
          <button class="notes-btn" @click="showNotes(item.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Notes
          </button>
        </div>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="editingNotesId" class="notes-modal-overlay" @click.self="closeNotes">
      <div class="notes-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ getItem(editingNotesId).icon }} {{ getItem(editingNotesId).name }} — Notes</h3>
          <button class="close-btn" @click="closeNotes">×</button>
        </div>
        <textarea 
          v-model="itemNotes[editingNotesId]" 
          placeholder="Add notes: purchase date, price, model number, maintenance log, upgrade plans..."
          class="notes-textarea"
        ></textarea>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeNotes">Done</button>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div class="export-section">
      <h3>📤 Export Your Checklist</h3>
      <div class="export-buttons">
        <button @click="exportChecklist" class="export-btn">📄 Full Checklist (TXT)</button>
        <button @click="exportShoppingList" class="export-btn secondary">🛒 Shopping List (Missing Items)</button>
        <button @click="exportUpgradeList" class="export-btn secondary">🔧 Upgrade List</button>
        <button @click="copySummary" class="export-btn secondary">📋 Copy Summary</button>
      </div>
    </div>

    <div class="disclaimer">
      <small>💡 Tip: Start with "Must-Have" items. Quality > Quantity — a good chef's knife beats a 12-piece block set. Progress saves automatically via localStorage.</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const STORAGE_KEY = 'kitchen-checklist-v2'

// ============================================
// CATEGORIES & ITEMS
// ============================================

const categories = [
  { id: 'knives', name: 'Knives', icon: '🔪' },
  { id: 'cookware', name: 'Cookware', icon: '🍳' },
  { id: 'bakeware', name: 'Bakeware', icon: '🥧' },
  { id: 'tools', name: 'Tools & Gadgets', icon: '🥄' },
  { id: 'appliances', name: 'Small Appliances', icon: '🤖' },
  { id: 'storage', name: 'Storage & Prep', icon: '📦' },
  { id: 'pantry', name: 'Pantry Essentials', icon: '🌰' }
]

const allItems = [
  // KNIVES
  { id: 'k1', category: 'knives', name: "8-10\" Chef's Knife", icon: '🔪', priority: 'high', budget: '$30-80', description: '90% of all cutting tasks. Get the best you can afford.', specs: '8-10", full tang, high-carbon stainless', recommendations: ['Victorinox Fibrox ($45)', 'Mac MTH-80 ($140)', 'Wüsthof Classic ($170)'], upgradable: true },
  { id: 'k2', category: 'knives', name: 'Paring Knife', icon: '🔪', priority: 'high', budget: '$10-30', description: 'Detail work: peeling, coring, deveining, small fruits.', specs: '3-4", pointed tip', recommendations: ['Victorinox 3.25" ($8)', 'Wüsthof 3.5" ($50)'], upgradable: true },
  { id: 'k3', category: 'knives', name: 'Bread / Serrated Knife', icon: '🍞', priority: 'medium', budget: '$20-60', description: 'Bread, tomatoes, citrus, delicate cakes. Long blade, deep serrations.', specs: '9-10", offset handle preferred', recommendations: ['Mercer Millennia 10" ($25)', 'Wüsthof Classic 9" ($130)'], upgradable: true },
  { id: 'k4', category: 'knives', name: 'Honing Steel / Ceramic Rod', icon: '🔧', priority: 'high', budget: '$15-40', description: 'Realigns edge between sharpenings. Use every few uses.', specs: '12", ceramic or diamond-coated', recommendations: ['Idle Ceramic Rod ($25)', 'Wüsthof Steel ($40)', 'DMT Diamond Steel ($50)'], upgradable: false },
  { id: 'k5', category: 'knives', name: 'Kitchen Shears', icon: '✂️', priority: 'medium', budget: '$10-25', description: 'Herbs, poultry, packaging, pizza. Take apart for cleaning.', specs: 'Detachable, stainless', recommendations: ['OXO Good Grips ($20)', 'Kai 5500 ($30)'], upgradable: false },

  // COOKWARE
  { id: 'c1', category: 'cookware', name: '10-12" Non-Stick Skillet', icon: '🍳', priority: 'high', budget: '$25-60', description: 'Eggs, fish, pancakes, delicate foods. Replace when coating fails.', specs: 'PTFE or ceramic, oven-safe handle', recommendations: ['T-fal 10.25" ($25)', 'OXO 12" ($55)', 'Made In 10" ($80)'], upgradable: true },
  { id: 'c2', category: 'cookware', name: '10-12" Stainless Steel Skillet', icon: '🥘', priority: 'high', budget: '$40-120', description: 'Searing, browning, pan sauces, deglazing. Lifetime piece.', specs: 'Tri-ply (aluminum core), 18/10 stainless', recommendations: ['Tramontina 10" ($50)', 'All-Clad D3 10" ($130)', 'Made In 10" ($110)'], upgradable: true },
  { id: 'c3', category: 'cookware', name: '10-12" Cast Iron Skillet', icon: '🍳', priority: 'high', budget: '$20-40', description: 'High-heat searing, oven-to-table, naturally non-stick when seasoned.', specs: 'Pre-seasoned, 10-12", helper handle', recommendations: ['Lodge 10.25" ($20)', 'Field Company No.8 ($110)', 'Stargazer 10.5" ($150)'], upgradable: true },
  { id: 'c4', category: 'cookware', name: '3-4 Qt Saucepan', icon: '🥣', priority: 'high', budget: '$30-80', description: 'Sauces, grains, reheating, small batches. Tight-fitting lid essential.', specs: 'Tri-ply, pour spout, lid', recommendations: ['Tramontina 3 Qt ($45)', 'All-Clad 3 Qt ($130)'], upgradable: true },
  { id: 'c5', category: 'cookware', name: '6-8 Qt Stock Pot / Dutch Oven', icon: '🍲', priority: 'high', budget: '$50-350', description: 'Stocks, soups, pasta, braises, bread. Enameled = no seasoning needed.', specs: 'Enameled cast iron preferred', recommendations: ['Tramontina 6.5 Qt ($55)', 'Cuisinart 7 Qt ($90)', 'Le Creuset 5.5 Qt ($350)'], upgradable: true },
  { id: 'c6', category: 'cookware', name: '12" Sauté Pan (Straight Sides)', icon: '🍳', priority: 'medium', budget: '$50-130', description: 'Shallow frying, braising, reducing sauces. More surface area than skillet.', specs: 'Tri-ply, lid, helper handle', recommendations: ['Tramontina 5 Qt ($70)', 'All-Clad 5 Qt ($180)'], upgradable: true },
  { id: 'c7', category: 'cookware', name: 'Carbon Steel Wok or Skillet', icon: '🥢', priority: 'medium', budget: '$30-70', description: 'High-heat stir-fry, lightweight, seasons like cast iron.', specs: '14" wok or 10-12" skillet, flat or round bottom', recommendations: ['Yosukata 14" Wok ($60)', 'Made In Carbon Steel ($100)'], upgradable: true },

  // BAKEWARE
  { id: 'b1', category: 'bakeware', name: 'Rimmed Baking Sheets (Half Sheet)', icon: '🍪', priority: 'high', budget: '$15-30', description: 'Roasting vegetables, cookies, sheet pan dinners. Get 2-3.', specs: '18x13", heavy gauge aluminum, no non-stick', recommendations: ['Nordic Ware Natural ($18)', 'Chicago Metallic ($22)'], upgradable: false },
  { id: 'b2', category: 'bakeware', name: '9x13" Baking Dish', icon: '🍰', priority: 'high', budget: '$15-40', description: 'Casseroles, brownies, lasagna, roasting chicken. Glass or ceramic.', specs: 'Glass (Pyrex) or ceramic', recommendations: ['Pyrex 9x13 ($15)', 'Le Creuset 9x13 ($60)'], upgradable: true },
  { id: 'b3', category: 'bakeware', name: '8-9" Round Cake Pans (Set of 2)', icon: '🎂', priority: 'medium', budget: '$15-35', description: 'Layer cakes, deep dish pizza. Straight sides, heavy gauge.', specs: '2" or 3" deep, aluminum', recommendations: ['Fat Daddio\'s 8"x3" ($18)', 'USA Pan 9" ($25)'], upgradable: true },
  { id: 'b4', category: 'bakeware', name: '12-Cup Muffin Tin', icon: '🧁', priority: 'medium', budget: '$12-25', description: 'Muffins, cupcakes, individual frittatas, portion control.', specs: 'Heavy gauge, non-stick or uncoated', recommendations: ['Wilton 12-cup ($15)', 'USA Pan ($25)'], upgradable: true },
  { id: 'b5', category: 'bakeware', name: 'Loaf Pan (9x5")', icon: '🍞', priority: 'medium', budget: '$10-20', description: 'Banana bread, meatloaf, pound cake, freezing portions.', specs: 'Aluminum or glass', recommendations: ['Chicago Metallic ($12)', 'Pyrex Glass ($12)'], upgradable: true },
  { id: 'b6', category: 'bakeware', name: 'Pie Plate (9")', icon: '🥧', priority: 'medium', budget: '$10-30', description: 'Pies, quiches, crisps. Glass lets you see bottom crust.', specs: 'Glass (Pyrex) or ceramic', recommendations: ['Pyrex 9" ($10)', 'Emile Henry 9" ($30)'], upgradable: true },
  { id: 'b7', category: 'bakeware', name: 'Cooling Rack', icon: '🧊', priority: 'high', budget: '$10-20', description: 'Prevents soggy bottoms, even cooling. Fits inside half-sheet pan.', specs: 'Grid pattern, fits half-sheet', recommendations: ['OXO Good Grips ($15)', 'Wilton ($10)'], upgradable: false },

  // TOOLS & GADGETS
  { id: 't1', category: 'tools', name: 'Large Cutting Board', icon: '🪵', priority: 'high', budget: '$25-60', description: 'Protects knives, stable surface. Wood = kinder to edges; plastic = dishwasher safe.', specs: '18x24" minimum, 1.5-2" thick', recommendations: ['Teakhaus 18x24" ($55)', 'John Boos Maple ($90)', 'OXO Plastic 15x20" ($25)'], upgradable: true },
  { id: 't2', category: 'tools', name: 'Instant-Read Thermometer', icon: '🌡️', priority: 'high', budget: '$20-100', description: 'Only way to know meat is safe & perfectly cooked. Essential for food safety.', specs: '2-3 sec read, ±0.5°F, foldable probe', recommendations: ['ThermoPop 2 ($35)', 'Thermapen ONE ($100)', 'Lavatools Javelin Pro ($55)'], upgradable: true },
  { id: 't3', category: 'tools', name: 'Mixing Bowls (Set of 3-5)', icon: '🥣', priority: 'high', budget: '$20-60', description: 'Prep, marinating, serving, storage. Stainless nests; glass = microwave safe.', specs: '1.5, 3, 5, 8 Qt range', recommendations: ['OXO Stainless 5-pc ($50)', 'Pyrex Glass 4-pc ($30)', 'Cuisinart Stainless ($40)'], upgradable: true },
  { id: 't4', category: 'tools', name: 'Measuring Cups (Dry)', icon: '📏', priority: 'high', budget: '$10-25', description: 'Nested set: 1/4, 1/3, 1/2, 1 cup. Stainless = durable, readable.', specs: 'Stainless, engraved markings', recommendations: ['OXO 4-pc ($15)', 'Cuisinart 4-pc ($12)'], upgradable: false },
  { id: 't5', category: 'tools', name: 'Liquid Measuring Cup (2-4 cup)', icon: '🥛', priority: 'high', budget: '$8-20', description: 'Clear markings, pour spout, handle. Glass = microwave safe.', specs: '2 or 4 cup, angled markings', recommendations: ['Pyrex 2-cup ($8)', 'OXO 4-cup Angled ($18)'], upgradable: true },
  { id: 't6', category: 'tools', name: 'Measuring Spoons', icon: '🥄', priority: 'high', budget: '$8-20', description: '1/4 tsp, 1/2 tsp, 1 tsp, 1 Tbsp. Stainless, narrow for jars.', specs: 'Stainless, detachable ring', recommendations: ['OXO 4-pc ($12)', 'Spring Chef 6-pc ($10)'], upgradable: false },
  { id: 't7', category: 'tools', name: 'Digital Kitchen Scale', icon: '⚖️', priority: 'high', budget: '$15-40', description: 'Baking by weight = consistent results. Coffee, portions, macros.', specs: '0.1g accuracy, 5kg+ capacity, tare', recommendations: ['Escali Primo ($25)', 'OXO 11lb ($40)', 'Greater Goods ($15)'], upgradable: true },
  { id: 't8', category: 'tools', name: 'Silicone Spatulas (Set)', icon: '🥄', priority: 'high', budget: '$12-30', description: 'Scraping bowls, folding, high-heat safe. One-piece = no gunk trap.', specs: 'Heat-resistant to 600°F, one-piece', recommendations: ['GIR Mini Set ($25)', 'OXO 3-pc ($20)', 'Di Oro 3-pc ($18)'], upgradable: true },
  { id: 't9', category: 'tools', name: 'Tongs (12")', icon: '🥢', priority: 'high', budget: '$10-25', description: 'Flipping, serving, grilling, pasta. Locking mechanism, silicone tips.', specs: '12", stainless, silicone tips, locking', recommendations: ['OXO 12" ($18)', 'Kuhn Rikon 12" ($20)'], upgradable: true },
  { id: 't10', category: 'tools', name: 'Whisk (Balloon & Flat)', icon: '🥚', priority: 'medium', budget: '$8-20', description: 'Balloon = aerating; flat = sauces, gravy, deglazing.', specs: 'Stainless wires, sealed handle', recommendations: ['OXO Balloon ($12)', 'Spring Chef Set ($15)'], upgradable: true },
  { id: 't11', category: 'tools', name: 'Box Grater / Microplane', icon: '🧀', priority: 'high', budget: '$15-35', description: 'Cheese, citrus zest, ginger, chocolate, garlic. Microplane = zest/finest grating.', specs: '4-sided box + microplane zester', recommendations: ['Microplane Classic ($18)', 'OXO Box Grater ($25)'], upgradable: true },
  { id: 't12', category: 'tools', name: 'Vegetable Peeler (Y-Peeler)', icon: '🥕', priority: 'high', budget: '$5-15', description: 'Faster, less waste than swivel. Carbon steel stays sharp.', specs: 'Y-shape, carbon or stainless blade', recommendations: ['Kuhn Rikon Original ($8)', 'OXO Good Grips ($12)'], upgradable: false },
  { id: 't13', category: 'tools', name: 'Colander / Strainer', icon: '🥣', priority: 'high', budget: '$12-30', description: 'Pasta, washing produce, rinsing beans. Fine mesh for quinoa/rice.', specs: '5-6 Qt, stable base, handles', recommendations: ['OXO 5 Qt ($25)', 'Bellemain Micro-perf ($20)'], upgradable: true },
  { id: 't14', category: 'tools', name: 'Salad Spinner', icon: '🥗', priority: 'medium', budget: '$20-40', description: 'Dry greens = dressing adheres, longer storage. Pump or pull-cord.', specs: '4-5 Qt, brake button', recommendations: ['OXO Good Grips 4 Qt ($35)', 'Zyliss ($25)'], upgradable: true },
  { id: 't15', category: 'tools', name: 'Can Opener (Smooth Edge)', icon: '🥫', priority: 'high', budget: '$15-30', description: 'No sharp edges, lid doesn\'t fall in. Smooth-edge = safer.', specs: 'Side-cutting, smooth edge', recommendations: ['OXO Smooth Edge ($20)', 'Kuhn Rikon Auto Safety ($20)'], upgradable: true },
  { id: 't16', category: 'tools', name: 'Garlic Press', icon: '🧄', priority: 'medium', budget: '$15-30', description: 'Minced garlic in seconds. Easy-clean hinged design.', specs: 'Stainless, hinged for cleaning', recommendations: ['OXO Good Grips ($25)', 'Zyliss Susi 3 ($30)'], upgradable: true },

  // SMALL APPLIANCES
  { id: 'a1', category: 'appliances', name: 'Immersion Blender', icon: '🥤', priority: 'high', budget: '$30-80', description: 'Soups in the pot, sauces, smoothies, whip cream. Corded = more power.', specs: '200-300W, removable shaft, variable speed', recommendations: ['Braun MultiQuick 5 ($60)', 'KitchenAid 3-Speed ($70)', 'Vitamix Immersion ($150)'], upgradable: true },
  { id: 'a2', category: 'appliances', name: 'Food Processor (7-14 cup)', icon: '🔪', priority: 'medium', budget: '$80-250', description: 'Chopping, slicing, shredding, dough, pesto, nut butter. Saves massive prep time.', specs: 'Multiple blades/discs, wide feed tube', recommendations: ['Cuisinart 14-cup ($200)', 'Breville Sous Chef ($300)', 'KitchenAid 9-cup ($180)'], upgradable: true },
  { id: 'a3', category: 'appliances', name: 'Stand Mixer', icon: '🍰', priority: 'medium', budget: '$250-450', description: 'Bread, cookies, meringue, shredded chicken. Tilt-head vs bowl-lift.', specs: '325W+, 4.5-7 Qt, planetary action', recommendations: ['KitchenAid Artisan 5 Qt ($380)', 'Ankarsrum ($700)'], upgradable: true },
  { id: 'a4', category: 'appliances', name: 'High-Speed Blender', icon: '🥤', priority: 'medium', budget: '$100-500', description: 'Smoothies, nut milk, soups, nut butter, ice cream. Tamper essential.', specs: '1000W+, 64oz container, tamper', recommendations: ['Vitamix E310 ($350)', 'Ninja Professional ($120)', 'Blendtec Classic ($300)'], upgradable: true },
  { id: 'a5', category: 'appliances', name: 'Electric Kettle (Variable Temp)', icon: '🫖', priority: 'high', budget: '$30-80', description: 'Precise temps for coffee/tea (175-212°F). Gooseneck for pour-over.', specs: '1L, variable temp, hold function, gooseneck option', recommendations: ['Fellow Stagg EKG ($165)', 'Bonavita 1L ($70)', 'Cosori Gooseneck ($60)'], upgradable: true },
  { id: 'a6', category: 'appliances', name: 'Slow Cooker / Instant Pot', icon: '🍲', priority: 'medium', budget: '$60-150', description: 'Set-and-forget meals, beans, stocks, yogurt. Instant Pot = pressure + slow + rice.', specs: '6-8 Qt, programmable, sauté function', recommendations: ['Instant Pot Duo 7-in-1 ($100)', 'Crock-Pot 7 Qt ($60)'], upgradable: true },
  { id: 'a7', category: 'appliances', name: 'Air Fryer', icon: '🍟', priority: 'medium', budget: '$70-200', description: 'Crispy with less oil, reheats leftovers perfectly, small batch roasting.', specs: '4-6 Qt, 1700W+, dishwasher basket', recommendations: ['Ninja 4 Qt ($100)', 'Cosori 5.8 Qt ($100)', 'Instant Vortex ($120)'], upgradable: true },
  { id: 'a8', category: 'appliances', name: 'Toaster Oven / Countertop Oven', icon: '🍞', priority: 'medium', budget: '$80-350', description: 'Toast, bake, broil, air fry, reheat — more versatile than slot toaster.', specs: 'Convection, 6-slice+ capacity, multiple functions', recommendations: ['Breville Smart Oven Air ($350)', 'Panasonic FlashXpress ($130)', 'Ninja DT201 ($180)'], upgradable: true },

  // STORAGE & PREP
  { id: 's1', category: 'storage', name: 'Glass Storage Containers (Set)', icon: '🥡', priority: 'high', budget: '$30-60', description: 'Microwave, oven, freezer safe. No stains, no plastic leaching. Snap lids.', specs: 'Borosilicate glass, leak-proof lids, nesting', recommendations: ['Pyrex 18-pc ($40)', 'Glasslock 18-pc ($50)', 'Snapware ($45)'], upgradable: true },
  { id: 's2', category: 'storage', name: 'Deli Containers (Quart/Pint)', icon: '🥡', priority: 'high', budget: '$15-30', description: 'Restaurant standard. Stack perfectly, freezer/microwave/dishwasher safe.', specs: 'Polypropylene, 8oz/16oz/32oz, matching lids', recommendations: ['Cambro 8oz/16oz/32oz ($25)', 'DuraHome 48-pc ($30)'], upgradable: false },
  { id: 's3', category: 'storage', name: 'Mason Jars (Wide Mouth)', icon: '🫙', priority: 'high', budget: '$15-30', description: 'Dry goods, ferments, overnight oats, salads, drinking glasses. Pint + quart.', specs: 'Wide mouth, Ball/Kerr, reusable lids', recommendations: ['Ball 12-pc Pint ($15)', 'Ball 12-pc Quart ($18)'], upgradable: false },
  { id: 's4', category: 'storage', name: 'Vacuum Sealer + Bags', icon: '📦', priority: 'medium', budget: '$50-150', description: 'Bulk meat, sous vide, freezer burn prevention, portion control.', specs: 'Chamber or external, roll storage', recommendations: ['FoodSaver FM2000 ($80)', 'Anova Precision ($150)'], upgradable: true },
  { id: 's5', category: 'storage', name: 'Label Maker / Masking Tape + Sharpie', icon: '🏷️', priority: 'high', budget: '$5-30', description: 'Date everything. Prevents mystery containers, food waste.', specs: 'Brother P-touch or simple tape+marker', recommendations: ['Sharpie + Painters Tape ($5)', 'Brother P-touch PTD210 ($25)'], upgradable: true },
  { id: 's6', category: 'storage', name: 'Fridge/Freezer Thermometer', icon: '🌡️', priority: 'high', budget: '$5-15', description: 'Fridge 37-40°F, Freezer 0°F. Prevents spoilage & foodborne illness.', specs: 'NSF certified, magnetic/hanging', recommendations: ['Taylor Precision ($8)', 'Cooper-Atkins ($12)'], upgradable: false },
  { id: 's7', category: 'storage', name: 'Produce Storage Bags / Containers', icon: '🥬', priority: 'medium', budget: '$15-30', description: 'Extend life of greens, berries, herbs. CO2 permeable / humidity control.', specs: 'Produce-specific (leafy, berries, herbs)', recommendations: ['OXO GreenSaver ($25)', 'VeggieZips ($15)', 'BlueApple ($12)'], upgradable: true },

  // PANTRY ESSENTIALS
  { id: 'p1', category: 'pantry', name: 'Kosher Salt (Diamond Crystal)', icon: '🧂', priority: 'high', budget: '$5', description: 'Standard for cooking. Larger flakes = easier to pinch, less salty by volume.', specs: '3 lb box, no additives', recommendations: ['Diamond Crystal 3lb ($5)'], upgradable: false },
  { id: 'p2', category: 'pantry', name: 'Flaky Finishing Salt (Maldon)', icon: '🧂', priority: 'medium', budget: '$8', description: 'Texture + burst of flavor at the end. Not for cooking.', specs: 'Pyramid flakes, 8.5 oz', recommendations: ['Maldon Sea Salt ($8)'], upgradable: false },
  { id: 'p3', category: 'pantry', name: 'Black Peppercorns (Whole)', icon: '🌶️', priority: 'high', budget: '$8', description: 'Grind fresh. Pre-ground loses aroma in months. Tellicherry = premium.', specs: 'Whole, Tellicherry or Malabar', recommendations: ['Spice House Tellicherry ($10)', 'Simply Organic ($8)'], upgradable: false },
  { id: 'p4', category: 'pantry', name: 'Extra Virgin Olive Oil', icon: '🫒', priority: 'high', budget: '$15-30', description: 'Finishing, dressings, low-heat. Harvest date < 18 months. Dark bottle.', specs: 'Single origin, harvest date, dark glass', recommendations: ['California Olive Ranch ($15)', 'Kirkland Signature ($25)'], upgradable: true },
  { id: 'p5', category: 'pantry', name: 'Neutral High-Heat Oil (Avocado/Grapeseed)', icon: '🫒', priority: 'high', budget: '$10-20', description: 'Searing, frying, roasting > 400°F. Refined = neutral flavor.', specs: 'Refined, 500°F+ smoke point', recommendations: ['Chosen Foods Avocado ($15)', 'La Tourangelle Grapeseed ($12)'], upgradable: true },
  { id: 'p6', category: 'pantry', name: 'Soy Sauce (Tamari/Shoyu)', icon: '🥢', priority: 'high', budget: '$5-10', description: 'Umami, marinades, stir-fries. Tamari = gluten-free.', specs: 'Naturally brewed, no MSG', recommendations: ['Kikkoman ($5)', 'San-J Tamari ($6)'], upgradable: true },
  { id: 'p7', category: 'pantry', name: 'Fish Sauce', icon: '🐟', priority: 'medium', budget: '$5-10', description: 'Southeast Asian umami. Anchovies + salt. Red Boat = gold standard.', specs: 'Anchovy, salt, water only', recommendations: ['Red Boat 40°N ($10)', 'Three Crabs ($6)'], upgradable: true },
  { id: 'p8', category: 'pantry', name: 'Rice Vinegar / Apple Cider Vinegar', icon: '🍎', priority: 'high', budget: '$5-10', description: 'Asian dressings, pickling, marinades. Unfiltered ACV = "mother".', specs: 'Unseasoned rice vinegar; raw ACV', recommendations: ['Marukan Rice ($5)', 'Bragg ACV ($6)'], upgradable: true },
  { id: 'p9', category: 'pantry', name: 'Canned San Marzano Tomatoes', icon: '🍅', priority: 'high', budget: '$4-7', description: 'Best sauce tomatoes. DOP certified = real deal. Whole peeled = versatile.', specs: 'DOP certified, whole peeled, no basil', recommendations: ['Cento DOP ($5)', 'Mutti ($5)', 'La Valle ($6)'], upgradable: false },
  { id: 'p10', category: 'pantry', name: 'Dried Pasta (Bronze-Cut)', icon: '🍝', priority: 'high', budget: '$2-4', description: 'Rough surface holds sauce. Bronze die = texture. De Cecco, Barilla, Rummo.', specs: 'Bronze extruded, slow dried', recommendations: ['De Cecco ($3)', 'Rummo ($4)', 'Barilla ($2)'], upgradable: false },
  { id: 'p11', category: 'pantry', name: 'Dried Beans / Lentils', icon: '🫘', priority: 'high', budget: '$2-4/lb', description: 'Cheaper, better texture than canned. Lentils = no soak, 20 min. Beans = soak 8hr.', specs: 'Black, pinto, chickpea, red lentil', recommendations: ['Rancho Gordo ($6/lb)', 'Bulk bin ($2/lb)'], upgradable: false },
  { id: 'p12', category: 'pantry', name: 'Canned Beans (Emergency)', icon: '🫘', priority: 'high', budget: '$1-2', description: '15-min meals. Rinse to reduce sodium. Keep 6-10 cans variety.', specs: 'No salt added, BPA-free lining', recommendations: ['Eden Organic ($2)', 'Westbrae ($1.50)'], upgradable: false },
  { id: 'p13', category: 'pantry', name: 'Broth / Stock (Low Sodium)', icon: '🍲', priority: 'high', budget: '$3-5', description: 'Base for soups, risotto, pan sauces. Low sodium = control. Better Than Bouillon = concentrate.', specs: 'Low sodium, or paste concentrate', recommendations: ['Better Than Bouillon ($5)', 'Pacific Foods ($4)'], upgradable: true },
  { id: 'p14', category: 'pantry', name: 'Flour (AP + Bread)', icon: '🌾', priority: 'high', budget: '$4-6', description: 'AP for everything; Bread (high protein) for yeast breads. King Arthur = consistent.', specs: 'Unbleached, 11.7% (AP) / 12.7% (Bread)', recommendations: ['King Arthur AP ($5)', 'King Arthur Bread ($5)'], upgradable: false },
  { id: 'p15', category: 'pantry', name: 'Baking Soda + Baking Powder', icon: '🍰', priority: 'high', budget: '$3-5', description: 'Leavening. Powder = double-acting. Replace yearly (test: fizz in hot water).', specs: 'Aluminum-free powder', recommendations: ['Arm & Hammer ($2)', 'Rumford Powder ($3)'], upgradable: false },
  { id: 'p16', category: 'pantry', name: 'Vanilla Extract (Pure)', icon: '🍦', priority: 'high', budget: '$8-15', description: 'Pure = vanilla beans + alcohol. Imitation = synthetic vanillin. Costco = value.', specs: 'Pure, alcohol-based, no corn syrup', recommendations: ['Costco Kirkland 16oz ($15)', 'Nielsen-Massey 8oz ($12)'], upgradable: true },
  { id: 'p17', category: 'pantry', name: 'Honey / Maple Syrup', icon: '🍯', priority: 'medium', budget: '$8-15', description: 'Natural sweeteners. Local honey for allergies. Grade A Dark = robust maple.', specs: 'Raw local honey; Grade A Dark maple', recommendations: ['Local honey ($12)', 'Coombs Maple ($12)'], upgradable: true },
  { id: 'p18', category: 'pantry', name: 'Basic Spices (Cumin, Paprika, Chili, Cinnamon, Oregano, Bay)', icon: '🌿', priority: 'high', budget: '$3-5 each', description: 'Buy whole, grind as needed. Replace yearly. Penzeys, Spice House, bulk bins.', specs: 'Whole preferred, glass jars', recommendations: ['Penzeys ($4)', 'Spice House ($4)', 'Bulk bin ($1-2/oz)'], upgradable: false },
]

// ============================================
// STATE
// ============================================

const activeCategory = ref('knives')
const checked = ref({})
const upgrade = ref({})
const itemNotes = ref({})
const editingNotesId = ref(null)

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      checked.value = data.checked || {}
      upgrade.value = data.upgrade || {}
      itemNotes.value = data.notes || {}
    }
  } catch {}
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    checked: checked.value,
    upgrade: upgrade.value,
    notes: itemNotes.value
  }))
}

function getCategoryItems(catId) {
  return allItems.filter(item => item.category === catId)
}

function getCategoryProgress(catId) {
  const items = getCategoryItems(catId)
  const done = items.filter(i => checked.value[i.id]).length
  return { done, total: items.length }
}

const totalItems = computed(() => allItems.length)
const completedCount = computed(() => Object.values(checked.value).filter(v => v).length)
const overallPercent = computed(() => totalItems.value > 0 ? Math.round((completedCount.value / totalItems.value) * 100) : 0)

function getItem(id) {
  return allItems.find(i => i.id === id)
}

function showNotes(id) {
  editingNotesId.value = id
}

function closeNotes() {
  editingNotesId.value = null
}

function exportChecklist() {
  const date = new Date().toLocaleDateString()
  let text = `KITCHEN ESSENTIALS CHECKLIST - ${date}\n`
  text += `========================================\n\n`
  text += `Overall Progress: ${completedCount.value} / ${totalItems.value} (${overallPercent.value}%)\n\n`
  
  categories.forEach(cat => {
    const items = getCategoryItems(cat.id)
    const prog = getCategoryProgress(cat.id)
    text += `${cat.icon} ${cat.name.toUpperCase()} (${prog.done}/${prog.total})\n`
    text += `----------------------------------------\n`
    items.forEach(item => {
      const status = checked.value[item.id] ? (upgrade.value[item.id] ? '[UPGRADE]' : '[✓]') : '[ ]'
      text += `${status} ${item.icon} ${item.name} — ${item.priority.toUpperCase()} priority ${item.budget ? `(${item.budget})` : ''}\n`
      if (item.description) text += `    ${item.description}\n`
      if (item.recommendations) text += `    Recs: ${item.recommendations.join(', ')}\n`
      const note = itemNotes.value[item.id]
      if (note) text += `    📝 ${note}\n`
    })
    text += `\n`
  })
  
  downloadText(text, `kitchen-checklist-${Date.now()}.txt`)
}

function exportShoppingList() {
  let text = `KITCHEN SHOPPING LIST - ${new Date().toLocaleDateString()}\n`
  text += `========================================\n\n`
  text += `Missing "High Priority" Items:\n`
  text += `----------------------------------------\n`
  
  let hasItems = false
  allItems.filter(i => i.priority === 'high' && !checked.value[i.id]).forEach(item => {
    hasItems = true
    text += `☐ ${item.icon} ${item.name} ${item.budget ? `(${item.budget})` : ''}\n`
    if (item.recommendations) text += `    → ${item.recommendations[0]}\n`
  })
  
  if (!hasItems) text += `(All high-priority items owned!)\n`
  
  text += `\nMissing "Medium Priority" Items:\n`
  text += `----------------------------------------\n`
  allItems.filter(i => i.priority === 'medium' && !checked.value[i.id]).forEach(item => {
    text += `☐ ${item.icon} ${item.name} ${item.budget ? `(${item.budget})` : ''}\n`
  })
  
  downloadText(text, `kitchen-shopping-list-${Date.now()}.txt`)
}

function exportUpgradeList() {
  let text = `KITCHEN UPGRADE LIST - ${new Date().toLocaleDateString()}\n`
  text += `========================================\n\n`
  
  const upgrades = allItems.filter(i => upgrade.value[i.id])
  if (upgrades.length === 0) {
    text += `(No items marked for upgrade)\n`
  } else {
    upgrades.forEach(item => {
      text += `🔧 ${item.icon} ${item.name}\n`
      if (item.recommendations) text += `    Upgrade to: ${item.recommendations.join(' | ')}\n`
      const note = itemNotes.value[item.id]
      if (note) text += `    Note: ${note}\n`
      text += `\n`
    })
  }
  
  downloadText(text, `kitchen-upgrades-${Date.now()}.txt`)
}

function copySummary() {
  const highMissing = allItems.filter(i => i.priority === 'high' && !checked.value[i.id]).length
  const medMissing = allItems.filter(i => i.priority === 'medium' && !checked.value[i.id]).length
  const lowMissing = allItems.filter(i => i.priority === 'low' && !checked.value[i.id]).length
  const upgrades = Object.values(upgrade.value).filter(v => v).length
  
  const summary = `Kitchen Checklist: ${completedCount.value}/${totalItems.value} (${overallPercent.value}%)\nMissing: ${highMissing} High | ${medMissing} Medium | ${lowMissing} Low | ${upgrades} Upgrades`
  navigator.clipboard.writeText(summary)
  alert('Summary copied to clipboard!')
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(loadState)
watch([checked, upgrade, itemNotes], saveState, { deep: true })
</script>

<style scoped>
.kitchen-checklist {
  max-width: 850px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
}

.checklist-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.checklist-header h2 {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  margin-bottom: 0.5rem; font-size: 1.5rem;
}
.checklist-subtitle {
  color: var(--vp-c-text-2); font-size: 0.9rem; margin-bottom: 1rem;
}
.progress-summary { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; }
.progress-bar-container {
  width: 100%; max-width: 400px; height: 10px;
  background: var(--vp-c-bg); border-radius: 5px; overflow: hidden;
}
.progress-bar-fill {
  height: 100%; background: var(--vp-c-brand-1); border-radius: 5px;
  transition: width 0.3s ease;
}
.progress-text { font-size: 0.85rem; color: var(--vp-c-text-2); font-weight: 600; }

.category-tabs {
  display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;
  padding: 0.5rem; background: var(--vp-c-bg); border-radius: 12px;
}
.tab-btn {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; border-radius: 8px;
  border: 1px solid transparent; background: transparent;
  color: var(--vp-c-text-2); font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.tab-btn:hover { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }
.tab-btn.active {
  background: var(--vp-c-brand-1); color: white; border-color: var(--vp-c-brand-1);
}
.tab-btn.active .tab-count { background: rgba(255,255,255,0.2); }
.tab-count {
  font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 10px;
  background: var(--vp-c-bg-soft); font-weight: 600;
}

.category-content { min-height: 300px; }

.checklist-item {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 1rem; padding: 1rem;
  background: var(--vp-c-bg); border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 0.75rem; transition: all 0.2s;
}
.checklist-item:hover { border-color: var(--vp-c-brand-1); }
.checklist-item.priority-high { border-left: 4px solid #e74c3c; }
.checklist-item.priority-medium { border-left: 4px solid #f39c12; }
.checklist-item.priority-low { border-left: 4px solid #3498db; }
.checklist-item.owned { opacity: 0.7; background: var(--vp-c-brand-soft); }
.checklist-item.owned .item-name { text-decoration: line-through; color: var(--vp-c-text-2); }
.checklist-item.upgrade { border-color: #f39c12; background: #fff8e1; }

.checkbox-wrapper { display: flex; align-items: center; cursor: pointer; flex-shrink: 0; }
.checkbox-input { display: none; }
.checkbox-custom {
  width: 22px; height: 22px; border-radius: 6px;
  border: 2px solid var(--vp-c-divider);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.checkbox-input:checked + .checkbox-custom {
  background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1);
}
.checkbox-input:checked + .checkbox-custom::after {
  content: '✓'; color: white; font-size: 0.8rem; font-weight: 700;
}

.item-info { flex: 1; min-width: 0; }
.item-header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
.item-name { font-weight: 600; font-size: 0.95rem; }
.priority-badge {
  font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.4rem;
  border-radius: 4px; text-transform: uppercase;
}
.priority-badge.high { background: #e74c3c; color: white; }
.priority-badge.medium { background: #f39c12; color: white; }
.priority-badge.low { background: #3498db; color: white; }
.budget-badge {
  font-size: 0.65rem; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600;
}
.item-desc { margin: 0.25rem 0 0.5rem; font-size: 0.8rem; color: var(--vp-c-text-2); line-height: 1.4; }
.item-meta { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem; color: var(--vp-c-text-3); }
.specs { font-style: italic; }
.recommendations { display: flex; flex-wrap: wrap; gap: 0.25rem; align-items: center; }
.rec-tag {
  font-size: 0.65rem; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  padding: 0.1rem 0.4rem; border-radius: 4px; color: var(--vp-c-text-2);
}

.item-actions { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; }
.upgrade-toggle {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.7rem; color: var(--vp-c-text-2); cursor: pointer;
}
.upgrade-toggle input { accent-color: #f39c12; }
.notes-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2); cursor: pointer; transition: all 0.2s;
}
.notes-btn:hover { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* Notes Modal */
.notes-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.notes-modal {
  background: var(--vp-c-bg); border-radius: 16px; padding: 1.5rem;
  max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.modal-header h3 { margin: 0; font-size: 1.1rem; }
.close-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.notes-textarea {
  width: 100%; min-height: 150px; padding: 1rem;
  border: 1px solid var(--vp-c-divider); border-radius: 10px;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);
  font-family: inherit; font-size: 0.9rem; line-height: 1.5; resize: vertical;
}
.notes-textarea:focus { outline: none; border-color: var(--vp-c-brand-1); }
.modal-footer { display: flex; justify-content: flex-end; margin-top: 1rem; }
.btn-secondary {
  padding: 0.5rem 1.2rem; border-radius: 8px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1); cursor: pointer;
}
.btn-secondary:hover { border-color: var(--vp-c-brand-1); }

/* Export Section */
.export-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--vp-c-divider); }
.export-section h3 { margin-bottom: 1rem; font-size: 1rem; }
.export-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.export-btn {
  padding: 0.6rem 1.2rem; border-radius: 8px; border: none;
  cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s;
}
.export-btn:not(.secondary) { background: var(--vp-c-brand-1); color: white; }
.export-btn.secondary { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); }
.export-btn:hover:not(.secondary) { transform: translateY(-2px); }
.export-btn.secondary:hover { border-color: var(--vp-c-brand-1); }

.disclaimer {
  margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider);
  text-align: center; font-size: 0.75rem; color: var(--vp-c-text-3); line-height: 1.5;
}

/* Mobile */
@media (max-width: 640px) {
  .kitchen-checklist { padding: 1rem; margin: 1rem; }
  .checklist-item { flex-direction: column; gap: 0.75rem; }
  .item-actions { flex-direction: row; justify-content: space-between; width: 100%; }
  .category-tabs { justify-content: center; }
  .tab-btn .tab-label { display: none; }
  .export-buttons { flex-direction: column; }
  .export-btn { width: 100%; }
}
</style>