import React, { useState } from 'react';
import { Product, SupermarketId } from '../types';
import { SUPERMARKETS } from '../data/mockData';

interface AdminDashboardModalProps {
  products: Product[];
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
  onAddNewProduct: (product: Product) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  products,
  onClose,
  onUpdateProduct,
  onAddNewProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'quality' | 'add'>('catalog');
  const [saveToast, setSaveToast] = useState(false);

  // New product draft state
  const [newProductName, setNewProductName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('Pantry & Sauces');
  const [newPackSize, setNewPackSize] = useState('500ml');
  const [newIngredients, setNewIngredients] = useState('Water, Soybeans, Salt');
  const [newAllergens, setNewAllergens] = useState('Soy');
  const [newSodium, setNewSodium] = useState(450);
  const [newPriceFairprice, setNewPriceFairprice] = useState(5.20);

  const handleSaveProductEdit = () => {
    onUpdateProduct(selectedProduct);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: Product = {
      id: `prod-custom-${Date.now().toString().slice(-4)}`,
      name: newProductName,
      brand: newBrand || 'Nourish Verified',
      packSize: newPackSize,
      category: newCategory,
      image: '/src/assets/images/ginger_scallion_chicken_1792052788024.jpg',
      description: 'Newly registered and verified ingredient in NourishMe Singapore multi-supermarket catalog.',
      ingredientsList: newIngredients.split(',').map((s) => s.trim()),
      declaredAllergens: newAllergens.split(',').map((s) => s.trim()).filter(Boolean),
      precautionaryStatements: [],
      nutritionFacts: {
        servingSize: '15g',
        calories: 25,
        proteinG: 2.0,
        totalCarbG: 2.0,
        sugarsG: 0.5,
        sodiumMg: newSodium,
        glycemicIndex: 'Low',
      },
      healthBadges: ['Admin Verified'],
      retailers: [
        {
          supermarketId: 'fairprice',
          priceSgd: newPriceFairprice,
          unitPrice: `$${(newPriceFairprice / 5).toFixed(2)} / 100g`,
          inStock: true,
          stockLevel: 'In Stock',
          lastUpdated: 'Just now',
        },
      ],
      dataQuality: {
        isVerified: true,
        verifiedBy: 'NourishMe Catalog Admin',
        lastAudited: new Date().toISOString().split('T')[0],
      },
    };

    onAddNewProduct(newProd);
    setSelectedProduct(newProd);
    setActiveTab('catalog');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const unverifiedCount = products.filter((p) => !p.dataQuality?.isVerified).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2eae2] my-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#edf6ee] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#164530] text-[#bceed0] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#151d19]">
                Supermarket Catalog & Quality Administration
              </h2>
              <p className="text-xs text-[#556057]">
                Manage multi-retailer inventory, declared allergens, and nutrition panel audit trails
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414943] hover:bg-[#edf6ee] cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Toast */}
        {saveToast && (
          <div className="bg-[#bceed0] text-[#003920] px-6 py-2 text-xs font-bold text-center border-b border-[#8ed7ac]">
            Catalog database updated successfully!
          </div>
        )}

        {/* Tab switcher */}
        <div className="px-6 pt-4 flex gap-2 border-b border-[#edf6ee]">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-[#164530] text-[#164530]'
                : 'border-transparent text-[#717973] hover:text-[#151d19]'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quality'
                ? 'border-[#164530] text-[#164530]'
                : 'border-transparent text-[#717973] hover:text-[#151d19]'
            }`}
          >
            <span>Data Quality Audits</span>
            {unverifiedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#ffeed6] text-[#683b00] text-[10px]">
                {unverifiedCount} Unverified
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'border-[#164530] text-[#164530]'
                : 'border-transparent text-[#717973] hover:text-[#151d19]'
            }`}
          >
            + Add New Ingredient
          </button>
        </div>

