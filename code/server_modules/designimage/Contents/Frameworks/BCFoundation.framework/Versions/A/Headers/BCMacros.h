//  Created by Pieter Omvlee on 23/07/2018. Derived from ECLogging
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#ifndef BC_DEBUG
#ifndef BC_RELEASE
#error You must define either BC_DEBUG or BC_RELEASE in the project configuration.
#endif
#endif


#define ECUnused(v) (void)(v)

#if BC_DEBUG

#define BCCastTo(_class_, _expression_) ((_class_*)[BCAssertion assertObject:(_expression_)isOfClass:([_class_ class])])
#define BCSafeCastTo BCCastTo

#else

#define BCCastTo(_class_, _expression_) ((_class_*)(_expression_))
#define BCSafeCastTo(_class_, _expression_) ([_expression_ isKindOfClass:[_class_ class]] ? (_class_*)(_expression_) : nil)

#endif

#define BCBundleNameKey ((__bridge NSString *const)kCFBundleNameKey)
#define BCBundleIdentifierKey ((__bridge NSString *const)kCFBundleIdentifierKey)
#define BCBundleBuildVersionKey ((__bridge NSString *const)kCFBundleVersionKey)
#define BCBundleUserVisibleVersionKey (@"CFBundleShortVersionString") // no CF constant for this, for some weird reason

