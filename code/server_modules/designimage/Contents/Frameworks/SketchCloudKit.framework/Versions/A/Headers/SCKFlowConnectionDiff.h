//  Created by Robin Speijer on 16-08-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDiff.h"
#import "SCKFlowConnection.h"

@interface SCKFlowConnectionDiff : NSObject <SCKDiff>

- (nonnull instancetype)initWithObject:(nonnull SCKFlowConnection *)object comparedTo:(nonnull SCKFlowConnection *)otherObject;

@property (nonatomic, copy, nonnull, readonly) SCKFlowConnection *object;
@property (nonatomic, copy, nonnull, readonly) SCKFlowConnection *comparedObject;

@property (nonatomic, assign, readonly) SCKFlowConnectionAttributes attributes;

@end

@interface SCKFlowConnection (SCKDiff) <SCKDiffable>

- (nonnull SCKFlowConnectionDiff *)diffComparedTo:(nonnull SCKFlowConnection *)object;

@end
