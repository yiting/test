//  Created by Drew McCormack on 02/07/15.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

typedef id (^BCCacheCreateObjectBlock)(void);

/**
 Caches one object for each owner object. Does not retain the owner, and will automatically clear data associated with an owner that gets deallocated. It does retain the cached objects.
 If you need to store more than one object for a given owner, just put it in an array or similar container.
 
 This class is perfect for caching objects into immutable layers, or the `modelObjectCacheGeneration` property on a layer. When the user drags the layer around the cached object survives.
 */


@interface BCCache : NSObject

@property (nonatomic, readonly) NSUInteger count;
@property (nonatomic, readonly) NSSet *allOwners;

- (id)cachedObjectForOwner:(id)owner andKey:(id <NSCopying>)key;
- (void)setCachedObject:(id)obj forOwner:(id)owner andKey:(id <NSCopying>)key;

- (id)cachedObjectForOwner:(id)owner andKey:(id<NSCopying>)key orCreateWithBlock:(BCCacheCreateObjectBlock)block;

- (void)removeCachedObjectForOwner:(id)owner andKey:(id <NSCopying>)key;
- (void)removeCachedObjectsForOwner:(id)owner;
- (void)removeCachedObjectsExceptForOwners:(NSSet *)ownersToKeep;
- (void)removeAllCachedObjects;

@end
