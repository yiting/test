//  Created by Sam Deane on 26/02/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

/**

 A replacement for NSLocalizedString.
 
 We don't pass a second description parameter, instead the key should be an identifier, corresponding to an entry in <code>Localizable.strings</code>.
 
 This is currently implemented very simply, but there's lots of scope for adding a debug implementation that can do clever things like adding "fake" translations, logging out details of missing keys, etc.
 
 */

NS_ASSUME_NONNULL_BEGIN

extern NSString* BCLocalizedString(NSString* key, NSString* _Nullable comment);

/**
 
 A replacement for NSLocalizedStringFromTable - see NSLocalizedString above for details of the differences between our version and the system one.
 
 */

extern NSString* BCLocalizedStringFromTable(NSString* key, NSString* from);

NS_ASSUME_NONNULL_END
