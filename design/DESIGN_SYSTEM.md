# 🎨 QualityMart Design System

## Overview
This design system ensures consistency across both the customer-facing platform and admin portal while maintaining their distinct purposes and audiences.

---

## 🌈 **COLOR PALETTE**

### **Customer Platform Colors**
```css
/* Primary Brand Colors */
--primary-blue: #0066FF;      /* Navigation, CTAs, Links */
--success-green: #00D26A;     /* Quality badges, Buy buttons */
--quality-gold: #FFD700;      /* Premium A++ highlights */

/* Background & Neutrals */
--background-white: #FFFFFF;   /* Main background */
--light-gray: #F5F5F5;        /* Cards, sections */
--medium-gray: #E5E5E5;       /* Borders, dividers */
--text-dark: #1A1A1A;         /* Primary text */
--text-medium: #4A4A4A;       /* Secondary text */
--text-light: #757575;        /* Captions, metadata */

/* Status & Feedback */
--success: #10B981;           /* Success messages */
--warning: #F59E0B;           /* Warnings, alerts */
--error: #EF4444;             /* Error messages */
--info: #3B82F6;              /* Information */
```

### **Admin Portal Colors**
```css
/* Professional Admin Colors */
--admin-navy: #1E3A8A;        /* Primary navigation, headers */
--admin-slate: #475569;       /* Secondary elements, panels */
--admin-dark: #0F172A;        /* Dark sections, emphasis */

/* Admin Backgrounds */
--admin-bg-light: #F8FAFC;    /* Light background */
--admin-bg-medium: #E2E8F0;   /* Card backgrounds */
--admin-bg-dark: #334155;     /* Dark cards */

/* Admin Status Colors */
--admin-success: #10B981;     /* Approvals, positive metrics */
--admin-warning: #F59E0B;     /* Pending items, alerts */
--admin-danger: #EF4444;      /* Rejections, critical issues */
--admin-info: #06B6D4;        /* Information, analytics */
```

### **Quality Badge Colors**
```css
/* Quality Grade System */
--grade-aplus-plus: #FFD700;  /* A++ - Gold */
--grade-aplus: #C0C0C0;       /* A+ - Silver */
--grade-bplus-plus: #CD7F32;  /* B++ - Bronze */
--grade-bplus: #4CAF50;       /* B+ - Green */
--grade-insufficient: #F44336; /* Below B+ - Red */
```

---

## ✍️ **TYPOGRAPHY SYSTEM**

### **Font Family**
```css
/* Primary Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Fallback for older browsers */
font-family: Arial, Helvetica, sans-serif;
```

### **Customer Platform Typography**
```css
/* Headers */
.heading-xl { font-size: 32px; font-weight: 700; line-height: 1.2; }  /* Hero titles */
.heading-lg { font-size: 28px; font-weight: 600; line-height: 1.3; }  /* Page titles */
.heading-md { font-size: 24px; font-weight: 600; line-height: 1.3; }  /* Section titles */
.heading-sm { font-size: 20px; font-weight: 500; line-height: 1.4; }  /* Subsections */

/* Body Text */
.body-lg { font-size: 18px; font-weight: 400; line-height: 1.6; }     /* Large body */
.body-md { font-size: 16px; font-weight: 400; line-height: 1.5; }     /* Standard body */
.body-sm { font-size: 14px; font-weight: 400; line-height: 1.4; }     /* Small text */

/* UI Elements */
.button-text { font-size: 16px; font-weight: 500; }                   /* Buttons */
.caption { font-size: 12px; font-weight: 400; color: var(--text-light); } /* Captions */
.label { font-size: 14px; font-weight: 500; }                        /* Form labels */
```

### **Admin Portal Typography**
```css
/* Admin Headers */
.admin-heading-xl { font-size: 28px; font-weight: 700; line-height: 1.2; }
.admin-heading-lg { font-size: 24px; font-weight: 600; line-height: 1.3; }
.admin-heading-md { font-size: 20px; font-weight: 600; line-height: 1.3; }
.admin-heading-sm { font-size: 18px; font-weight: 500; line-height: 1.4; }

/* Admin Body */
.admin-body { font-size: 14px; font-weight: 400; line-height: 1.5; }
.admin-small { font-size: 12px; font-weight: 400; line-height: 1.4; }

/* Data Display */
.admin-data { font-size: 14px; font-weight: 400; font-family: 'SF Mono', monospace; }
.admin-metric { font-size: 24px; font-weight: 600; }
```

---

## 🧩 **COMPONENT SYSTEM**

### **Quality Badges**
```css
.quality-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.quality-badge--aplus-plus {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1A1A1A;
}

.quality-badge--aplus {
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
  color: #1A1A1A;
}

.quality-badge--bplus-plus {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
  color: #FFFFFF;
}

.quality-badge--bplus {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: #FFFFFF;
}
```

