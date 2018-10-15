//  Created by Pieter Omvlee on 5/30/08.
//  Copyright 2008 Bohemian Coding. All rights reserved.

@interface NSSet (BCFoundation)
- (NSArray *)sortedArrayUsingKey:(NSString *)key;

- (NSSet *)setMinusSet:(NSSet *)otherSet;
@end

@interface NSMutableSet (BCFoundation)
- (void)addObjectIfNotNil:(id)anObject;
@end
