//  Created by Gavin on 27/05/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

/**
 Signature of simple block for enumerating through objects in a dictionary returning a BOOL.
 */
typedef BOOL (^BCMapTableFilterBlock)(id key, id value);

@interface NSMapTable (BCFoundation)

- (void)enumerateKeysAndObjectsUsingBlock:(void (^)(id key, id obj, BOOL *stop))block;
- (void)enumerateKeysUsingBlock:(void (^)(id key, BOOL *stop))block;
- (void)enumerateObjectsUsingBlock:(void (^)(id obj, BOOL *stop))block;
- (id)objectForKeyedSubscript:(id)key;
- (void)setObject:(id)obj forKeyedSubscript:(id)key;

/**
 Call a block for every item in the map table and returns a new map table containing items where the block returned YES.
 */
- (NSMapTable *)filter:(BCMapTableFilterBlock)block;

@end
