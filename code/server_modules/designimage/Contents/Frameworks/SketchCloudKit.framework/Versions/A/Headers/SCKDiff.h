//  Created by Robin Speijer on 07-02-17.
//  Copyright © 2017 Bohemian Coding. 

@class SCKObject;
@protocol SCKDiffable;

@protocol SCKDiff <NSObject>

- (nonnull instancetype)initWithObject:(nonnull id)object comparedTo:(nonnull id)otherObject;

@property (nonatomic, copy, nonnull, readonly) id object;
@property (nonatomic, copy, nonnull, readonly) id comparedObject;

@property (nonatomic, readonly) BOOL objectsAreEqual;

@end

@protocol SCKDiffable <NSObject>

- (nonnull id<SCKDiff>)diffComparedTo:(nonnull SCKObject<SCKDiffable> *)object;

@end