### **Buttons**
```css
/* Primary Button (Customer) */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #0052CC;
  transform: translateY(-1px);
}

/* Success Button (Buy Now) */
.btn-success {
  background: var(--success-green);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
}

/* Admin Button */
.btn-admin {
  background: var(--admin-navy);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}
```

### **Cards**
```css
/* Customer Product Card */
.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

/* Admin Dashboard Card */
.admin-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### **Chat Interface**
```css
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 1000;
}

.chat-header {
  background: var(--primary-blue);
  color: white;
  padding: 16px;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: between;
}

.chat-message {
  padding: 8px 12px;
  margin: 8px;
  border-radius: 16px;
  max-width: 80%;
}

.chat-message--bot {
  background: #F3F4F6;
  color: #1F2937;
  align-self: flex-start;
}

.chat-message--user {
  background: var(--primary-blue);
  color: white;
  align-self: flex-end;
  margin-left: auto;
}
```

---

## 📱 **RESPONSIVE BREAKPOINTS**

```css
/* Mobile First Approach */
/* Extra Small devices (phones, less than 576px) */
@media (max-width: 575.98px) { 
  .container { padding: 16px; }
  .heading-xl { font-size: 24px; }
}

/* Small devices (phones, 576px and up) */
@media (min-width: 576px) { 
  .container { padding: 20px; }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { 
  .container { padding: 32px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { 
  .container { padding: 40px; }
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { 
  .container { max-width: 1200px; margin: 0 auto; }
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## 🎯 **SPACING SYSTEM**

```css
/* Consistent spacing scale */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* Usage examples */
.card-padding { padding: var(--space-lg); }
.button-margin { margin: var(--space-md); }
.section-gap { margin-bottom: var(--space-2xl); }
```

---

## 🖼️ **ICONOGRAPHY**

### **Quality Icons**
- **A++ Grade**: 🏆 (Trophy) + Gold gradient
- **A+ Grade**: ⭐ (Star) + Silver outline  
- **B++ Grade**: ✅ (Check mark) + Bronze color
- **B+ Grade**: 👍 (Thumbs up) + Green color

### **UI Icons**
- **Search**: 🔍
- **Cart**: 🛒
- **User**: 👤
- **Chat**: 💬
- **Support**: 🎧
- **Quality**: 🏆
- **Warning**: ⚠️
- **Success**: ✅
- **Error**: ❌

### **Admin Icons**
- **Dashboard**: 📊
- **Products**: 📦
- **Orders**: 📋
- **Vendors**: 🤝
- **Analytics**: 📈
- **Settings**: ⚙️

---

## 🎨 **DESIGN PRINCIPLES**

### **Customer Platform Principles**
1. **Clarity**: Clear visual hierarchy, easy to scan
2. **Trust**: Professional appearance, quality emphasis
3. **Accessibility**: High contrast, readable fonts
4. **Simplicity**: No technical complexity visible
5. **Quality-First**: Quality badges prominent everywhere

### **Admin Portal Principles**
1. **Efficiency**: Dense information, quick actions
2. **Power**: Comprehensive tools and controls
3. **Data-Driven**: Charts, metrics, analytics focus
4. **Professional**: Serious, business-focused design
5. **Workflow-Oriented**: Task-based interface design

---

## 🎯 **USAGE GUIDELINES**

### **Quality Badge Usage**
- Always use appropriate grade colors
- Include quality score when possible
- Make badges interactive (clickable for info)
- Consistent size and positioning
- Never fake or mislead with badges

### **Chat Interface Guidelines**  
- Always accessible via floating widget
- Maintain brand colors in chat
- Quick response indicators
- Clear bot vs human identification
- Quality-specific quick actions

### **Admin Interface Guidelines**
- Prioritize actionable information
- Use status colors consistently
- Make critical actions prominent
- Group related functions together
- Provide clear feedback on actions

---

## 📏 **COMPONENT SPECIFICATIONS**

### **Quality Badge Dimensions**
```css
.quality-badge {
  height: 24px;
  min-width: 40px;
  padding: 0 8px;
  font-size: 12px;
}

.quality-badge--large {
  height: 32px;
  min-width: 50px;
  padding: 0 12px;
  font-size: 14px;
}
```

### **Button Specifications**
```css
.btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  min-width: 80px;
}

.btn--large {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  min-width: 120px;
}
```

---

## 🔧 **IMPLEMENTATION NOTES**

### **CSS Custom Properties**
All colors, spacing, and sizes should use CSS custom properties for easy theming and maintenance.

### **Component Library**
Build reusable components for:
- Quality badges
- Product cards  
- Chat interface
- Admin tables
- Status indicators

### **Accessibility Requirements**
- Minimum 4.5:1 color contrast ratio
- Focus indicators for all interactive elements
- Screen reader friendly markup
- Keyboard navigation support

This design system ensures consistency while serving the distinct needs of customers (simplicity, trust) and administrators (power, efficiency).