/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  CategoryType, 
  Product, 
  CartItem, 
  Order, 
  Customer, 
  DeliveryPartner, 
  UserProfile, 
  OrderStatus,
  MemberRecord,
  TrainerRecord,
  MembershipPlanRecord,
  AnnouncementRecord
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DELIVERY_PARTNER, 
  INITIAL_MEMBER_PROFILE 
} from './data/mockData';
import {
  subscribeMembers,
  subscribeMembershipPlans,
  subscribeTrainers,
  subscribeAnnouncements,
  subscribeProducts,
  subscribeOrders,
  subscribeCustomers,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  registerMemberInFirestore,
  addTrainerToFirestore,
  addAnnouncementToFirestore,
  DEFAULT_MEMBERS,
  DEFAULT_PLANS,
  DEFAULT_TRAINERS,
  DEFAULT_ANNOUNCEMENTS
} from './firebase/dbService';

// Component Imports
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryCards } from './components/CategoryCards';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryView } from './components/OrderHistoryView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { DeliveryDashboard } from './components/DeliveryDashboard';
import { GeneralPortalPage } from './components/GeneralPortalPage';
import { AuthModal } from './components/AuthModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { MembershipPlansSection } from './components/MembershipPlansSection';
import { RegistrationSection } from './components/RegistrationSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { Footer } from './components/Footer';

