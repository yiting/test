//
//  BCObjectPool.h
//  BCFoundation
//
//  Created by Johnnie Walker on 30/06/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

/// BCObjectPool maintains a pool of arbitrary objects created with a common initialiser block.
/// This is used to provide a pool of idential objects to for use in parallel on different threads.
/// Once an object is vended, it is removed from the pool in a thread-safe manner.
/// Clients of the pool's object can return them for other clients to use with the `recycle` method.

extern const NSUInteger BCObjectPoolMaximumPoolCountUnlimited;

@interface BCObjectPool : NSObject

/// The maximum number of objects allowed in the pool. When the number of objects in the pool is
/// equal to this number, recycling additional objects does nothing. If maximumPoolCount is
/// BCObjectPoolMaximumPoolCountUnlimited, there is no limit on the number of objects in the pool.
/// The default value is BCObjectPoolMaximumPoolCountUnlimited
@property (atomic) NSUInteger maximumPoolCount;

/**
 Initializes a new object pool with the given object creator block
 * @param block Block used to create new objects for the pool to vend
 * @return The newly initialized pool object
 */

- (instancetype)initWithObjectCreatorBlock:(id <NSObject> (^)(void))block;

/**
 Vends an object from the pool
 * @return An object from the pool, or a newly created object if the pool is empty
 */

- (id <NSObject>)vendObject;

/**
 Recycles an object by returning it to the pool
 * @discussion Only objects obtained through the `vend` method should be recycled using this method
 * @param object The object to recycle
 */

- (void)recycleObject:(id <NSObject>)object;
@end
