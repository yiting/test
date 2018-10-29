//  Created by Pieter Omvlee on 26/10/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.

#import "NSArray+BCFoundation.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^BCConcurrentMapCompletionBlock)(NSArray *mappedArray);

@interface NSArray<ObjectType> (ConcurrentMap)
/** A parallel version of the regular \c map: function using NSOperation under the hood to parallelise as best as possible
 @param maxConcurrentCount the number of concurrent operations allowed. For example, for data-bandwidth-heavy operations you can set this to the number of available cores instead of 0, which means unbounded
 @param completionBlock will be called when the concurrent operation is done. The completionBlock will be called on a background queue, make no guarantees which queue it is on
 */
- (void)mapWithMaxConcurrencyCount:(NSInteger)maxConcurrentCount
                        usingBlock:(id (^)(ObjectType object))block
                   completionBlock:(BCConcurrentMapCompletionBlock)completionBlock;

/**
 Loops over the entire array and applies the block on each object in the array.
 The method only returns when all blocks are finished
 The returned integer is a count of all the blocks that returned YES. So 0 = all blocks returned NO (failure)
 */
- (NSUInteger)applyBlockConcurrentlyAndCountSuccess:(BOOL (^)(ObjectType object))block;

@end

NS_ASSUME_NONNULL_END
