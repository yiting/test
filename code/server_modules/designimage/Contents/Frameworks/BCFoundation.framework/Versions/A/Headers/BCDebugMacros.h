//  Created by Pieter Omvlee on 23/07/2018. Derived from ECLogging
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#ifndef BC_DEBUG
#ifndef BC_RELEASE
#error You must define either BC_DEBUG or BC_RELEASE
#endif
#endif


#pragma mark - Debug Only Macros

#if BC_DEBUG

#define BCDebugOptionEnabled(key) ([[NSUserDefaults standardUserDefaults] boolForKey:@ #key])

#else

#define BCDebugOptionEnabled(key) NO

#endif
