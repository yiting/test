//  Created by Pieter Omvlee on 19/09/2011.
//  Copyright (c) 2014 Bohemian Coding. All rights reserved.

/**
 * BCRect is a protocol that defines how rect-like instances should behave.
 * BCRect implements the protocol, but so do a few other objects which act as rects
 */

@protocol BCRect <NSObject>
@property (nonatomic) CGRect rect;
@property (nonatomic) CGFloat x,y, width, height, maxX, maxY;
@property (nonatomic) CGPoint origin;
@property (nonatomic) CGSize size;
@end

@interface BCRect : NSObject <NSCopying, BCRect>

#pragma mark - Creating Rects
+ (instancetype)rectWithRect:(CGRect)aRect;
- (id)initWithRect:(CGRect)aRect;

#pragma mark - Basic Properties
@property (nonatomic) CGRect rect;
@property (nonatomic) CGFloat x,y, width, height, midX, midY, minX, minY, maxX, maxY;
@property (nonatomic) CGPoint origin, mid;
@property (nonatomic) CGSize size;
@end
