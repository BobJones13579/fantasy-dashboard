# ESPN Fantasy Football API Authentication Guide

## Overview

Your ESPN Fantasy Football league (ID: 637913) is private, which means you need authentication cookies to access the data through the API.

## Required Cookies

You need two cookies from your ESPN Fantasy Football session:

1. **`espn_s2`** - Your ESPN session cookie
2. **`swid`** - Your ESPN SWID cookie

## How to Get Your Cookies

### Step 1: Access Your League
1. Go to your ESPN Fantasy Football league in your web browser
2. Make sure you're logged in and can see your league data

### Step 2: Open Developer Tools
1. Press `F12` or right-click and select "Inspect"
2. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. In the left sidebar, find **Cookies**
4. Click on the ESPN domain (usually `fantasy.espn.com`)

### Step 3: Find the Required Cookies
Look for these two cookies:
- **`espn_s2`** - Copy the entire value
- **`SWID`** - Copy the entire value (including the curly braces)

### Step 4: Use the Cookies in Your Code

```python
from espn_api.football import League

# Replace with your actual cookie values
espn_s2 = "your_espn_s2_cookie_value_here"
swid = "{your_swid_cookie_value_here}"

league = League(
    league_id=637913,
    year=2025,
    espn_s2=espn_s2,
    swid=swid
)
```

## Security Notes

- **Never commit cookies to version control**
- **Use environment variables or config files**
- **Cookies expire periodically - you may need to refresh them**

## Example Implementation

See `src/config_example.py` for a secure way to handle authentication.
