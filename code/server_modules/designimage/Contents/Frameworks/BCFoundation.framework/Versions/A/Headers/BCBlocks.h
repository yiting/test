//  Created by Pieter Omvlee on 21-09-09.
//  Copyright 2009 Bohemian Coding. All rights reserved.

// Using block syntax `void (^)()` sucks. The dispatch_block_t is something
// we've used in the past but its about GCD. So now we have our own
typedef void(^BCVoidBlock)(void);

// Like BCVoidBlock, but with an object return value
typedef id (^BCObjectReturnBlock)(void);

@interface NSObject (NSObject_SmallBlocks)
- (void)changeKey:(NSString *)aKey inBlock:(BCVoidBlock)block;
- (void)executeAsBlock;
@end

static inline void BCDispatchGlobal(BCVoidBlock block) {
  dispatch_async(dispatch_get_global_queue(0, 0), block);
}

/** Convenience for \c dispatch_async to the main queue. Note that if a reliably callback time is important, consider using BCDelayBlockOnMain() instead */
static inline void BCDispatchMain(BCVoidBlock block) {
  dispatch_async(dispatch_get_main_queue(), block);
}

/// Convenience for dispatching to the global default priority QoS queue in a dispatch group. If group is nil will do a dispatch_async.
static inline void BCDispatchGlobalInGroup(dispatch_group_t group, BCVoidBlock block) {
  if (group) {
    dispatch_group_async(group, dispatch_get_global_queue(QOS_CLASS_DEFAULT, 0), block);
  } else {
    dispatch_async(dispatch_get_global_queue(QOS_CLASS_DEFAULT, 0), block);
  }
}

/// Convenience for dispatching to the main queue in a dispatch group. If group is nil will do a dispatch_async.
static inline void BCDispatchMainInGroup( dispatch_group_t group, BCVoidBlock block) {
  if (group) {
    dispatch_group_async(group, dispatch_get_main_queue(), block);
  } else {
    dispatch_async(dispatch_get_main_queue(), block);
  }
}

/**
 Convenience for \c CFRunLoopPerformBlock to the main run loop, which is a common way of delaying some work until the next run loop iteration
 
 The difference between this method and the above is the subtle but important.
 When you have a tracking loop running, CFRunLoopPerformBlock gets through much smoother than the dispatch way for example.
 So if you want to send something to the main thread and you dont really care when it gets executed, use the dispatch version.
 
 If a more reliable response time is required use this one since it gets dequeued faster.
 
 In relation to the main event queue or runloop, the above is only partially accurate. The dispatch version does not necessarily
 wait until the next runloop before it is called. If you require a screen drawing refresh before the code in the block is executed
 this function will do what is needed, whilst the dispatch version can execute too soon.
 
 @param runloop the run loop to perform this block on. If nil is supplied we take the main run loop
 @param block the block to perform
 */
static inline void BCRunLoopPerformBlock(CFRunLoopRef runloop, BCVoidBlock block) {
  CFRunLoopPerformBlock(runloop ? runloop : CFRunLoopGetMain(), kCFRunLoopCommonModes, block);
}

static inline void BCDispatchToThread(NSThread *thread, BOOL wait, BCVoidBlock block) {
  [block performSelector:@selector(executeAsBlock) onThread:thread withObject:nil waitUntilDone:wait];
}


@interface NSSet (NSSet_SmallBlocks)
- (void)each:(void (^)(id object))block;
- (instancetype)map:(id (^)(id object))block;
- (BOOL)containsObjectPassingTest:(BOOL (^)(id obj))predicate;
@end

@interface NSMutableArray (NSMutableArray_CHBlocks)
- (void)removeObjectsPassingTest:(BOOL (^)(id obj))predicate;
+ (id)arrayWithCapacity:(NSUInteger)count fill:(id (^)(NSUInteger index))block;
@end

@interface MSRange : NSObject
+ (void)from:(NSUInteger)fromIndex to:(NSUInteger)toIndex do:(void (^)(NSUInteger index))block;
@end

typedef void (^BCTimerBlock)(NSTimer *timer);

@interface NSTimer (NSTimer_Blocks)
+ (NSTimer *)scheduledTimerWithTimeInterval:(NSTimeInterval)interval repeats:(BOOL)repeats block_ch:(BCTimerBlock)block;
@end
