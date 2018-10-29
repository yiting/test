//  Created by Pieter Omvlee on 23/07/2018. Derived from ECLogging
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#if !NS_BLOCK_ASSERTIONS && !defined(__clang_analyzer__) // don't evaluate assertions whilst we're being analyzed as it can confuse clang into thinking that some code paths are normal when actually they aren't

#pragma mark - Assertions Enabled

#define BCAssert(expression) NSAssert((int)(expression) != 0, @"BCAssertion failed for expression: %s", #expression);

#ifdef __OBJC
#define BCAssertC(expression) NSAssertC((int)(expression) != 0, @"BCAssertion failed for expression: %s", #expression);
#else
#define BCAssertC assert
#endif
#else

#pragma mark - Assertions Disabled

#define BCAssert(expression)
#define BCAssertC(expression)

#endif

#pragma mark - Generic Macros

#define BCAssertContainsBase(container, object, imp) imp([(container)containsObject:(object)])
#define BCAssertDoesntContainBase(container, object, imp) imp(![(container)containsObject:(object)])
#define BCAssertShouldntBeHereBase(imp) imp(FALSE)
#define BCAssertSubclassShouldOverrideBase(imp) imp(FALSE)
#define BCAssertNonNilBase(expression, imp) imp((expression) != nil)
#define BCAssertNilBase(expression, imp) imp((expression) == nil)
#define BCAssertIsMainThreadBase(imp) imp(([NSThread isMainThread]))
#define BCAssertFailBase(imp) imp(FALSE)


#define BCAssertContains(container, object) BCAssertContainsBase(container, object, BCAssert)

#define BCAssertDoesntContain(container, object) BCAssertDoesntContainBase(container, object, BCAssert)
#define BCAssertDoesntContainC(container, object) BCAssertDoesntContainBase(container, object, BCAssertC)

#define BCAssertSubclassShouldOverride() BCAssertSubclassShouldOverrideBase(BCAssert)

#define BCAssertShouldntBeHere() BCAssertShouldntBeHereBase(BCAssert)
#define BCAssertShouldntBeHereC() BCAssertShouldntBeHereBase(BCAssertC)

#define BCAssertNonNil(expression) BCAssertNonNilBase(expression, BCAssert)
#define BCAssertNonNilC(expression) BCAssertNonNilBase(expression, BCAssertC)

#define BCAssertNil(expression) BCAssertNilBase(expression, BCAssert)




#define BCAssertIsKindOfClass(o, c) BCAssert(((o) == nil) || [o isKindOfClass:[c class]])
#define BCAssertConformsToProtocol(o, p) BCAssert(((o) == nil) || [o conformsToProtocol:@protocol(p)])

#define BCAssertIsKindOfClassDynamic(o, dc) BCAssert(((o) == nil) || [o isKindOfClass:dc])

#define BCAssertIsMainThread() BCAssertIsMainThreadBase(BCAssert)

#define BCAssertFail()	{ BCAssertFailBase(BCAssert); }

NS_ASSUME_NONNULL_BEGIN

@interface BCAssertion : NSObject

+ (id)assertObject:(id)object isOfClass:(Class)c;

@end

NS_ASSUME_NONNULL_END
