//  Created by Pieter Omvlee on 18/12/2009.
//  Copyright 2009 Bohemian Coding. All rights reserved.

/**
 Adds some convenience functions which wrap up getting/setting defaults
 values from the standard defaults object.
 */

/// Convenience function returning the standard NSUserDefaults object.
static inline NSUserDefaults * BCDefaults()
{
  return [NSUserDefaults standardUserDefaults];
}

/// Returns the BOOL value for a key in the standard NSUserDefaults object.
static inline BOOL BCDefaultsBoolForKey(NSString *key)
{
  return [BCDefaults() boolForKey:key];
}

/// Returns the integer value for a key in the standard NSUserDefaults object.
static inline NSInteger BCDefaultsIntegerForKey(NSString *key)
{
  return [BCDefaults() integerForKey:key];
}

/// Returns the float value for a key in the standard NSUserDefaults object.
static inline CGFloat BCDefaultsFloatForKey(NSString *key)
{
  return [BCDefaults() doubleForKey:key];
}

/// Returns the value for a key in the standard NSUserDefaults object.
static inline id BCDefaultsValueForKey(NSString *key)
{
  return [BCDefaults() valueForKey:key];
}

/// Returns the string value for a key in the standard NSUserDefaults object.
static inline NSString* BCDefaultsStringForKey(NSString *key)
{
  return [BCDefaults() objectForKey:key];
}

/// Returns the array value for a key in the standard NSUserDefaults object.
static inline NSArray* BCDefaultsArrayForKey(NSString *key)
{
  return [BCDefaults() arrayForKey:key];
}

#pragma mark -

/// Set an integer value for a key on the standard NSUserDefaults object.
static inline void BCDefaultsSetIntegerForKey(NSInteger integer, NSString *key)
{
  [BCDefaults() setInteger:integer forKey:key];
}

/// Set a bool value for a key on the standard NSUserDefaults object.
static inline void BCDefaultsSetBoolForKey(BOOL flag, NSString *key)
{
  [BCDefaults() setBool:flag forKey:key];
}

/// Set a float value for a key on the standard NSUserDefaults object.
static inline void BCDefaultsSetFloatForKey(CGFloat value, NSString *key)
{
  [BCDefaults() setDouble:value forKey:key];
}

/// Set a value for a key on the standard NSUserDefaults object.
static inline void BCDefaultsSetValueForKey(id value, NSString *key)
{
  [BCDefaults() setValue:value forKey:key];
}

/// Toggle the current boolean value for a key on the standard NSUserDefaults object.
static inline void BCDefaultsToggleBoolForKey(NSString *key)
{
  BCDefaultsSetBoolForKey(!BCDefaultsBoolForKey(key), key);
}
