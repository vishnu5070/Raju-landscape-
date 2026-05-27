import React, { useState, useMemo, useEffect } from 'react';
import { PLANTS, Plant } from './data/plants';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Sprout,
  Search,
  Phone,
  MapPin,
  Clock,
  Heart,
  Sun,
  Droplet,
  Check,
  X,
  ArrowRight,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  CheckCircle,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Tag
} from 'lucide-react';

interface Inquiry {
  id: string;
  plantId: string;
  plantName: string;
  customerName: string;
  phone: string;
  quantity: number;
  potting: string;
  potName: string;
  totalEst: string;
  timestamp: string;
}

export default function App() {
  // Navigation & Category states
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Detail Overlay State
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Wishlist & Inquiry active state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('raju_landscape_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem('raju_landscape_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sidebar drawers panel state
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);

  // In-modal Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryQuantity, setInquiryQuantity] = useState(1);
  const [inquiryPotting, setInquiryPotting] = useState('grow-bag');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'success'>('idle');

  // Static contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Keep LocalStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem('raju_landscape_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error("Local storage wishlist save error", e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('raju_landscape_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error("Local storage inquiries save error", e);
    }
  }, [inquiries]);

  // Handle wishlisting
  const toggleWishlist = (plantId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev => 
      prev.includes(plantId) ? prev.filter(id => id !== plantId) : [...prev, plantId]
    );
  };

  // Calculated categories counts
  const categorySummary = useMemo(() => {
    const list = ['All', 'Indoor', 'Outdoor', 'Flowering', 'Decorative', 'Medicinal'];
    const counts: { [key: string]: number } = { All: PLANTS.length };
    PLANTS.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return list.map(cat => ({
      name: cat,
      count: counts[cat] || 0
    }));
  }, []);

  // Filter & Search logic
  const filteredPlants = useMemo(() => {
    return PLANTS.filter(plant => {
      const matchesCategory = activeCategory === 'All' || plant.type === activeCategory;
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = !cleanQuery || 
        plant.name.toLowerCase().includes(cleanQuery) ||
        plant.scientificName.toLowerCase().includes(cleanQuery) ||
        plant.color.toLowerCase().includes(cleanQuery) ||
        plant.type.toLowerCase().includes(cleanQuery) ||
        plant.description.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Showcase plant (Plant of the Month)
  const showcasePlant = useMemo(() => {
    return PLANTS.find(p => p.id === 'juniper-bonsai') || PLANTS[0];
  }, []);

  // Calculate pricing estimates based on potting adjustments
  const currentPottingOption = useMemo(() => {
    switch (inquiryPotting) {
      case 'terracotta':
        return { name: 'Clay Terracotta Pot', price: 120 };
      case 'self-watering':
        return { name: 'Premium Self-Watering Pot', price: 80 };
      default:
        return { name: 'Standard Grow Bag/Eco-Pot', price: 0 };
    }
  }, [inquiryPotting]);

  // Submit modal-based plant inquiry
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlant || !inquiryName.trim() || !inquiryPhone.trim()) return;

    // Construct inquiry object
    const newInquiry: Inquiry = {
      id: "INQ-" + Date.now().toString(36).toUpperCase(),
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      customerName: inquiryName,
      phone: inquiryPhone,
      quantity: inquiryQuantity,
      potting: inquiryPotting,
      potName: currentPottingOption.name,
      totalEst: `${selectedPlant.priceEstimate} + ${currentPottingOption.price > 0 ? `Rs. ${currentPottingOption.price * inquiryQuantity} for pots` : 'Free Bag'}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setInquiries(prev => [newInquiry, ...prev]);
    setInquiryStatus('success');

    // Reset fields except contact standard details for usability
    setTimeout(() => {
      setInquiryStatus('idle');
      setInquiryQuantity(1);
      setInquiryPotting('grow-bag');
      setSelectedPlant(null); // Close modal
    }, 4000);
  };

  // Submit generic footer/contact form queries
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  // Quick reset helper for filter query
  const handleClearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#f9faf8] font-sans text-[#2d3a28] antialiased selection:bg-[#cbd9c3]">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-[#e2e8df] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Brand title */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4a6741] to-[#6d8e63] text-white shadow-md shadow-[#4a6741]/10">
              <Sprout className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2d4a22] sm:text-2xl">
                Raju Landscape
              </span>
              <p className="hidden text-[10px] font-semibold tracking-widest text-[#88a070] uppercase sm:block">
                ESTABLISHED 1995 • BOTANIC NURSERY
              </p>
            </div>
          </div>

          {/* Quick Stats/Links and Wishlist/Inquiry Count */}
          <div className="flex items-center gap-4">
            
            {/* Live stock indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-[#e2e8df] bg-[#eef2eb]/50 px-3 py-1 text-xs font-medium text-[#4a6741] lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#88a070] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4a6741]"></span>
              </span>
              <span>100% Organic Stock Available</span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8df] bg-white text-[#5c6d56] hover:border-[#4a6741] hover:text-[#2d4a22] hover:shadow-xs"
              aria-label="Wishlist"
              id="wishlist-trigger-btn"
            >
              <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Inquiries / Quote list Button */}
            <button
              onClick={() => setIsInquiriesOpen(true)}
              className="relative flex h-10 px-3 items-center gap-2 rounded-full border border-[#e2e8df] bg-white text-[#5c6d56] hover:border-[#4a6741] hover:text-[#2d4a22] hover:shadow-xs text-sm font-medium"
              aria-label="Inquiries"
              id="inquiry-trigger-btn"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">My Catalog Requests</span>
              {inquiries.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4a6741] text-[10px] font-bold text-white">
                  {inquiries.length}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* HERO SECTION / NURSERY INTRODUCTION */}
      <section className="relative overflow-hidden bg-[#eef2eb] text-[#2d3a28] py-16 lg:py-20 border-b border-[#e2e8df]">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(136,160,112,0.15),transparent_50%)]"></div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-[url('https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=40')] bg-cover bg-center"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left side text intro */}
            <div className="space-y-6 lg:col-span-7">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-[#4a6741]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#4a6741] uppercase">
                <Sparkles className="h-3.5 w-3.5 text-[#88a070]" /> Direct Botanical Catalog
              </span>
              
              <h1 className="font-serif text-4xl font-black tracking-tight text-[#1b2b16] sm:text-5xl lg:text-6xl">
                Breathe Life Into Your <span className="text-[#4a6741]">Living Spaces</span>
              </h1>
              
              <p className="max-w-xl text-base text-[#5c6d56] leading-relaxed sm:text-lg">
                Welcome to <strong className="text-[#1b2b16] font-semibold">Raju Landscape</strong>. Located in sprawling, serene soil beds, we raise healthy, premium-fed species custom adapted to survive indoor shade, balcony light, or garden micro-climates. Explore our local catalog to draft your plant order.
              </p>

              {/* High-quality Stats highlights */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#e2e8df] pt-6">
                <div>
                  <p className="font-serif text-2xl font-black text-[#2d4a22] sm:text-3xl">28+</p>
                  <p className="text-xs text-[#5c6d56] font-medium">Years Active Care</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-black text-[#2d4a22] sm:text-3xl">100+</p>
                  <p className="text-xs text-[#5c6d56] font-medium">Plant Varieties</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-black text-[#2d4a22] sm:text-3xl">50k+</p>
                  <p className="text-xs text-[#5c6d56] font-medium">Gardens Nurtured</p>
                </div>
              </div>

              {/* Instant Call to action */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#catalog-section"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a6741] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4a6741]/20 transition hover:bg-[#3d5535]"
                >
                  Explore Plant Catalog
                  <ArrowRight className="h-4 w-4" />
                </a>
                
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-[#e2e8df] bg-white px-5 py-3.5 text-sm font-medium text-[#2d4a22] hover:bg-stone-50 transition"
                >
                  <Phone className="h-4 w-4 text-[#4a6741]" />
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* Right side Spotlight Special Plant of the month card */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-[#e2e8df] bg-white shadow-md p-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <img
                    src={showcasePlant.image}
                    alt={showcasePlant.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition duration-500"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-[#4a6741] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    ⭐ Plant of the Month
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#88a070]">{showcasePlant.scientificName}</span>
                      <h3 className="font-serif text-lg font-bold text-[#1b2b16]">{showcasePlant.name}</h3>
                    </div>
                    <span className="rounded-lg bg-[#eef2eb] px-2.5 py-1 text-xs font-semibold text-[#4a6741]">
                      {showcasePlant.priceEstimate}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#5c6d56]">
                    Aged miniature specimen trained by our head botanist, Raju. Represents tranquility, wisdom, and sculptural art.
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-[#e2e8df] pt-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px] text-[#5c6d56]">
                        <Sun className="h-3 w-3 text-amber-500" /> Bright Indirect
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#5c6d56]">
                        <Droplet className="h-3 w-3 text-sky-500" /> Moderate
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPlant(showcasePlant)}
                      className="text-xs font-bold text-[#4a6741] hover:text-[#2d4a22] flex items-center gap-1"
                    >
                      Inquire Specimen <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEARCH, CATEGORY FILTERS, & DIRECT PLANT CATALOG */}
      <main id="catalog-section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="md:flex md:items-end md:justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#88a070]">Fresh Nursery Harvest</span>
            <h2 className="font-serif text-3xl font-black tracking-tight text-[#2d4a22] sm:text-4xl mt-1">
              Explore Our Digital Plant Catalog
            </h2>
            <p className="mt-2 text-[#5c6d56] text-sm max-w-xl">
              Compare different categories, foliage palettes, sunlight levels, and medical benefits. Click any card to draft a custom nursery pricing request.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-lg bg-[#eef2eb] px-3.5 py-1.5 text-xs font-semibold text-[#4a6741]">
            <span>Showing</span>
            <span className="text-[#2d4a22] bg-white shadow-xs rounded px-1.5 py-0.5 font-bold">
              {filteredPlants.length}
            </span>
            <span>of {PLANTS.length} catalog options</span>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="space-y-6 bg-white border border-[#e2e8df] shadow-xs rounded-2xl p-4 sm:p-6 mb-10">
          
          <div className="grid gap-4 md:grid-cols-12 md:items-center">
            
            {/* Search Input */}
            <div className="relative md:col-span-7">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#a0b099]" />
              <input
                type="text"
                placeholder="Search by flower name, green variegations, therapeutic benefits, or type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#cbd9c3] bg-[#f9faf8] py-3.5 px-12 text-sm text-[#2d3a28] placeholder-[#a0b099] focus:border-[#4a6741] focus:bg-white focus:ring-2 focus:ring-[#eef2eb] outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-4 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 text-xs font-bold"
                  aria-label="Clear Search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Helper Quick filter tips */}
            <div className="md:col-span-5 flex items-center justify-end gap-2 text-xs text-[#5c6d56]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#4a6741]" />
              <span>Tip: Try filtering by </span>
              <button onClick={() => setSearchQuery('Easy')} className="underline text-[#4a6741] font-medium hover:text-[#2d4a22]">"Easy" care</button>
              <span>or</span>
              <button onClick={() => setSearchQuery('Air Puri')} className="underline text-[#4a6741] font-medium hover:text-[#2d4a22]">"Air" filters</button>
            </div>

          </div>

          {/* CATEGORY TABS PILLS */}
          <div className="flex flex-wrap gap-2 border-t border-[#e2e8df] pt-5">
            {categorySummary.map(cat => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition uppercase ${
                  activeCategory === cat.name
                    ? 'bg-[#4a6741] text-white shadow-md shadow-[#4a6741]/20'
                    : 'bg-[#eef2eb]/60 text-[#5c6d56] hover:bg-[#eef2eb] hover:text-[#2d4a22]'
                }`}
              >
                {cat.name === 'All' && <Leaf className="h-3.5 w-3.5" />}
                {cat.name}
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeCategory === cat.name ? 'bg-[#2d4a22] text-[#eef2eb]' : 'bg-[#eef2eb]/90 text-[#4a6741]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* PLANT GRID LAYOUT */}
        {filteredPlants.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="plant-cards-grid">
            {filteredPlants.map((plant, index) => {
              const inWish = wishlist.includes(plant.id);
              return (
                <article
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e2e8df] bg-white shadow-xs transition duration-300 hover:-translate-y-1.5 hover:border-[#4a6741]/40 hover:shadow-lg hover:shadow-[#4a6741]/5 cursor-pointer"
                >
                  
                  {/* Plant Image container with category badge */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Category Type Badge */}
                    <div className="absolute top-3 left-3 rounded-md bg-[#2d4a22]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#eef2eb] uppercase">
                      {plant.type}
                    </div>

                    {/* Wishlist toggle heart */}
                    <button
                      onClick={(e) => toggleWishlist(plant.id, e)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-stone-600 shadow-sm transition hover:scale-110 active:scale-95 text-rose-500"
                      aria-label="Add to favorites"
                    >
                      <Heart className={`h-4.5 w-4.5 transition-colors ${inWish ? 'fill-rose-500 text-rose-500' : 'text-stone-400 hover:text-rose-500'}`} />
                    </button>
                  </div>

                  {/* Card Content details */}
                  <div className="flex flex-1 flex-col p-5">
                    
                    {/* Scientific Label */}
                    <span className="text-[11px] font-semibold italic text-[#4a6741]">
                      {plant.scientificName}
                    </span>

                    {/* Plant Title */}
                    <h3 className="font-serif text-lg font-bold text-[#1b2b16] mt-0.5 group-hover:text-[#2d4a22] transition-colors">
                      {plant.name}
                    </h3>

                    {/* Color display dot and text */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-medium tracking-wide text-stone-400 uppercase">Color:</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e8df] bg-[#f9faf8] px-2 py-0.5 text-xs text-[#5c6d56] font-medium">
                        {/* Interactive matching helper node bullet point */}
                        <span className="h-2.5 w-2.5 rounded-full shadow-inner border border-stone-300 bg-emerald-50" style={{
                          backgroundColor: 
                             plant.color.toLowerCase().includes('pink') ? '#ec4899' :
                             plant.color.toLowerCase().includes('violet') || plant.color.toLowerCase().includes('purple') ? '#8b5cf6' :
                             plant.color.toLowerCase().includes('yellow') || plant.color.toLowerCase().includes('gold') ? '#f59e0b' :
                             plant.color.toLowerCase().includes('scarlet') || plant.color.toLowerCase().includes('red') ? '#ef4444' :
                             plant.color.toLowerCase().includes('pale') ? '#a7f3d0' : '#10b981'
                        }} />
                        {plant.color}
                      </span>
                    </div>

                    {/* Description text */}
                    <p className="mt-3 text-xs text-[#5c6d56] leading-relaxed max-w-sm line-clamp-2">
                      {plant.description}
                    </p>

                    {/* Easy care indicator icon indicators */}
                    <div className="mt-4 flex items-center gap-3 border-t border-[#e2e8df] pt-3.5 text-[11px] text-[#5c6d56] font-medium">
                      <span className="flex items-center gap-1 text-[#5c6d56]">
                        <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{plant.sunlight.split(' ')[0]} Sun</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#5c6d56]">
                        <Droplet className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                        <span>{plant.water.split(' ')[0]}</span>
                      </span>
                      <span className="ml-auto rounded-full bg-[#eef2eb] text-[#4a6741] px-2 py-0.5 text-[10px]">
                        {plant.care} care
                      </span>
                    </div>

                    {/* Order action guide button */}
                    <div className="mt-5 pt-3 border-t border-dashed border-[#e2e8df] flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#2d4a22]">
                        {plant.priceEstimate}
                      </span>
                      <span className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#4a6741] bg-[#eef2eb] hover:bg-[#eef2eb]/90 transition duration-200">
                        Inquire Details
                        <ArrowRight className="h-3 w-3 transition transform group-hover:translate-x-1" />
                      </span>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Catalog Filter State */
          <div className="rounded-2xl border border-dashed border-[#cbd9c3] bg-white p-12 text-center max-w-md mx-auto my-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2eb] text-[#4a6741]">
              <Leaf className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1b2b16] mt-4">No Plants Match Your Choice</h3>
            <p className="mt-2 text-sm text-[#5c6d56]">
              We couldn't search any catalog varieties matching "{searchQuery}".
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-5 rounded-xl bg-[#4a6741] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3d5535] cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* COMPREHENSIVE BOTANICAL CARE KNOWLEDGE BANNER */}
        <section className="mt-20 rounded-3xl bg-gradient-to-br from-[#1b2b16] to-[#2d4a22] text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Leaf className="h-64 w-64" />
          </div>
          <div className="relative max-w-3xl space-y-6">
            <span className="text-xs font-bold tracking-widest text-[#88a070] uppercase">Gardening Wisdom</span>
            <h3 className="font-serif text-2xl font-black tracking-tight sm:text-3xl">
              Unsure which healthy botanics fit your home layouts?
            </h3>
            <p className="text-sm text-[#eef2eb]/95 leading-relaxed">
              Different environments need precise structural soil ratios, light apertures, and seasonal moisture control. You can speak with Raju directly on visiting our nursery grounds. We offer customized residential consultations, grass sod landscape layering, and plant-repotting services.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#a0b099] font-medium pt-4 border-t border-[#4a6741]/40">
              <div className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-[#88a070]" /> Free Eco-Friendly Grow Pots Included
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-[#88a070]" /> Consultation on Soil Preparations
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-[#88a070]" /> Specialized Landscape Planting Guides
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER & NURSERY VISITING / PHYSICAL CONTACT DETAILS */}
      <footer className="border-t border-[#cbd9c3] bg-[#2d4a22] text-[#eef2eb] pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-12 mb-12">
            
            {/* Column 1: Nursery Brief Address details */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4a6741] text-white">
                  <Sprout className="h-5 w-5" />
                </div>
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  Raju Landscape
                </span>
              </div>
              <p className="text-xs text-[#a0b099] leading-relaxed max-w-sm">
                Nurturing beautiful flora, landscaping pathways, and evergreen garden architecture since 1995. Explore healthy varieties directly cultivated in our professional local soil beds.
              </p>

              <div className="space-y-3.5 text-xs text-[#eef2eb]/90 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4.5 w-4.5 text-[#88a070] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Raju Landscape Nursery Grounds</strong><br />
                    Outer Ring Road, Near botanical Garden, Bangalore, Karnataka, India
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#88a070] shrink-0" />
                  <span>Open Daily: 8:00 AM – 7:00 PM (Saturdays & Sundays included)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#88a070] shrink-0" />
                  <span>Phone Calls: +91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick informational menu paths */}
            <div className="sm:grid sm:grid-cols-2 gap-8 lg:col-span-3">
              <div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#88a070] mb-4">Catalog Categories</h4>
                <ul className="space-y-2 text-xs font-medium text-[#add09d]">
                  <li><button onClick={() => { setActiveCategory('Indoor'); }} className="hover:text-white transition cursor-pointer text-left">Indoor Shade Lovers</button></li>
                  <li><button onClick={() => { setActiveCategory('Outdoor'); }} className="hover:text-white transition cursor-pointer text-left">Outdoor Survivors</button></li>
                  <li><button onClick={() => { setActiveCategory('Flowering'); }} className="hover:text-white transition cursor-pointer text-left">Flowering Cascades</button></li>
                  <li><button onClick={() => { setActiveCategory('Medicinal'); }} className="hover:text-white transition cursor-pointer text-left">Medicinal / Herbs</button></li>
                  <li><button onClick={() => { setActiveCategory('Decorative'); }} className="hover:text-white transition cursor-pointer text-left">Decorative Foliage</button></li>
                </ul>
              </div>

              <div className="mt-6 sm:mt-0">
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#88a070] mb-4">Plant Nursery Guides</h4>
                <ul className="space-y-2 text-xs font-medium text-[#add09d]">
                  <li><span className="hover:text-white transition cursor-default">Watering Schedules</span></li>
                  <li><span className="hover:text-white transition cursor-default">Soil Media Selection</span></li>
                  <li><span className="hover:text-white transition cursor-default">Landscape Laying</span></li>
                  <li><span className="hover:text-white transition cursor-default">Bonsai Care Guide</span></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Contact/Message inquiry form directly */}
            <div className="lg:col-span-4 bg-[#1b2b16] p-6 rounded-2xl border border-[#4a6741]">
              <h4 className="font-serif text-sm font-bold text-white">Message Our Team</h4>
              <p className="text-[11px] text-[#a0b099] mt-1 mb-4">Got general questions on pricing estimates or landscaping? Drop us a line.</p>
              
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full rounded-lg border border-[#4a6741] bg-[#2d4a22]/50 text-white placeholder-[#a0b099] text-xs p-2.5 outline-none focus:border-[#88a070] focus:ring-1 focus:ring-[#88a070]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email (Optional)"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#4a6741] bg-[#2d4a22]/50 text-white placeholder-[#a0b099] text-xs p-2.5 outline-none focus:border-[#88a070] focus:ring-1 focus:ring-[#88a070]"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Which plants are you looking to buy or inquire about? Write here..."
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    className="w-full rounded-lg border border-[#4a6741] bg-[#2d4a22]/50 text-white placeholder-[#a0b099] text-xs p-2.5 outline-none focus:border-[#88a070] focus:ring-1 focus:ring-[#88a070] resize-none"
                  ></textarea>
                </div>
                
                {contactSubmitted ? (
                  <div className="flex items-center gap-1.5 text-xs text-[#cbd9c3] font-semibold bg-[#2d4a22] p-2.5 rounded-lg border border-[#4a6741]">
                    <CheckCircle className="h-4 w-4 text-[#88a070] shrink-0" />
                    <span>Inquiry processed! We will contact you shortly.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#4a6741] py-2.5 text-xs font-bold text-white transition hover:bg-[#88a070] cursor-pointer"
                  >
                    Submit Message
                  </button>
                )}
              </form>

            </div>

          </div>

          {/* Trademark text */}
          <div className="border-t border-[#4a6741]/45 pt-8 text-center text-[11px] text-[#a0b099] font-medium">
            <p>© {new Date().getFullYear()} Raju Landscape Nursery. Cultivating botanical serenity with absolute care & pride. All rights reserved.</p>
            <p className="mt-1 text-[#88a070]">Outer Ring Road, Bangalore • Designed for Customer Catalog Explore purposes.</p>
          </div>

        </div>
      </footer>
            {/* DETAIL MODAL / CONSULTATION OVERLAY PANEL */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-6 backdrop-blur-xs"
            onClick={() => setSelectedPlant(null)}
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              
              {/* Close Button top corner */}
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-700 hover:bg-neutral-100 hover:text-neutral-900 shadow-md backdrop-blur-xs transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Column: Visual plant representation */}
              <div className="relative md:col-span-12 lg:col-span-5 h-[240px] lg:h-full bg-[#f9faf8] shrink-0">
                <img
                  src={selectedPlant.image}
                  alt={selectedPlant.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                
                {/* Visual Accent gradient overlay under close path */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>
                
                {/* Scientific metadata */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#cbd9c3]">
                    Scientific Identification
                  </span>
                  <p className="font-serif text-sm italic font-medium">
                    {selectedPlant.scientificName}
                  </p>
                </div>
              </div>

              {/* Right Column: In-depth information details scrollable window */}
              <div className="md:col-span-12 lg:col-span-7 p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Header Information */}
                <div>
                  <span className="inline-flex rounded-md bg-[#eef2eb] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4a6741]">
                    Category: {selectedPlant.type}
                  </span>
                  
                  <h3 className="font-serif text-2xl font-black text-[#1b2b16] mt-1">
                    {selectedPlant.name}
                  </h3>
                  
                  <p className="text-xs text-[#4a6741] font-semibold italic mt-0.5">
                    Traditional Name: {selectedPlant.scientificName} • Color Profile: {selectedPlant.color}
                  </p>
                </div>

                {/* Main Botanical Bio Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#88a070] mb-1.5">Description</h4>
                  <p className="text-xs text-[#5c6d56] leading-relaxed">
                    {selectedPlant.description}
                  </p>
                </div>

                {/* Sunlight, Water & Care Stats Bento grid preview */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#e2e8df] bg-[#f9faf8] p-3 text-center">
                    <Sun className="mx-auto h-5 w-5 text-amber-500 mb-1" />
                    <span className="block text-[10px] font-medium text-stone-450 uppercase">Sunlight</span>
                    <span className="text-xs font-bold text-[#2d3a28] leading-tight block mt-0.5">{selectedPlant.sunlight.split(' ')[0]}</span>
                  </div>

                  <div className="rounded-xl border border-[#e2e8df] bg-[#f9faf8] p-3 text-center">
                    <Droplet className="mx-auto h-5 w-5 text-sky-500 mb-1" />
                    <span className="block text-[10px] font-medium text-stone-450 uppercase">Moisture</span>
                    <span className="text-xs font-bold text-[#2d3a28] leading-tight block mt-0.5">{selectedPlant.water.split(' ')[0]}</span>
                  </div>

                  <div className="rounded-xl border border-[#e2e8df] bg-[#f9faf8] p-3 text-center">
                    <Star className="mx-auto h-5 w-5 text-[#4a6741] mb-1" />
                    <span className="block text-[10px] font-medium text-stone-450 uppercase">Difficulty</span>
                    <span className="text-xs font-bold text-[#2d3a28] leading-tight block mt-0.5">{selectedPlant.care} Care</span>
                  </div>
                </div>

                {/* Botanical Key Benefits checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c6d56] mb-2">Key Benefits</h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {selectedPlant.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-[#5c6d56]">
                        <Check className="h-4 w-4 text-[#4a6741] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimate Cost Guideline box */}
                <div className="flex items-center justify-between rounded-xl bg-[#eef2eb] border border-[#cbd9c3]/50 p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4.5 w-4.5 text-[#4a6741]" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#4a6741] tracking-wider">Estimated Shop Stock price range</span>
                      <p className="text-sm font-extrabold text-[#2d4a22]">{selectedPlant.priceEstimate}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5c6d56] bg-white border border-[#cbd9c3] rounded-md px-2 py-0.5">
                    Incl. grow pots
                  </span>
                </div>

                {/* IN-CATALOG PLANT INQUIRY FORM */}
                <div className="border-t border-[#e2e8df] pt-5">
                  <h4 className="font-serif text-sm font-bold text-[#2d4a22] mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-[#4a6741]" /> Catalog Inquiry / Quote Builder
                  </h4>
                  
                  {inquiryStatus === 'success' ? (
                    <div className="rounded-xl bg-[#eef2eb] border border-[#cbd9c3] p-4 text-center text-xs text-[#2d4a22] font-semibold space-y-1">
                      <CheckCircle className="mx-auto h-8 w-8 text-[#4a6741]" />
                      <p className="font-bold text-sm">Quote registered under active Catalog Requests!</p>
                      <p className="text-[#5c6d56] font-normal">Our team will call to confirm stock availability.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#5c6d56] uppercase mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Vishnu Vardhan"
                            value={inquiryName}
                            onChange={e => setInquiryName(e.target.value)}
                            className="w-full rounded-lg border border-[#cbd9c3] bg-[#f9faf8] text-xs p-2.5 outline-none focus:border-[#4a6741]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#5c6d56] uppercase mb-1">WhatsApp / Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 99000 12345"
                            value={inquiryPhone}
                            onChange={e => setInquiryPhone(e.target.value)}
                            className="w-full rounded-lg border border-[#cbd9c3] bg-[#f9faf8] text-xs p-2.5 outline-none focus:border-[#4a6741]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Potting selections */}
                        <div>
                          <label className="block text-[10px] font-bold text-[#5c6d56] uppercase mb-1">Choose Potting Media</label>
                          <select
                            value={inquiryPotting}
                            onChange={e => setInquiryPotting(e.target.value)}
                            className="w-full rounded-lg border border-[#cbd9c3] bg-[#f9faf8] text-xs p-2.5 outline-none focus:border-[#4a6741]"
                          >
                            <option value="grow-bag">Eco Grow-Bag (Default Store Pot)</option>
                            <option value="terracotta">Clay Terracotta Pot (Slight surcharge Rs. 120)</option>
                            <option value="self-watering">Self-Watering Modern Pot (Slight surcharge Rs. 80)</option>
                          </select>
                        </div>

                        {/* Quantity selection counter */}
                        <div>
                          <label className="block text-[10px] font-bold text-[#5c6d56] uppercase mb-1">Desired Quantity</label>
                          <div className="flex items-center border border-[#cbd9c3] rounded-lg bg-[#f9faf8]">
                            <button
                              type="button"
                              onClick={() => setInquiryQuantity(q => Math.max(1, q - 1))}
                              className="px-3.5 py-1.5 text-stone-500 font-extrabold text-sm hover:text-[#2d4a22]"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-xs font-bold text-[#2d3a28]">{inquiryQuantity}</span>
                            <button
                              type="button"
                              onClick={() => setInquiryQuantity(q => q + 1)}
                              className="px-3.5 py-1.5 text-stone-500 font-extrabold text-sm hover:text-[#2d4a22]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Informational helpful footnote */}
                      <p className="text-[10px] text-stone-400 italic">
                        Estimated Calculation: {plantQuantityEstimation(selectedPlant.priceEstimate, inquiryQuantity)} 
                        {inquiryPotting !== 'grow-bag' && ` + Rs. ${inquiryPotting === 'terracotta' ? 120 * inquiryQuantity : 80 * inquiryQuantity} for pots.`}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(selectedPlant.id)}
                          className={`flex h-11 items-center gap-1.5 rounded-xl border border-[#cbd9c3] px-4 text-xs font-bold transition ${
                            wishlist.includes(selectedPlant.id) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white text-stone-600 hover:bg-[#cbd9c3]/30 hover:text-stone-800'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(selectedPlant.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                          {wishlist.includes(selectedPlant.id) ? 'Wishlisted' : 'Add to Wishlist'}
                        </button>

                        <button
                          type="submit"
                          className="flex-1 rounded-xl bg-[#4a6741] hover:bg-[#3d5535] text-white font-bold py-3 text-xs tracking-wider transition uppercase shadow-md shadow-[#4a6741]/15 cursor-pointer"
                        >
                          Register Catalog Inquiry • Free Call-Back
                        </button>
                      </div>

                    </form>
                  )}
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* DRAWER LAYER 1: FAVORITES WISHLIST SYSTEM SIDEBAR */}
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
            onClick={() => setIsWishlistOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6"
              onClick={e => e.stopPropagation()}
            >
              
              <div className="flex items-center justify-between border-b border-[#cbd9c3]/50 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-serif font-bold text-[#1b2b16] text-lg">My Plant Saved Wishlist</h3>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 px-1.5 rounded-lg border border-[#cbd9c3] text-[#5c6d56] hover:text-[#1b2b16] cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Wishlist plants display list */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {wishlist.length > 0 ? (
                  PLANTS.filter(p => wishlist.includes(p.id)).map(plant => (
                    <div
                      key={plant.id}
                      onClick={() => {
                        setSelectedPlant(plant);
                        setIsWishlistOpen(false);
                      }}
                      className="flex gap-4 p-3 rounded-xl border border-[#cbd9c3]/55 hover:bg-[#eef2eb]/20 cursor-pointer transition relative group"
                    >
                      <img
                        src={plant.image}
                        alt={plant.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 object-cover rounded-lg bg-[#f9faf8] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-[#4a6741] uppercase">{plant.type}</span>
                        <h4 className="text-xs font-bold text-[#1b2b16] truncate">{plant.name}</h4>
                        <p className="text-[10px] italic text-[#5c6d56] truncate">{plant.scientificName}</p>
                        <p className="text-xs text-[#2d4a22] font-semibold mt-1">{plant.priceEstimate}</p>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(plant.id);
                        }}
                        className="self-center p-2 rounded-lg border border-[#cbd9c3]/40 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Remove From Wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <Heart className="h-11 w-11 text-stone-300 mx-auto" />
                    <p className="text-xs text-[#5c6d56]">Your wishlist is currently empty.</p>
                    <p className="text-[11px] text-stone-400">Click the heart icons on plant cards to add items for quick tracking in your catalog visit.</p>
                  </div>
                )}
              </div>

              {/* Empty wishlist bottom CTA */}
              {wishlist.length > 0 && (
                <div className="border-t border-[#cbd9c3]/40 pt-5 mt-4 space-y-3">
                  <p className="text-[11px] text-[#5c6d56] text-center italic">
                    You can show this saved list directly to Raju Landscape personnel over visits for fast stock picking!
                  </p>
                  <button
                    onClick={() => {
                      setIsWishlistOpen(false);
                      const contactHash = document.getElementById('catalog-section');
                      contactHash?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-center rounded-xl bg-[#4a6741] hover:bg-[#3d5535] text-white font-bold py-3 text-xs tracking-wider transition uppercase cursor-pointer"
                  >
                    Explore More Plant Options
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* DRAWER LAYER 2: LOGGED INQUIRIES DRAWER */}
      <AnimatePresence>
        {isInquiriesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
            onClick={() => setIsInquiriesOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6"
              onClick={e => e.stopPropagation()}
            >
              
              <div className="flex items-center justify-between border-b border-[#cbd9c3]/50 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#4a6741]" />
                  <h3 className="font-serif font-bold text-[#1b2b16] text-lg">My Catalog Requests</h3>
                </div>
                <button
                  onClick={() => setIsInquiriesOpen(false)}
                  className="p-1 px-1.5 rounded-lg border border-[#cbd9c3] text-[#5c6d56] hover:text-[#1b2b16] cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Inquiries list index scrollbox */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {inquiries.length > 0 ? (
                  inquiries.map(inq => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border border-[#cbd9c3]/60 bg-[#f9faf8] text-xs space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold text-stone-400 tracking-wider">
                          INQUIRY {inq.id}
                        </span>
                        <span className="text-[10px] text-[#5c6d56] font-medium">{inq.timestamp}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-[#1b2b16] text-sm">{inq.plantName}</h4>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5c6d56] font-medium">
                          <p>Customer: <span className="text-[#1b2b16] font-semibold">{inq.customerName}</span></p>
                          <p>Quantity: <span className="text-[#1b2b16] font-semibold">{inq.quantity}x</span></p>
                          <p>Phone: <span className="text-[#1b2b16] font-semibold">{inq.phone}</span></p>
                          <p>Pot: <span className="text-[#1b2b16] font-semibold">{inq.potName}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-[#cbd9c3]/50 pt-2 pb-0.5">
                        <span className="text-stone-400 font-bold text-[9px] uppercase tracking-wider">Est. Nursery Quote</span>
                        <span className="text-[#2d4a22] font-black text-xs">{inq.totalEst}</span>
                      </div>

                      {/* Remove individual registered query log */}
                      <button
                        onClick={() => {
                          setInquiries(prev => prev.filter(i => i.id !== inq.id));
                        }}
                        className="absolute right-3 top-2 p-1.5 rounded-md hover:bg-neutral-100 hover:text-stone-900 text-stone-400 transition cursor-pointer"
                        title="Delete Inquiry record"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <ShoppingBag className="h-11 w-11 text-stone-300 mx-auto" />
                    <p className="text-xs text-[#5c6d56]">You haven't submitted any catalog requests yet.</p>
                    <p className="text-[11px] text-stone-400">Draft a request directly on any plant's card detail sheet to see estimation details here.</p>
                  </div>
                )}
              </div>

              {/* Inquiry list footnote */}
              {inquiries.length > 0 && (
                <div className="border-t border-[#cbd9c3]/40 pt-4 mt-3 space-y-3.5">
                  <div className="rounded-lg bg-[#eef2eb] border border-[#cbd9c3]/50 p-3 text-[10px] text-[#2d4a22] leading-normal">
                    💡 <strong>Next Step</strong>: Our team contacts customers by call or text to finalize orders. These digital catalog estimations remain stored in your local session index for references.
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all quote history from this session?")) {
                        setInquiries([]);
                      }
                    }}
                    className="w-full text-center hover:bg-stone-50 text-stone-600 font-semibold py-2.5 text-xs rounded-lg transition cursor-pointer"
                  >
                    Clear All Logs
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Utility estimate calculation details helper function
function plantQuantityEstimation(priceEstimate: string, quantity: number): string {
  try {
    const rawNumberArray = priceEstimate.match(/\d+/g);
    if (!rawNumberArray || rawNumberArray.length === 0) return `Rs. ${150 * quantity} (approx)`;
    
    const lowBoundary = parseInt(rawNumberArray[0], 10);
    const highBoundary = rawNumberArray[1] ? parseInt(rawNumberArray[1], 10) : lowBoundary;

    if (lowBoundary === highBoundary) {
      return `Rs. ${lowBoundary * quantity} total`;
    }
    return `Rs. ${lowBoundary * quantity} - ${highBoundary * quantity} total`;
  } catch {
    return `Quantity: ${quantity} plant items`;
  }
}