export default function App() {
  // App-Wide State
  const [currentRole, setCurrentRole] = useState<UserRole>('portal');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // Salem Turmeric
      quantity: 1,
      selectedWeight: '250g',
    },
    {
      product: INITIAL_PRODUCTS[6], // California Almonds
      quantity: 1,
      selectedWeight: '500g',
    },
  ]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartner>(INITIAL_DELIVERY_PARTNER);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_MEMBER_PROFILE);

  // Firestore Real-Time Collections State (Day 3 Backend)
  const [members, setMembers] = useState<MemberRecord[]>(DEFAULT_MEMBERS);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanRecord[]>(DEFAULT_PLANS);
  const [trainers, setTrainers] = useState<TrainerRecord[]>(DEFAULT_TRAINERS);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>(DEFAULT_ANNOUNCEMENTS);
  const [selectedPlanForRegistration, setSelectedPlanForRegistration] = useState<string>('Fresh Care Prime Saver Plan');

  // Navigation & Filtering State
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to Firebase Firestore Real-Time Updates
  useEffect(() => {
    const unsubProducts = subscribeProducts((data) => {
      if (data && data.length > 0) setProducts(data);
    });
    const unsubOrders = subscribeOrders((data) => {
      if (data && data.length > 0) setOrders(data);
    });
    const unsubCustomers = subscribeCustomers((data) => {
      if (data && data.length > 0) setCustomers(data);
    });
    const unsubMembers = subscribeMembers((data) => {
      if (data && data.length > 0) setMembers(data);
    });
    const unsubPlans = subscribeMembershipPlans((data) => {
      if (data && data.length > 0) setMembershipPlans(data);
    });
    const unsubTrainers = subscribeTrainers((data) => {
      if (data && data.length > 0) setTrainers(data);
    });
    const unsubAnnouncements = subscribeAnnouncements((data) => {
      if (data && data.length > 0) setAnnouncements(data);
    });

    return () => {
      if (typeof unsubProducts === 'function') unsubProducts();
      if (typeof unsubOrders === 'function') unsubOrders();
      if (typeof unsubCustomers === 'function') unsubCustomers();
      if (typeof unsubMembers === 'function') unsubMembers();
      if (typeof unsubPlans === 'function') unsubPlans();
      if (typeof unsubTrainers === 'function') unsubTrainers();
      if (typeof unsubAnnouncements === 'function') unsubAnnouncements();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Firestore Add Handlers
  const handleAddMemberToDb = async (newMember: Omit<MemberRecord, 'id'>) => {
    try {
      const res = await registerMemberInFirestore(newMember);
      const generatedId = res.id || `mem-${Date.now()}`;
      setMembers((prev) => [{ ...newMember, id: generatedId }, ...prev]);
      showToast(`Member "${newMember.name}" saved to Firestore database! ✨`);
    } catch (e) {
      setMembers((prev) => [{ ...newMember, id: `mem-${Date.now()}` }, ...prev]);
      showToast(`Member added!`);
    }
  };

  const handleAddTrainerToDb = async (newTrainer: Omit<TrainerRecord, 'id'>) => {
    try {
      const res = await addTrainerToFirestore(newTrainer);
      const generatedId = res.id || `trn-${Date.now()}`;
      setTrainers((prev) => [{ ...newTrainer, id: generatedId }, ...prev]);
      showToast(`Advisor "${newTrainer.trainerName}" added to Firestore! 🥗`);
    } catch (e) {
      setTrainers((prev) => [{ ...newTrainer, id: `trn-${Date.now()}` }, ...prev]);
      showToast('Advisor added!');
    }
  };

  const handleAddAnnouncementToDb = async (newAnnouncement: Omit<AnnouncementRecord, 'id'>) => {
    try {
      const res = await addAnnouncementToFirestore(newAnnouncement);
      const generatedId = res.id || `ann-${Date.now()}`;
      setAnnouncements((prev) => [{ ...newAnnouncement, id: generatedId }, ...prev]);
      showToast('Announcement published to storefront! 📢');
    } catch (e) {
      setAnnouncements((prev) => [{ ...newAnnouncement, id: `ann-${Date.now()}` }, ...prev]);
      showToast('Announcement published!');
    }
  };

  // Cart Operations
  const handleAddToCart = (product: Product, selectedWeight: string, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (it) => it.product.id === product.id && it.selectedWeight === selectedWeight
      );

      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { product, quantity, selectedWeight }];
      }
    });

    showToast(`Added ${product.name} (${selectedWeight}) to cart! 🛒`);
  };

  const handleUpdateCartQuantity = (productId: string, weight: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId && item.selectedWeight === weight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, weight: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((it) => !(it.product.id === productId && it.selectedWeight === weight))
    );
    showToast('Item removed from cart');
  };

  // Reorder items from history
  const handleReorder = (items: CartItem[]) => {
    setCartItems((prev) => [...prev, ...items]);
    setIsCartOpen(true);
    showToast('Previous order items added to cart!');
  };

  // Place new order
  const handleOrderPlaced = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    showToast(`Order #${newOrder.orderNumber} placed & saved to Firestore! 🎉`);
    try {
      await saveOrderToFirestore(newOrder);
    } catch {
      // non-blocking
    }
  };

  // Update order status (Owner / Delivery Partner action)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const now = new Date();
          const timeString = `${now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
          
          return {
            ...o,
            status: newStatus,
            timeline: o.timeline.map((step) =>
              step.status === newStatus ? { ...step, completed: true, time: timeString } : step
            ),
          };
        }
        return o;
      })
    );
    showToast(`Order status updated to: ${newStatus}`);
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
    } catch {
      // non-blocking
    }
  };

  // Product Inventory Management (Owner actions)
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" saved to Firestore catalogue! ✨`);
    try {
      await saveProductToFirestore(newProduct);
    } catch {
      // non-blocking
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Product "${updatedProduct.name}" updated in Firestore!`);
    try {
      await saveProductToFirestore(updatedProduct);
    } catch {
      // non-blocking
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from Firestore inventory');
    try {
      await deleteProductFromFirestore(productId);
    } catch {
      // non-blocking
    }
  };

  // Navigation handlers
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'products') {
      const el = document.getElementById('products-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'plans') {
      const el = document.getElementById('plans-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'trainers') {
      const el = document.getElementById('trainers-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'register') {
      const el = document.getElementById('register-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      const el = document.getElementById('about-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      const el = document.getElementById('contact-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setActiveSection('products');
    const el = document.getElementById('products-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectMembershipPlan = (plan: MembershipPlanRecord) => {
    setSelectedPlanForRegistration(plan.planName);
    const el = document.getElementById('register-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsAuthOpen(true);
    }
    showToast(`Selected "${plan.planName}". Complete registration below! ✨`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <span>🌿</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => {
          if (!userProfile.isLoggedIn) {
            setCurrentRole('portal');
          } else {
            setIsAuthOpen(true);
          }
        }}
        userName={userProfile.name}
        isLoggedIn={userProfile.isLoggedIn}
        onLogout={() => {
          setUserProfile((prev) => ({ ...prev, isLoggedIn: false }));
          setCurrentRole('portal');
          showToast('Logged out successfully. Switched to General Portal.');
        }}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Rendered According to Selected Role */}
      <main className="flex-1">
        {/* ROLE 0: GENERAL PORTAL (CUSTOMER & OWNER LOGIN / REGISTRATION HUB) */}
        {currentRole === 'portal' && (
          <GeneralPortalPage
            onCustomerLogin={(profile) => {
              setUserProfile(profile);
              setCurrentRole('member');
              showToast(`Welcome, ${profile.name}! Logged in successfully. ✨`);
            }}
            onOwnerLogin={(auth) => {
              setCurrentRole('owner');
              showToast(`Owner Admin authenticated! Welcome, ${auth.username}. 🛡️`);
            }}
            onDeliveryLogin={(auth) => {
              setCurrentRole('delivery');
              showToast(`Delivery Partner portal active for ${auth.riderName || 'Rider'}. 🚚`);
            }}
            onGuestExplore={() => {
              setCurrentRole('member');
              setActiveSection('home');
              showToast('Browsing store as guest customer. 🌿');
            }}
            existingCustomers={customers}
            activeTabDefault="customer"
          />
        )}

        {/* ROLE 1: CUSTOMER (MEMBER) STOREFRONT */}
        {currentRole === 'member' && (
          <>
            {activeSection === 'orders' ? (
              <OrderHistoryView
                orders={orders}
                userProfile={userProfile}
                customers={customers}
                onReorder={handleReorder}
                onShopNow={() => handleNavigate('products')}
                onOpenAuth={() => setIsAuthOpen(true)}
                onSelectCustomer={(c) => {
                  setUserProfile(prev => ({
                    ...prev,
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    address: (c as any).address || prev.address,
                    membershipPlan: (c as any).membershipPlan || (c as any).membershipTier === 'Prime' ? 'Fresh Care Prime Saver Plan' : prev.membershipPlan,
                  }));
                }}
              />
            ) : (
              <>
                {/* Live Store Announcements (Firestore Realtime Collection) */}
                <AnnouncementsSection announcements={announcements} />

                {/* Hero Section */}
                <HeroSection
                  onShopNow={() => handleNavigate('products')}
                  onExploreCategories={() => {
                    const el = document.getElementById('categories-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onSelectCategory={handleSelectCategory}
                />

                {/* 4 Core Grocery Categories */}
                <CategoryCards
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                />

                {/* Featured Products Catalogue */}
                <ProductCatalog
                  products={products}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                  onOpenProductDetails={setSelectedProductForDetails}
                />

                {/* Membership & Subscription Plans Section */}
                <MembershipPlansSection
                  plans={membershipPlans}
                  onSelectPlan={handleSelectMembershipPlan}
                />

                {/* Registration & Firestore Database Enrollment Form Section */}
                <RegistrationSection
                  onMemberRegistered={handleAddMemberToDb}
                  onUpdateProfile={setUserProfile}
                  selectedPlanName={selectedPlanForRegistration}
                />

                {/* Story / About Section */}
                <AboutSection />

                {/* Contact & Store Helpline */}
                <ContactSection />
              </>
            )}
          </>
        )}

        {/* ROLE 2: OWNER (ADMIN) DASHBOARD */}
        {currentRole === 'owner' && (
          <OwnerDashboard
            products={products}
            orders={orders}
            customers={customers}
            deliveryPartner={deliveryPartner}
            members={members}
            membershipPlans={membershipPlans}
            trainers={trainers}
            announcements={announcements}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddMember={handleAddMemberToDb}
            onAddTrainer={handleAddTrainerToDb}
            onAddAnnouncement={handleAddAnnouncementToDb}
            onLogoutOwner={() => {
              setCurrentRole('portal');
              showToast('Owner signed out & portal locked. 🔒');
            }}
          />
        )}

        {/* ROLE 3: DELIVERY PARTNER DASHBOARD */}
        {currentRole === 'delivery' && (
          <DeliveryDashboard
            deliveryPartner={deliveryPartner}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onLogoutDelivery={() => {
              setCurrentRole('portal');
              showToast('Delivery Partner signed out. 🚚');
            }}
          />
        )}
      </main>

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onContinueShopping={() => handleNavigate('products')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        defaultCustomer={{
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          address: userProfile.address,
          city: userProfile.city,
          pincode: userProfile.pincode,
        }}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Login / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        onLogout={() => setUserProfile((prev) => ({ ...prev, isLoggedIn: false }))}
        onMemberRegistered={handleAddMemberToDb}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
