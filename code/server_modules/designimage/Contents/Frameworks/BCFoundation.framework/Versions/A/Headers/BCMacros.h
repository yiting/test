//  Created by Pieter Omvlee on 15/01/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

#ifndef __MAC_10_11
#define _Nullable
#endif

#define BCBundleNameKey ((__bridge NSString *const)kCFBundleNameKey)
#define BCBundleIdentifierKey ((__bridge NSString *const)kCFBundleIdentifierKey)
#define BCBundleBuildVersionKey ((__bridge NSString *const)kCFBundleVersionKey)
#define BCBundleUserVisibleVersionKey (@"CFBundleShortVersionString") // no CF constant for this, for some weird reason

