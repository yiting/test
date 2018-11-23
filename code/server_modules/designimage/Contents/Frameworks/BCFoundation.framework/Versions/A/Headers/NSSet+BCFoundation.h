//  Created by Pieter Omvlee on 5/30/08.
//  Copyright 2008 Bohemian Coding. All rights reserved.

@interface NSSet<ObjectType> (BCFoundation)

/// The two are considered equivalent if they contain the same number of objects, and every object
/// in array is present in the set. This won't give you strictly the right answer if \c array
/// contains duplicates, so it's the caller's duty to mitigate that.
- (BOOL)isEquivalentToArray_bc:(NSArray<ObjectType> *)array;

- (NSArray *)sortedArrayUsingKey:(NSString *)key;

- (NSSet *)setMinusSet:(NSSet *)otherSet;

/** Returns an array containing the non-nil results of calling the given block with each item in the receiver. I.e. like map, but ommits nil results. */
- (NSSet *)compactMap:(nullable id (^)(ObjectType object))block;

@end

@interface NSMutableSet (BCFoundation)
- (void)addObjectIfNotNil:(id)anObject;
@end
