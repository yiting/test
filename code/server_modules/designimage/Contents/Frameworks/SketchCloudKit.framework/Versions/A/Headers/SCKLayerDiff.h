//  Created by Robin Speijer on 16-08-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDiff.h"
#import "SCKLayer.h"

@class SCKLayer;

@interface SCKLayerDiff : NSObject <SCKDiff>

- (nonnull instancetype)initWithObject:(nonnull SCKLayer *)object comparedTo:(nonnull SCKLayer *)otherObject;

@property (nonatomic, copy, nonnull, readonly) SCKLayer *object;
@property (nonatomic, copy, nonnull, readonly) SCKLayer *comparedObject;

@property (nonatomic, assign, readonly) SCKLayerAttributes attributes;

@end

@interface SCKLayer (SCKDiff) <SCKDiffable>

- (nonnull SCKLayerDiff *)diffComparedTo:(nonnull SCKLayer *)object;

@end
