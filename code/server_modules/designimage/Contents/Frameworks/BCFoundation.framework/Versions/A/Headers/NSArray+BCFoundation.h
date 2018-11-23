//  Created by Pieter Omvlee on 31/03/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.

/**
 Signature of simple block for enumerating through objects returning items.
 Used by map:, etc.
 */

typedef CGFloat (^BCSumBlock)(id object);

@interface NSArray<ObjectType> (BCFoundation)

/** Returns all but the last item of the array. */
- (NSArray<ObjectType>*)front;

/** Returns a copy of the array with the head (first element) chopped off */
- (NSArray <ObjectType> *)tail;

/** Returns a copy of the array with the last element chopped off */
- (NSArray <ObjectType> *)arrayByRemovingLastObject;

/** Enumerates each object in the tail with the given block */
- (void)enumerateTailUsingBlock:(void (^)(ObjectType object))block;

/** Returns a reversed copy of the array */
- (NSArray <ObjectType> *)reversedArray;

/** Call a block for every item in the array, returning a new array with the items returned by the block. */
- (NSArray *)map:(nonnull id (^)(__kindof ObjectType object))block;

/** Returns an array containing the non-nil results of calling the given block with each item in the receiver. I.e. like map, but ommits nil results. */
- (NSArray *)compactMap:(nullable id (^)(__kindof ObjectType object))block;

/**  Call a block for every item in the array, passing in the index of each item, and returning a new array with the items returned by the block. */
- (NSArray *)mapWithIndex:(id (^)(ObjectType object, NSUInteger index))block;

/** Returns an array with the concatenated contents of arrays inside the 'arrays' variable.
 */
+ (NSArray *)flattenedArrays:(NSArray<NSArray *> *)arrays;

/** Call a block for every item in the array. */
- (void)enumerate:(void (^)(ObjectType object))block;

/** Call a block for every item in the array, passing in the index of the item. */
- (void)enumerateWithIndex:(void (^)(id ObjectType, NSUInteger index))block;

/** Call a block for every item in the array, returning a new array with the items where the block returned YES. */
- (NSArray <ObjectType> *)filter:(BOOL (^)(ObjectType object))block;

/** Returns YES if there is one object in the array that passes the test. */
- (BOOL)containsObjectPassingTest:(BOOL (^)(ObjectType obj))predicate;

/** Returns the first object passing the test */
- (ObjectType)firstObjectPassingTest:(BOOL (^)(ObjectType obj))predicate;

/** Returns the index of the first object passing the test */
- (NSUInteger)indexOfFirstObjectPassingTest:(BOOL (^)(ObjectType obj))predicate;

/** Call a block for every item in the array, passing in the index, and returning a new array with the items where the block returned YES.*/
- (NSArray <ObjectType> *)filterWithIndex:(BOOL (^)(ObjectType object, NSUInteger index))block;

/** Return a new array containing only the items in this array that are of a given class. */
- (NSArray <ObjectType> *)filteredByObjectsOfClass:(Class)aClass;

- (BOOL)containsObjectOfClass:(Class)aClass;
- (BOOL)containsOnlyObjectsOfClass:(Class)aClass;
- (id)firstObjectOfClass:(Class)aClass;

- (CGFloat)sum:(BCSumBlock)block;
+ (id)arrayWithCapacity:(NSUInteger)count fill:(id (^)(NSUInteger index))block;

- (NSArray <ObjectType> *)arrayByRemovingNull;

- (id)copyDeep;

/** Sorts an array by calling -compare: on each element */
- (NSArray <ObjectType> *)sortedArray;

/** Sorts an array by retrieving the object for the given key on each object and calling -compare: on each element */
- (NSArray <ObjectType> *)sortedArrayUsingKey:(NSString *)key;

/** Sorts an array by retrieving the object for the given key on each object and calling a given action on each element */
- (NSArray <ObjectType> *)sortedArrayUsingKey:(NSString *)key selector:(SEL)action;

- (NSArray <ObjectType> *)shuffledArray;

- (NSArray <ObjectType> *)arrayByRemovingObject:(id)anObject;
- (NSArray <ObjectType> *)arrayByRemovingObjects:(NSArray *)objects;

- (NSArray <ObjectType> *)arrayByAddingObjects:(id)firstObj, ... NS_REQUIRES_NIL_TERMINATION;

- (NSDictionary *)dictionaryByIndexingObjectForKey:(NSString *)aKey;

+ (NSArray <ObjectType> *)arrayByMergingArrays:(NSArray <ObjectType> *)array;

- (BOOL)isValidIndex:(NSUInteger)anIndex;
- (ObjectType)objectAtIndexOrNil:(NSUInteger)index;

- (NSArray <ObjectType> *)subArrayToIndex:(NSUInteger)anIndex;

- (NSArray <ObjectType> *)uniqueObjects;
/*
 * Concerns two-dimensional arrays
 * Flips a two-dimensional array on its side.
 * Visualize this array as a table with the first array as the columns and the arrays it contains as the rows
 * This method turns that around; rows become columns and vice-versa
 * * Note: 2nd dimension arrays don't have to be of the same length
 * * But if so, their column/row index wont the flipped exactly
 */
- (NSArray *)rotateTwoDimensionalArray;

/**
 * Returns the index of the array within the receiver if the array is a continuous subset of the receiver
 * If the array is not a continous subset it returns NSNotFound
 * For example: self = [A,B,C,D,E], array = [B,C]. Return value will be 1
 * For example: self = [A,B,C,D,E], array = [A,C]. Return value will be NSNotFound
 */
- (NSUInteger)indexOfSubArray:(NSArray *)array;

@end

@interface NSMutableArray (BCFoundation)
- (void)addObjectIfNotNil:(id)obj;
- (void)removeFirstObject;

- (void)replaceObject:(id)obj1 withObject:(id)obj2;
@end