        {/* Tab 1: Product Catalog Editor */}
        {activeTab === 'catalog' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left list (4 cols) */}
            <div className="md:col-span-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {products.map((p) => {
                const isSelected = selectedProduct.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#164530] bg-[#edf6ee]/70 ring-1 ring-[#164530]'
                        : 'border-[#e2eae2] bg-[#f8fbf8] hover:bg-[#edf6ee]'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover bg-white shrink-0 border border-[#dce5dd]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#151d19] truncate block">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-[#556057]">
                        {p.brand} · {p.retailers.length} Stores
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Editor Form (8 cols) */}
            <div className="md:col-span-8 bg-[#f8fbf8] p-5 rounded-3xl border border-[#e2eae2] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#164530] uppercase tracking-wider">
                    Editing Product: {selectedProduct.id}
                  </span>
                  <h3 className="text-sm font-bold text-[#151d19]">{selectedProduct.name}</h3>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    selectedProduct.dataQuality?.isVerified
                      ? 'bg-[#bceed0] text-[#003920]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {selectedProduct.dataQuality?.isVerified ? 'Lab Verified' : 'Incomplete Panel'}
                </span>
              </div>

              {/* Editable Name & Brand */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-[#151d19] block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#151d19] block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={selectedProduct.brand}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, brand: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs"
                  />
                </div>
              </div>

              {/* Editable Nutritional Values */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-[#151d19] block mb-1">Sodium (mg)</label>
                  <input
                    type="number"
                    value={selectedProduct.nutritionFacts.sodiumMg}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        nutritionFacts: {
                          ...selectedProduct.nutritionFacts,
                          sodiumMg: parseInt(e.target.value, 10) || 0,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs font-mono-data"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#151d19] block mb-1">Sugars (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedProduct.nutritionFacts.sugarsG}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        nutritionFacts: {
                          ...selectedProduct.nutritionFacts,
                          sugarsG: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs font-mono-data"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#151d19] block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedProduct.nutritionFacts.proteinG}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        nutritionFacts: {
                          ...selectedProduct.nutritionFacts,
                          proteinG: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs font-mono-data"
                  />
                </div>
              </div>

              {/* Declared Allergens Editor */}
              <div className="text-xs">
                <label className="font-bold text-[#151d19] block mb-1">
                  Declared Allergens (comma separated)
                </label>
                <input
                  type="text"
                  value={selectedProduct.declaredAllergens.join(', ')}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      declaredAllergens: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs"
                />
              </div>

              {/* Retailer Prices Editor */}
              <div className="text-xs space-y-2">
                <label className="font-bold text-[#151d19] block">
                  Supermarket Prices (SGD) & In-Stock Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.retailers.map((ret, idx) => {
                    const superm = SUPERMARKETS.find((s) => s.id === ret.supermarketId);
                    return (
                      <div key={ret.supermarketId} className="p-2.5 rounded-xl bg-white border border-[#dce5dd] flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#151d19] truncate">{superm?.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span>$</span>
                          <input
                            type="number"
                            step="0.05"
                            value={ret.priceSgd}
                            onChange={(e) => {
                              const updatedRetailers = [...selectedProduct.retailers];
                              updatedRetailers[idx] = {
                                ...ret,
                                priceSgd: parseFloat(e.target.value) || 0,
                              };
                              setSelectedProduct({
                                ...selectedProduct,
                                retailers: updatedRetailers,
                              });
                            }}
                            className="w-16 p-1 border border-[#dce5dd] rounded font-mono-data text-xs text-right"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save product button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProductEdit}
                  className="px-6 py-2.5 rounded-full bg-[#164530] hover:bg-[#2f5d46] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Data Quality & Missing Information Audits */}
        {activeTab === 'quality' && (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-[#edf6ee] border border-[#bceed0] text-xs text-[#2f5d46]">
              <h4 className="font-bold text-[#151d19] mb-1">Safety & Data Integrity Protocol</h4>
              <p>
                Products without complete allergen declarations or manufacturer nutritional laboratory certifications are automatically flagged with <strong>⚪ Insufficient Information</strong> to protect vulnerable elderly and allergic users.
              </p>
            </div>

            <div className="space-y-3">
              {products.map((p) => {
                const isVerified = p.dataQuality?.isVerified;
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-[#e2eae2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] mt-0.5 ${
                          isVerified ? 'text-[#164530]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {isVerified ? 'verified' : 'warning'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#151d19]">{p.name}</span>
                          <span className="text-[10px] text-[#556057]">({p.brand})</span>
                        </div>
                        <p className="text-[11px] text-[#556057]">
                          Auditor: {p.dataQuality?.verifiedBy} · Last checked: {p.dataQuality?.lastAudited}
                        </p>
                        {p.dataQuality?.missingFields && (
                          <div className="mt-1 flex gap-1">
                            {p.dataQuality.missingFields.map((f, i) => (
                              <span key={i} className="px-2 py-0.2 rounded bg-[#ffdad6] text-[#93000a] text-[9px] font-bold">
                                Missing: {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated: Product = {
                          ...p,
                          dataQuality: {
                            isVerified: !isVerified,
                            verifiedBy: 'NourishMe Lead Clinical Dietitian',
                            lastAudited: new Date().toISOString().split('T')[0],
                            missingFields: isVerified ? ['Manual Re-Audit Triggered'] : [],
                          },
                        };
                        onUpdateProduct(updated);
                        setSaveToast(true);
                        setTimeout(() => setSaveToast(false), 1500);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isVerified
                          ? 'bg-[#edf6ee] text-[#414943] hover:bg-[#ffdad6] hover:text-[#93000a]'
                          : 'bg-[#164530] text-white hover:bg-[#2f5d46]'
                      }`}
                    >
                      {isVerified ? 'Revoke Certification' : 'Mark as Lab Verified'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Add New Ingredient */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateProduct} className="p-6 max-w-2xl mx-auto space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#151d19]">Register New Supermarket Ingredient</h3>

            <div>
              <label className="font-bold text-[#151d19] block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="e.g. San-J Organic Reduced Sodium Tamari"
                className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[#151d19] block mb-1">Brand</label>
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="e.g. San-J"
                  className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-[#151d19] block mb-1">Pack Size</label>
                <input
                  type="text"
                  value={newPackSize}
                  onChange={(e) => setNewPackSize(e.target.value)}
                  placeholder="e.g. 500ml / 400g"
                  className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-[#151d19] block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#dce5dd] bg-white text-xs"
                >
                  <option value="Pantry & Sauces">Pantry & Sauces</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Proteins & Seafood">Proteins & Seafood</option>
                  <option value="Dairy & Plant Mylks">Dairy & Plant Mylks</option>
                  <option value="Grains & Bakery">Grains & Bakery</option>
                  <option value="Snacks & Beverages">Snacks & Beverages</option>
                  <option value="Elderly & Special Care">Elderly & Special Care</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#151d19] block mb-1">
                Full Ingredients List (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={newIngredients}
                onChange={(e) => setNewIngredients(e.target.value)}
                placeholder="e.g. Water, Organic Soybeans, Sea Salt"
                className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#151d19] block mb-1">Declared Allergens</label>
                <input
                  type="text"
                  value={newAllergens}
                  onChange={(e) => setNewAllergens(e.target.value)}
                  placeholder="e.g. Soy"
                  className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-[#151d19] block mb-1">Sodium (mg per serving)</label>
                <input
                  type="number"
                  value={newSodium}
                  onChange={(e) => setNewSodium(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs font-mono-data"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#151d19] block mb-1">
                Initial Price at FairPrice (SGD)
              </label>
              <input
                type="number"
                step="0.05"
                value={newPriceFairprice}
                onChange={(e) => setNewPriceFairprice(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-[#dce5dd] text-xs font-mono-data"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#164530] text-white font-bold cursor-pointer hover:bg-[#2f5d46]"
              >
                Create & Publish to Marketplace
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
