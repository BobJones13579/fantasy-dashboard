# User Experience Design

## 📊 **QUICK SCAN SUMMARY**
- **Mobile-First Design** (responsive, touch-friendly, fast loading)
- **3 Core User Flows** (onboarding, daily use, weekly competition)
- **4 Key Interface Components** (betting cards, token balance, bet history, leaderboard)
- **Color Palette**: Blue (#2a5298), Green (#28a745), Red (#dc3545), Yellow (#ffc107)
- **Performance Targets**: <3s loading, 60fps animations, <100ms interactions
- **Accessibility**: WCAG AA compliance, 44px touch targets, scalable text

## 🎯 **Design Philosophy**

Based on the successful HTML prototype and Fantom Odds analysis, our design philosophy focuses on:
- **Simplicity**: Clear, intuitive interfaces that don't overwhelm users
- **Real-time Feedback**: Immediate responses to user actions
- **Mobile-First**: Optimized for mobile devices where fantasy football is most consumed
- **Engagement**: Features that encourage regular use and league member interaction

## 🏈 **Core User Flows**

### **1. First-Time User Onboarding**
```
Landing Page → League Selection → Account Creation → Tutorial → Dashboard
```

**Key Elements**:
- Welcome message explaining the platform
- League selection (ESPN League TB12)
- Simple account creation process
- Interactive tutorial showing how to place bets
- Introduction to token system and rules

### **2. Daily User Flow**
```
Login → Dashboard → View Odds → Place Bet → Confirm → View Results
```

**Key Elements**:
- Quick access to current odds
- One-click bet placement
- Clear confirmation process
- Immediate feedback on bet status
- Easy access to bet history

### **3. Weekly Competition Flow**
```
View Matchups → Make Picks → Track Progress → View Leaderboard → Celebrate Wins
```

**Key Elements**:
- Clear matchup display
- Simple pick selection
- Real-time progress tracking
- Competitive leaderboards
- Achievement notifications

## 🎨 **Interface Design**

### **1. Header Design**
**Inspired by Fantom Odds**:
- League name prominently displayed ("League TB12")
- Platform branding ("Fantasy Odds" equivalent)
- User token balance (always visible)
- Navigation menu (hamburger on mobile)

**Layout**:
```
[Logo] League TB12 - ESPN    [Token Balance: 1,000] [Menu]
```

### **2. Matchup Cards**
**Design Pattern**:
- Horizontal layout with teams on left/right
- Central "VS" divider
- Odds displayed prominently
- Bet buttons below each team
- Projected scores in center

**Visual Hierarchy**:
1. Team names (largest text)
2. Odds (prominent, color-coded)
3. Records and projected scores (secondary)
4. Bet buttons (clear call-to-action)

### **3. Token Balance Display**
**Always Visible**:
- Top-right corner on desktop
- Sticky header on mobile
- Color-coded based on balance:
  - Green: 500+ tokens
  - Yellow: 100-499 tokens
  - Red: <100 tokens

### **4. Betting Interface**
**Step-by-Step Process**:
1. **Selection**: Click team or market
2. **Amount**: Enter bet amount (with validation)
3. **Confirmation**: Review bet details
4. **Placement**: Confirm and place bet
5. **Feedback**: Immediate confirmation

**Validation**:
- Real-time token balance checking
- Minimum/maximum bet limits
- Clear error messages
- Success confirmations

## 📱 **Mobile-First Design**

### **1. Responsive Layout**
**Breakpoints**:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Mobile Optimizations**:
- Touch-friendly buttons (44px minimum)
- Swipe gestures for navigation
- Thumb-friendly navigation
- Optimized for one-handed use

### **2. Mobile-Specific Features**
- **Pull-to-refresh**: Update odds and data
- **Swipe navigation**: Between different views
- **Haptic feedback**: For bet confirmations
- **Offline mode**: View cached bets and data
- **Push notifications**: For bet settlements and updates

### **3. Performance Considerations**
- **Fast loading**: <3 seconds on 3G
- **Smooth scrolling**: 60fps animations
- **Efficient caching**: Reduce data usage
- **Progressive loading**: Load critical content first

## 🎯 **User Interface Components**

### **1. Betting Cards**
**Design**:
```
┌─────────────────────────────────────┐
│  Drake Maye Start        VS        │
│  9-3 (788.68 pts)                  │
│  [-130]                            │
│  [Bet on Drake Maye Start]         │
│                                   │
│  Projected: 118.5 - 110.51        │
│                                   │
│  Please Swift Man                 │
│  6-6 (694.16 pts)                 │
│  [+77]                            │
│  [Bet on Please Swift Man]        │
└─────────────────────────────────────┘
```

### **2. Token Balance Widget**
**Design**:
```
┌─────────────────┐
│  Your Tokens    │
│     1,000       │
│  Reset: Thu     │
└─────────────────┘
```

### **3. Bet History**
**Design**:
```
┌─────────────────────────────────────┐
│  Recent Bets                        │
│  ─────────────────────────────────  │
│  Drake Maye Start                   │
│  100 tokens @ -130                  │
│  [PENDING]                          │
│  ─────────────────────────────────  │
│  Butter Aubrey                      │
│  50 tokens @ +110                   │
│  [WON +55]                          │
└─────────────────────────────────────┘
```

### **4. Leaderboard**
**Design**:
```
┌─────────────────────────────────────┐
│  Weekly Leaderboard                 │
│  ─────────────────────────────────  │
│  1. 🏆 Drake Maye Start    +200    │
│  2.    Egpuka              +150    │
│  3.    Butter Aubrey       +100    │
│  4.    Pitt Me Out         +50     │
│  5.    Gibbs Hunter        -25     │
└─────────────────────────────────────┘
```

## 🎨 **Visual Design System**

### **1. Color Palette**
**Primary Colors**:
- **Blue**: #2a5298 (League branding)
- **Green**: #28a745 (Positive actions, wins)
- **Red**: #dc3545 (Negative actions, losses)
- **Yellow**: #ffc107 (Warnings, pending)

**Neutral Colors**:
- **Dark Gray**: #333333 (Text)
- **Medium Gray**: #666666 (Secondary text)
- **Light Gray**: #f8f9fa (Backgrounds)
- **White**: #ffffff (Cards, content)

### **2. Typography**
**Font Stack**:
- **Primary**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold, 1.2em line height
- **Body**: Regular, 1.5em line height
- **Small**: 0.875em for secondary information

### **3. Spacing System**
**Consistent Spacing**:
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

### **4. Component Sizing**
**Touch Targets**:
- **Buttons**: Minimum 44px height
- **Input Fields**: 48px height
- **Cards**: 8px border radius
- **Icons**: 24px standard size

## 🔄 **Interaction Patterns**

### **1. Betting Flow**
**Step 1: Selection**
- Click team or market
- Visual feedback (highlight, animation)
- Show odds and potential payout

**Step 2: Amount Entry**
- Number input with validation
- Real-time balance update
- Clear error messages

**Step 3: Confirmation**
- Review bet details
- Show potential payout
- Confirm or cancel

**Step 4: Placement**
- Loading state during processing
- Success confirmation
- Update token balance

### **2. Real-Time Updates**
**Odds Changes**:
- Subtle animation when odds update
- Color coding for increases/decreases
- Timestamp of last update

**Bet Settlements**:
- Notification when bet is settled
- Clear win/loss indication
- Updated token balance

**Game Updates**:
- Live score updates
- Game status changes
- Player performance updates

### **3. Error Handling**
**Validation Errors**:
- Inline error messages
- Clear explanation of issue
- Suggested solutions

**System Errors**:
- Friendly error messages
- Retry options where appropriate
- Fallback to cached data

**Network Issues**:
- Offline indicator
- Queued actions for when online
- Clear status communication

## 📊 **Information Architecture**

### **1. Navigation Structure**
**Primary Navigation**:
- **Dashboard**: Overview of current odds and bets
- **Markets**: All available betting markets
- **Bets**: Personal betting history and active bets
- **Leaderboard**: League standings and competitions
- **Profile**: User settings and statistics

**Secondary Navigation**:
- **Pick Em**: Simple pick-the-winner game
- **Fantom Bank**: Token-based betting system
- **Player Props**: Individual player betting
- **Custom Matchups**: Create custom competitions

### **2. Content Hierarchy**
**Level 1: League Information**
- League name and season
- Current week and standings
- League member list

**Level 2: Market Information**
- Matchup details and odds
- Team records and projections
- Betting options and limits

**Level 3: Personal Information**
- Token balance and history
- Personal betting statistics
- Achievement and progress

### **3. Data Display**
**Critical Information**:
- Token balance (always visible)
- Current odds (prominent display)
- Bet status (clear indicators)

**Secondary Information**:
- Team records and projections
- Historical performance
- League statistics

**Tertiary Information**:
- Detailed statistics
- Historical data
- Advanced analytics

## 🎯 **Accessibility Considerations**

### **1. Visual Accessibility**
- **Color Contrast**: WCAG AA compliance
- **Text Size**: Scalable text up to 200%
- **Color Independence**: Information not conveyed by color alone
- **Focus Indicators**: Clear focus states for keyboard navigation

### **2. Motor Accessibility**
- **Touch Targets**: Minimum 44px for all interactive elements
- **Gesture Alternatives**: Button alternatives for swipe gestures
- **Error Prevention**: Confirmation for destructive actions
- **Time Limits**: No time limits for critical actions

### **3. Cognitive Accessibility**
- **Clear Language**: Simple, jargon-free text
- **Consistent Navigation**: Predictable interface patterns
- **Error Messages**: Clear, helpful error descriptions
- **Progress Indicators**: Show progress for multi-step processes

## 🚀 **Performance Guidelines**

### **1. Loading Performance**
- **First Contentful Paint**: <1.5 seconds
- **Largest Contentful Paint**: <2.5 seconds
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

### **2. Runtime Performance**
- **Smooth Scrolling**: 60fps
- **Responsive Interactions**: <100ms response time
- **Efficient Animations**: Use CSS transforms and opacity
- **Memory Management**: Avoid memory leaks

### **3. Network Performance**
- **Efficient API Calls**: Minimize requests
- **Smart Caching**: Cache frequently accessed data
- **Progressive Loading**: Load critical content first
- **Offline Support**: Basic functionality without network

---

**Next Steps**: Review UX design and make decisions about interface priorities and mobile strategy.
