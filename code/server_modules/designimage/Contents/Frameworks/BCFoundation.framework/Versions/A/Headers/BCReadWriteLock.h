//
//  BCReadWriteLock.h
//  BCFoundation
//
//  Created by Gavin on 05/04/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

#import "BCBlocks.h"

/// BCReadWriteLock is a wrapper arround pthread's pthread_rwlock_t
/// providing concurrent read access with single thread write access.
@interface BCReadWriteLock : NSObject

/// Calls block while guaranteeing that no-one else is using another
/// instance of this object to perform a write. Multiple reads can
/// happen concurrently.
- (void)protectedRead:(BCVoidBlock)block;

/// Calls block while guaranteeing that no-one else is using another
/// instance of this object to read or write. Until this method
/// returns, other threads using this instance to read or write
/// will block.
- (void)protectedWrite:(BCVoidBlock)block;

@end
