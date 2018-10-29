//  Created by Robin Speijer on 07-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDiff.h"
#import "SCKArtboard.h"

@interface SCKArtboardDiff : NSObject <SCKDiff>

- (nonnull instancetype)initWithObject:(nonnull SCKArtboard *)object comparedTo:(nonnull SCKArtboard *)otherObject;
@property (nonatomic, copy, nonnull, readonly) SCKArtboard *object;
@property (nonatomic, copy, nonnull, readonly) SCKArtboard *comparedObject;

@property (nonatomic, readonly) SCKArtboardAttributes attributes;

@end

@interface SCKArtboard (SCKDiff) <SCKDiffable>

- (nonnull SCKArtboardDiff *)diffComparedTo:(nonnull SCKArtboard *)object;

@end
