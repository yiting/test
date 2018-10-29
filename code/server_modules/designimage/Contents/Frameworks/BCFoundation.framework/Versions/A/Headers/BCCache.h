//  Created by Drew McCormack on 02/07/15.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

typedef __kindof NSObject * (^BCCacheCreateObjectBlock)(void);

/**
 Caches one object for each owner object. Does not retain the owner, and will automatically clear data associated with an owner that gets deallocated. It does retain the cached objects.
 If you need to store more than one object for a given owner, just put it in an array or similar container.
 
 This class is perfect for caching objects into immutable layers, or the `modelObjectCacheGeneration` property on a layer. When the user drags the layer around the cached object survives.
 */


@interface BCCache : NSObject

@property (nonatomic, readonly) NSUInteger count;
@property (nonatomic, readonly) NSSet *allOwners;

- (__kindof NSObject *)cachedObjectForOwner:(id)owner andKey:(id <NSCopying>)key;
- (void)setCachedObject:(id)obj forOwner:(id)owner andKey:(id <NSCopying>)key;

/**
 Looks for an object, stored in the cache under \c key and owned by \c owner. Where the object does not exist, \c block will be called to create it.
 This method should be used where the code executed in \c block is thread safe.
 
 The method guarantees that another thread calling this method (or cachedObjectForOwner:andKey:) with the same owner and key will block until the
 results from that first thread are available. However, unlike blockingCachedObjectForOwner:andKey:orCreateWithBlock: another thread will not block
 if only the owner is the same.
 */
- (__kindof NSObject *)cachedObjectForOwner:(id)owner andKey:(id<NSCopying>)key orCreateWithBlock:(BCCacheCreateObjectBlock)block;

/**
 Looks for an object, stored in the cache under \c key and owned by \c owner. Where the object does not exist, \c block will be called to create it.
 This method should be used ONLY when the code executed in \c block is NOT thread safe.
 
 Unlike cachedObjectForOwner:andKey:orCreateWithBlock: above, this method will block access from other threads wherever the same owner is used,
 regardless of the key being used. In general, cachedObjectForOwner:andKey:orCreateWithBlock: is preferred over this method.
 */
- (__kindof NSObject *)blockingCachedObjectForOwner:(id)owner andKey:(id<NSCopying>)key orCreateWithBlock:(BCCacheCreateObjectBlock)block;

/**
 Looks for an object, stored in the cache under \c key and owned by \c owner.
 Where the object does not exist, \c block will be called to create it. If we have already started creating the object on another thread or
 if the object already exists in the cache nil will be returned.
 
 This method can be used where you need to ensure that the object is being created, but don't need to do anything with it yet.
 */
- (nullable __kindof NSObject *)populateCacheForObjectWithOwner:(id)owner andKey:(id<NSCopying>)key creationBlock:(BCCacheCreateObjectBlock)block;

- (void)removeCachedObjectForOwner:(id)owner andKey:(id <NSCopying>)key;
- (void)removeCachedObjectsForOwner:(id)owner;
- (void)removeCachedObjectsExceptForOwners:(NSSet *)ownersToKeep;
- (void)removeAllCachedObjects;

@end
