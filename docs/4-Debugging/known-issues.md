# Known Issues

## TLDR

Tracking of known issues, limitations, and workarounds for the Fantasy Football Companion App.

## Issue Categories

**Auth** - Authentication and authorization issues
**API** - External API integrations and data sources
**Database** - Database operations and data integrity
**Frontend** - User interface and user experience
**Backend** - Backend services and business logic
**RealTime** - Real-time updates and WebSocket connections
**Performance** - Performance issues and limitations
**Mobile** - Mobile devices and responsive design

## Known Issues

### ISS-001: ESPN API Cookie Expiration
**Category**: API | **Severity**: High | **Status**: Known Issue

**Description**: ESPN API cookies expire periodically, causing authentication failures.

**Workaround**: Users can obtain new cookies from ESPN website, clear browser cache and re-authenticate.

**Planned Resolution**: Implement automatic cookie refresh mechanism (Phase 2, Week 6).

### ISS-002: Real-Time Updates on Slow Connections
**Category**: RealTime | **Severity**: Medium | **Status**: Known Issue

**Description**: Real-time updates may be delayed or fail on slow internet connections.

**Workaround**: Refresh the page manually, use the "Refresh" button in the app.

**Planned Resolution**: Implement connection quality detection and fallback to polling (Phase 2, Week 7).

### ISS-003: Mobile Performance on Older Devices
**Category**: Mobile | **Severity**: Medium | **Status**: Known Issue

**Description**: App may perform slowly on older mobile devices during odds updates.

**Workaround**: Close other apps to free up memory, use newer devices when possible.

**Planned Resolution**: Implement performance optimization for older devices (Phase 4, Week 13).

### ISS-004: Database Query Performance
**Category**: Database | **Severity**: Low | **Status**: Known Issue

**Description**: Some database queries may be slow when processing large amounts of historical data.

**Workaround**: Use pagination to limit data displayed, filter data by date range.

**Planned Resolution**: Implement database query optimization and proper indexing (Phase 4, Week 13).

### ISS-005: Browser Compatibility Issues
**Category**: Frontend | **Severity**: Low | **Status**: Known Issue

**Description**: App may not work properly on older browsers or browsers with JavaScript disabled.

**Workaround**: Use modern browsers (Chrome, Firefox, Safari, Edge), enable JavaScript.

**Planned Resolution**: Implement browser compatibility testing and fallback (Phase 4, Week 14).

### ISS-006: Token Balance Synchronization
**Category**: Backend | **Severity**: Medium | **Status**: Known Issue

**Description**: Token balances may not sync immediately across all user sessions during high-traffic periods.

**Workaround**: Refresh the page to get latest balance, wait a few moments for balance to sync.

**Planned Resolution**: Implement real-time balance synchronization (Phase 2, Week 6).

### ISS-007: FAAB Prediction Accuracy
**Category**: API | **Severity**: Low | **Status**: Known Issue

**Description**: FAAB bid predictions may not be 100% accurate due to limited historical data.

**Workaround**: Use predictions as guidance, not absolute truth, consider league-specific factors.

**Planned Resolution**: Improve prediction algorithms and add more historical data sources (Phase 3, Week 11).

### ISS-008: Trade Analysis Data Gaps
**Category**: Database | **Severity**: Low | **Status**: Known Issue

**Description**: Trade analysis may be incomplete for older trades or trades with complex asset structures.

**Workaround**: Focus on recent trades for analysis, manually review complex trades.

**Planned Resolution**: Improve trade data parsing and add support for complex trade structures (Phase 3, Week 10).

### ISS-009: Real-Time Odds Calculation Delays
**Category**: Performance | **Severity**: Medium | **Status**: Known Issue

**Description**: Odds calculations may be delayed during peak usage periods.

**Workaround**: Wait for odds to update, refresh the page for latest odds.

**Planned Resolution**: Implement odds calculation optimization and caching (Phase 4, Week 13).

### ISS-010: Mobile App Installation Issues
**Category**: Mobile | **Severity**: Low | **Status**: Known Issue

**Description**: Some users may experience issues installing the app as a Progressive Web App (PWA).

**Workaround**: Use the app in mobile browser, try different mobile browsers.

**Planned Resolution**: Improve PWA compatibility and add installation guidance (Phase 4, Week 14).

## Issue Statistics

**By Category**: API (2), Database (2), Mobile (2), Backend (1), Frontend (1), RealTime (1), Performance (1)
**By Severity**: High (1), Medium (4), Low (5)
**By Status**: Known Issue (10), In Progress (0), Resolved (0), Closed (0)

## Resolution Timeline

**Phase 1 (Weeks 1-4)**: Token Balance Synchronization, Real-Time Updates on Slow Connections
**Phase 2 (Weeks 5-8)**: ESPN API Cookie Expiration, Mobile Performance on Older Devices
**Phase 3 (Weeks 9-12)**: FAAB Prediction Accuracy, Trade Analysis Data Gaps
**Phase 4 (Weeks 13-16)**: Database Query Performance, Browser Compatibility, Real-Time Odds Calculation Delays, Mobile App Installation Issues
